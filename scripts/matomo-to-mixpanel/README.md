# Matomo SQL to Mixpanel converter

DEV-4553 converts an uncompressed Matomo MySQL dump to NDJSON for the Mixpanel
[Import API](https://docs.mixpanel.com/reference/import-events). It accepts only
SQL dumps; JSON exports are intentionally not supported.

Python >=3.12,<3.14 on Linux/WSL and the system `Europe/Rome` timezone database are required.
No third-party Python packages or platform credentials are needed.

From the repository root:

```bash
python3 scripts/matomo-to-mixpanel/main.py
python3 scripts/matomo-to-mixpanel/main.py /path/to/matomo.sql
python3 -m unittest discover -s scripts/matomo-to-mixpanel -p 'test_*.py' -v
```

Place one or more uncompressed `.sql` files in `scripts/matomo-to-mixpanel/input/`
and run `main.py`. It discovers SQL dumps recursively and writes a new timestamped
directory in `output/`. Both directories ignore data in Git.

## SQL input through main.py

`main.py` recognizes an **uncompressed `.sql` mysqldump** and calls the reader
in `from_sql.py` to write Mixpanel NDJSON locally. It does not execute the dump,
restore a MySQL server, or upload anything. Only the Python standard library is
required.

For the simplest workflow, place the uncompressed `.sql` file in `input/`
and run `python3 scripts/matomo-to-mixpanel/main.py` without parameters.
It processes all sites and dates, reports site IDs with visit counts and the
observed date range, and writes one output directory per SQL file under
`output/sql-.../files/`. The run's `summary.json` lists each input, exit code
and report path. Individual `report.json` files hold conversion totals.
At completion, the terminal shows a readable summary with converted/rejected
totals, intentionally skipped media, NDJSON part count, visit dates, reasons for
rejection and warning counts. It is also saved as `summary.txt` next to each dump's
`report.json`; you can read it without opening the JSON report. Warning counts
refer to warnings on converted events, and one event may have multiple warnings.
Multiple SQL dumps may overlap; the reader does not deduplicate across files.

The source files are split by responsibility:

- `main.py`: command-line entry point and shared event mapping/validation.
- `from_sql.py`: SQL parsing, table joins, page durations and readable summaries.
- `sql_pipeline.py`: conversion phases, numbered output parts and recovery checkpoints.
- `sql_storage.py`: compact SQLite storage, bounded lookup caching and disk-space checks.

Run only `main.py`; keep all four source files together when copying the tool to
a Linux server. No application build, npm package release or cloud deployment is
required. The `test_*.py` files contain synthetic validation data and are not needed
to run the converter.

Alternatively, restrict a test to one day and site:

```bash
python3 scripts/matomo-to-mixpanel/main.py /path/to/matomo.sql \
  --site-id 8 \
  --from-date 2026-06-07 \
  --to-date 2026-06-07
```

An explicit SQL path also works without any filters. Nonpositive site IDs and
reversed date ranges are rejected before creating output.

When supplied, dates are inclusive and select visits by their first action's **Europe/Rome
calendar date**. All supported actions belonging to those visits are considered,
including actions after midnight. SQL datetimes are interpreted as UTC; unlike the
API wall-clock timestamps they are already unambiguous. No credentials are needed.
Use `--table-prefix matomo_` for a prefixed database, and `--output-dir /tmp/new-run`
to choose a new output directory. Existing output requires an explicit `--resume`.

The reader first indexes table definitions and INSERT locations, then stages
selected records and lookup dictionaries in a local SQLite file. It reads one
INSERT line at a time, with a 64 MiB limit, and does not load the full dump into
memory. Filtering a day still requires scanning the dump and relevant tables;
expect substantial disk I/O and CPU time for a 37 GiB dump. Free disk space is
also needed for `staging.sqlite` and output. The SQLite file contains source data
and is retained for inspection; it is not an upload payload.

Progress is printed approximately every five seconds with a percentage and an
estimated remaining time for the **current phase**, not the entire run:
indexing, reading each table, calculating page durations, and writing events.
Indexing and table-reading percentages use bytes, because the dump does not
provide row totals. Duration calculation and event writing use staged row counts.
Sorting actions may initially show 0% with the estimate still calculating.
Estimates vary with disk speed and record complexity; they are not deadlines.

The SQL reader stages only columns used by the existing mapping, validation,
identifiers and joins, using native SQLite values instead of full JSON rows.
All sites and dates remain included by default, including page-performance
components and consumed media segments. Insert buffers are limited to 5,000 rows
or approximately 8 MiB, the database cache to 64 MiB, and lookup caching to
2,048 small records or approximately 8 MiB. Each complete source INSERT is a
transaction/checkpoint. An individual input line can still occupy up to 64 MiB.
These limits do not represent a total process-memory cap.

Events are written sequentially into numbered parts, without reopening the dump
for each event type. Defaults are at most 2,000 events and 8 MiB per part, below
the [Import API request limits](https://docs.mixpanel.com/reference/import-events)
of 2,000 events and 10 MB uncompressed. Each part can contain multiple event
types and sites. `--part-events` (1–2000) and `--part-mib` (1–9) can lower or adjust
the limits. The action limit also defines export checkpoint frequency; rejected
and skipped actions can make a part contain fewer events.

### Disk space and recovery

The converter checks free space on the output filesystem and, on WSL, `/mnt/c`.
It stops when less than 2 GiB remains; use `--min-free-gib 5` for a larger reserve.
If the WSL virtual disk resides on another Windows volume, specify it with
`--host-volume /mnt/d`. Checks are periodic and cannot guarantee protection
against unrelated processes filling the disk. The virtual free space reported
inside WSL does not replace the host-volume check. SQLite sorting may also need
temporary space. Do not start multiple conversions on a nearly full drive.

Resume a run started with the default input folder by specifying its existing
top-level output directory:

```bash
python3 scripts/matomo-to-mixpanel/main.py \
  --resume --output-dir scripts/matomo-to-mixpanel/output/sql-YOUR-RUN
```

To find that directory after an interruption, run:

```bash
find scripts/matomo-to-mixpanel/output -name staging.sqlite
```

For example, if it prints
`scripts/matomo-to-mixpanel/output/sql-20261023T071008-618319/files/matomo.sql/staging.sqlite`,
use `scripts/matomo-to-mixpanel/output/sql-20261023T071008-618319` as
`--output-dir`. Do not use the nested `files/matomo.sql` path or the
`staging.sqlite` filename itself.

For a run started with an explicit SQL file, repeat that input path and use its
original `--output-dir`. Repeat any original filters, prefix and part-size options.
The source path, size, modification time, and hashes of its first/last MiB are
checked; this is a fast fingerprint, not a checksum of the entire dump. Do not
edit the dump during a run or between attempts. Completed part checksums are
verified before resuming. A lock prevents concurrent use of the same output.

During staging, resume starts at the next committed INSERT. An interruption in
page-duration calculation restarts that phase using the existing staged rows.
During export, resume starts at the last committed action checkpoint, keeping
completed parts and removing only uncommitted generated parts. Stable event IDs
and the persisted duplicate index prevent duplicate output after recovery.
Checkpoints survive normal interruption and simulated write errors; catastrophic
filesystem corruption is not recoverable by this mechanism. Failure before the
first checkpoint (for example while indexing) requires a new output directory.
Runs created by the previous generic SQLite format cannot be resumed.

Keep `staging.sqlite`, `issues.ndjson` and all output parts together until finished.
Do not upload files from a running or failed conversion: a numbered part may have
been written just before an uncommitted checkpoint. Use the final manifest only
after reviewing the final report. Directory processing stops at the first failed
dump; `summary.json` then lists attempted inputs, not necessarily every input.

Supported input: CREATE TABLE definitions followed by single-line extended
`INSERT INTO ... VALUES` statements, as in the supplied dump. Escaped strings,
NULL, numbers, `_binary` strings and hexadecimal literals are supported. Other
SQL dialects, compressed archives, explicit INSERT column lists, multiline INSERTs
and SQL expressions are rejected rather than executed or guessed.

Outputs:

- `events-00001.ndjson`, `events-00002.ndjson`, …: accepted Mixpanel events in
  bounded parts. `*.partial.ndjson` files are unfinished and must not be uploaded.
- `manifest.json`: final ordered part list, event counts, byte sizes and SHA-256
  checksums. Written only after conversion completes, possibly with reported rejections.
- `report.json`: completion status, selected visits, staged rows by table,
  converted/rejected actions, duplicates, skipped zero-watched-time media,
  warnings and absent optional tables.
- `summary.txt`: the readable completion summary also printed in the terminal.
- `issues.ndjson`: individual errors and warnings with SQL table and record IDs;
  kept separate so reports do not grow in memory with the history.
- `staging.sqlite`: compact source tables, lookup indexes, duplicate IDs and recovery
  checkpoints. It is not an import payload and is retained to permit resume.
- `.conversion.lock`: file used to prevent concurrent access; not an import payload.

The exit code is 1 for fatal errors, invalid visits or rejected actions, and 130
for a keyboard interruption. Inspect
`report.json` before using the output. `actions` excludes intentionally skipped
unplayed media; `staged_rows` contains source counts before that policy.

### SQL mapping

The supported event families are page views, downloads, outlinks, custom events,
searches, crashes and media. Other Matomo tables (such as aggregate reports,
goals/ecommerce, forms and recordings) are outside this reader's scope.
The reader joins `log_visit`, `log_link_visit_action`, `log_action`, `log_crash`,
`log_crash_event`, `log_crash_stack`, `log_media` and `log_media_plays`.

- Page/action and crash event IDs use a stable identity convention. Media use SQL
  `idview` to distinguish separate plays even when their resource and timestamp
  coincide.
- Nonnegative performance components become `time_network_ms`, `time_server_ms`,
  `time_transfer_ms`, `time_dom_processing_ms`, `time_dom_completion_ms` and
  `time_on_load_ms`; their sum becomes `page_load_time_ms`.
- Page duration is reconstructed from following actions' reference times and the
  visit duration, following the [Matomo Live page-duration logic](https://github.com/matomo-org/matomo/blob/5.x-dev/plugins/Actions/VisitorDetails.php).
- Consumed media segments become `media_consumed_segment_ends_seconds`, a list
  of segment endpoints with indicator 1. These indicate at least one second
  consumed in the interval, not that the whole interval was watched. Intervals
  are 15 seconds through the first 5 minutes, then 30 seconds; see the
  [Matomo media schema](https://github.com/matomo-org/developer-documentation/blob/live/docs/5.x/database-schema.md#log_media_plays).
- Zero-watched-time media are counted and skipped by default. Use
  `--include-unplayed-media` to retain them as **Media Observed**, not as plays.
- Browser, OS, device type/brand and region codes are retained as custom
  `matomo_config_browser_name`, `matomo_config_os`, `matomo_config_device_type`,
  `matomo_config_device_brand` and `matomo_location_region` properties. The API's
  human-readable browser/OS/device/region labels are not reproduced. Device
  model values are kept as stored, without API-generated fallback descriptions.
- Unsupported compressed crash stacks are omitted with a warning. Other optional
  strings retain the shared converter's 255-byte limit and warning behavior.
- Fields use the shared validation and URL handling of mapping version 2, with
  `source_format: matomo_sql` and `sql_mapping_version: 1` added.

Tests cover parser escaping, missing references, media segments, unplayed-media
policy, UTC autumn-fold handling, staging/export interruptions, duration rebuilds,
changed inputs/parts, concurrent resume, part limits and disk-pressure failures.
A synthetic comparison of 25,002 events against the previous reader produced
identical event contents and IDs: staging decreased from 28.27 MB to 5.69 MB.
With the final recovery checks and smaller output parts, one local run took
3.68 seconds before and 4.11 seconds after. The measured benefit is disk usage;
the extra checkpoints add overhead on this small sample. This sample included
unused visit columns; neither the size ratio nor timing predicts the full dump.
A first Mixpanel import test confirmed that page-performance fields and media
segments are accepted. A full 37 GiB conversion has also completed: 84,015,992
events converted, 3,654 actions rejected, and 1,146,067 unplayed media rows skipped.
Completion of the local conversion does not validate ingestion of the full
history; review the run's summaries and rejection reasons before import.

## Uploading a completed export to Mixpanel

`upload.py` sends the parts listed in one final `manifest.json`, in manifest
order, one request at a time. It requires Python >=3.12,<3.14 on Linux/WSL and
only the standard library. It does not rerun conversion or change the payloads,
timestamps or stable event identifiers. Copy `upload.py` to the machine holding
the export; the converter modules are not required to upload it.

The supplied export contains 84,015,992 events in 42,584 files, approximately
97.1 GB uncompressed. Only manifest-listed event parts are sent, never
`issues.ndjson`, partial files or `staging.sqlite`. A completed conversion with
reported rejections is accepted; review `report.json` to understand which source
actions were excluded. Parts can contain events from multiple Matomo sites.

### Host and credentials

The [official API overview](https://docs.mixpanel.com/reference/overview) lists
these ingestion hosts. Choose the one matching the destination project's data
residency, including when testing on a different project:

| Residency | `MIXPANEL_API_HOST` |
| --- | --- |
| EU (uploader default, matching the portal configuration) | `https://api-eu.mixpanel.com` |
| Standard | `https://api.mixpanel.com` |
| India | `https://api-in.mixpanel.com` |

The [Import API](https://docs.mixpanel.com/reference/import-events#authentication)
supports either authentication method below. Variables are read from the process
environment; `.env` files are not loaded automatically. `.env.default` lists the
supported variable names. Do not commit credentials or put them in command-line
arguments.

- **Project token:** set `MIXPANEL_PROJECT_TOKEN`. It becomes the HTTP Basic Auth
  username with an empty password. Leave the service account variables and
  `MIXPANEL_PROJECT_ID` unset or empty; token authentication omits `project_id`.
- **Service account:** set `MIXPANEL_SERVICE_ACCOUNT_USERNAME`,
  `MIXPANEL_SERVICE_ACCOUNT_SECRET` and `MIXPANEL_PROJECT_ID`. Leave the token
  unset or empty. The account needs Owner or Admin access for import. Its username
  and secret become HTTP Basic Auth credentials; `project_id` is a query parameter.

For example, a token can be entered without placing it in shell history:

```bash
export MIXPANEL_API_HOST=https://api-eu.mixpanel.com
read -r -s -p 'Mixpanel project token: ' MIXPANEL_PROJECT_TOKEN
export MIXPANEL_PROJECT_TOKEN
```

### Local validation, upload and resume

Validate the first two parts without credentials, network requests or upload
state writes. Use the nested manifest produced for a specific SQL dump:

```bash
python3 scripts/matomo-to-mixpanel/upload.py \
  scripts/matomo-to-mixpanel/output/sql-YOUR-RUN/files/matomo.sql/manifest.json \
  --dry-run --max-files 2
```

Omit `--max-files` to validate every part locally; this reads the entire export.
Validation checks the manifest, SHA-256, byte size, event count, JSON and required
event fields. `--dry-run` is independent of upload state and cannot use `--resume`.

**The following commands make real requests.** With credentials configured, a
limited initial upload is:

```bash
python3 scripts/matomo-to-mixpanel/upload.py /path/to/manifest.json --max-files 2
```

Then continue the same destination, skipping the confirmed parts:

```bash
python3 scripts/matomo-to-mixpanel/upload.py /path/to/manifest.json --resume
```

`--max-files` limits pending files per invocation, not total files in the export.
Without a limit, the uploader processes all pending files. Progress is printed
approximately every five seconds between requests and at completion: confirmed
files/events, percentage, event rate and estimated full-export remaining time.
The rate and estimate use work completed in the current process.

By default, checkpoints are stored in `upload-state.sqlite3` beside the manifest.
Use `--state-file /path/to/upload-laim.sqlite3` or a separate production state
file when uploading the same export to different destinations. Repeat the chosen
path with `--resume`. The state records the manifest hash, host and project
identity, per-file checksums, attempt counts and outcomes. Token identity is
hashed; credentials and authorization headers are not saved. A service account
secret can rotate without changing the target identity. Changing a project token,
authentication method or host requires a separate state file.

Every complete confirmation is committed immediately in a small SQLite
transaction. Existing state requires `--resume`; a changed manifest or destination
is rejected. A lock prevents simultaneous uploads using the same state. The
uploader also respects the converter's lock. Keep the state and lock files in
place, and do not edit the manifest or parts between attempts. Data and default
checkpoints under `output/` are ignored by Git.

### Requests and failures

Requests use `/import?strict=1`, `application/x-ndjson` and gzip. Limits apply
before compression: at most 2,000 events and 10 MB per request. Each part is
validated and sent unchanged; only one part and its compressed representation
are held at a time, in addition to the manifest/checkpoint metadata.

- `--timeout 60` controls each HTTP operation's timeout in seconds.
- `--max-retries 5` allows up to five retries after the first attempt. Network
  errors and HTTP 408, 429, 500, 502, 503 and 504 use exponential backoff, starting
  at two seconds and capped at 60 seconds, plus 1–5 seconds of jitter. A longer
  valid `Retry-After` is respected.
- A file is confirmed only after HTTP 200 with an `OK` response and an imported
  count matching the manifest. Invalid or inconsistent responses stop the run.
- Other HTTP errors stop without automatic retry. In particular, HTTP 400 may
  have accepted some records. Its reported count and failed-record references
  are saved with status `partial` or `failed`; the part is never marked confirmed.
  Inspect the state before attempting to resume after a data-validation error.
  Validation failures require investigation rather than repeated retries of
  unchanged invalid data. Raw response messages and event payloads are not logged.

Ctrl+C returns exit code 130; other failures return 1. Previously confirmed files
remain saved. On `--resume`, only unconfirmed parts are considered again. If a
request was accepted remotely just before an interruption or failed checkpoint,
its outcome can be unknown and that unconfirmed part may be sent again. Stable
`event`, `time`, `distinct_id` and `$insert_id` values support Mixpanel's
[report deduplication](https://docs.mixpanel.com/reference/event-deduplication);
raw exports can still contain duplicates. The uploader does not promise exactly
one network delivery per event.

### Offline tests

```bash
python3 -m unittest discover -s scripts/matomo-to-mixpanel -p 'test_*.py' -v
```

`test_upload.py` uses synthetic manifests and mocked HTTP responses. Tests cover
authentication, request headers, compression, retries, partial acceptance,
interruption before checkpoint, confirmed-file skipping, changed inputs/targets,
locks and validation without credentials. No actual uploads are needed to run
the suite.
