# Matomo to Mixpanel converter

The converter reads uncompressed Matomo MySQL dumps or Matomo visit/action JSON
and writes NDJSON for the Mixpanel [Import API](https://docs.mixpanel.com/reference/import-events).
SQL and JSON inputs export **all supported events from Matomo site 8
(`developer.pagopa.it`) by default**. No site or event-selection parameter is
needed. The command-line readers accept only site 8; `--site-id 8` and
`--all-events` remain compatibility options for older commands.

Python >=3.12,<3.14 on Linux/WSL and the system `Europe/Rome` timezone database are required.
No third-party Python packages or platform credentials are needed.

From the repository root:

```bash
python3 scripts/matomo-to-mixpanel/main.py /path/to/matomo.sql
python3 scripts/matomo-to-mixpanel/main.py scripts/matomo-to-mixpanel/input/10
python3 -m unittest discover -s scripts/matomo-to-mixpanel -p 'test_*.py' -v
```

Place one or more uncompressed `.sql` files in `scripts/matomo-to-mixpanel/input/`
and run `main.py`. It discovers SQL dumps recursively and writes a new timestamped
directory in `output/`. Both directories ignore data in Git. Mixed directories
prefer SQL and do not process JSON alongside it. Pass a JSON month directory
explicitly, such as `input/10`, when converting the daily JSON files.

## SQL input through main.py

`main.py` recognizes an **uncompressed `.sql` mysqldump** and calls the reader
in `from_sql.py` to write Mixpanel NDJSON locally. It does not execute the dump,
restore a MySQL server, or upload anything. Only the Python standard library is
required.

For the simplest workflow, place the uncompressed `.sql` file in `input/`
and run `python3 scripts/matomo-to-mixpanel/main.py` without parameters.
It processes site 8 across all dates, reports visit counts and the
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
- `from_json.py`: restored visit/action JSON reading, event selection and bounded output parts.
- `sql_pipeline.py`: conversion phases, numbered output parts and recovery checkpoints.
- `sql_storage.py`: compact SQLite storage, bounded lookup caching and disk-space checks.

Run `main.py`; keep the converter source files together when copying the tool to
a Linux server. No application build, npm package release or cloud deployment is
required. The `test_*.py` files contain synthetic validation data and are not needed
to run the converter.

Alternatively, restrict a test to one day and site:

```bash
python3 scripts/matomo-to-mixpanel/main.py /path/to/matomo.sql \
  \
  --from-date 2026-06-07 \
  --to-date 2026-06-07
```

An explicit SQL path also selects site 8 automatically. Other site IDs and
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
All dates for site 8 remain included by default, including page-performance
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

## Visit/action JSON through main.py

The reader accepts a single JSON file or a directory of daily visit arrays with
`actionDetails`. It retains all supported event types from site 8 automatically:
pageviews, downloads, outbound links, custom events, crashes, media interactions
and site searches. Other sites are excluded. The existing event mapping and IDs
are preserved. Aggregate reports and API error objects are rejected; Windows
`:Zone.Identifier` sidecars are ignored.

To export complete October data:

```bash
python3 scripts/matomo-to-mixpanel/main.py scripts/matomo-to-mixpanel/input/10
```

To count without writing event files:

```bash
python3 scripts/matomo-to-mixpanel/main.py scripts/matomo-to-mixpanel/input/10 \
  --count-only --output-dir scripts/matomo-to-mixpanel/output/october-site8-count
```

No `--site-id` or `--all-events` flag is needed. The direct `from_json.py` entry
point has the same defaults. Compatibility options cannot select another site.
SQL already exports all supported event types. The command-line behavior is
specific to the `matomo-to-mixpanel` branch; the separate `pageviews-only` branch
selects pageviews by default.

Optional `--from-date` and `--to-date` select inclusive **actual event dates** in
Europe/Rome, including DST transitions. A visit starting before the period can
still contribute events inside it. SQL dates instead select visits by their first
action, as documented above. SQL-only flags (`--resume`, `--table-prefix`,
`--include-unplayed-media`) are rejected for JSON input.

The reader processes one JSON file at a time (64 MiB maximum), verifies source
fingerprints, detects duplicate/conflicting IDs across files and packs events
into parts of at most 2,000 events and 8 MiB by default. `--part-events` and
`--part-mib` adjust the limits. The duplicate index grows with the selected count.
Disk-space checks and an output lock also apply.

Each run writes `report.json`, `summary.txt` and redacted `issues.ndjson`.
Export runs publish event files and `manifest.json` only after all inputs finish;
count-only runs write no payload or manifest. Invalid visits or rejected actions
produce `completed_with_errors` and exit code 1; accepted events remain available
in the manifest. Fatal errors leave no manifest. JSON runs require a new output
directory and do not support resume. Reports include counts by event type,
filtered dates, duplicates, errors and first/last retained timestamps.

The supplied complete October data produces 68,707 accepted events in 35 parts,
73,334,279 bytes: 62,553 pageviews, 4,014 outbound links, 1,204 downloads, 510 custom
events, 418 crashes and 8 media interactions. Another 46 crash actions fail the
existing timestamp/visit-bound validation and remain rejected. Nothing is
uploaded during conversion; historical ingestion remains a separate decision.

## Developer Portal scope and historical counts

The SQL `site` table has ten configured sites; nine have visits in the converted
history. The provided daily JSON exports contain only site 8, `developer.pagopa.it`.
The Developer Portal counts from the completed SQL export are:

| Site-8 SQL scope | Accepted pageviews |
| --- | --- |
| Entire SQL history, ending 2026-10-07 | 1,250,834 |
| Inclusive event dates from 2024-11-04 (reference date 2026-11-04) | 1,220,644 |
| September 2026 | 56,727 |
| Partial October, through 2026-10-07 | 14,259 |

Replacing the partial SQL October with the complete site-8 October JSON gives
1,299,128 historical pageviews before applying a date cutoff, or 1,268,938 from
2024-11-04. The prepared export below applies this replacement. Do not add the
entire JSON October to the entire SQL history: October 1-7 overlaps.

For comparison, including all supported event types with the same October
replacement gives:

| Site-8 scope through 2026-10-31 | All accepted event types | Pageviews only |
| --- | --- | --- |
| Entire history | 1,651,240 | 1,299,128 |
| Inclusive event dates from 2024-11-04 | 1,616,259 | 1,268,938 |

The all-event totals exclude SQL source rejections and media skipped by the
original conversion, plus the 46 rejected crash actions in the complete October
JSON. The prepared export below contains the entire-history selection.

The date cutoff is explicit and must be refreshed for the actual import date.
The command-line SQL/JSON readers are fixed to site 8. Their reusable internal
mapping/storage functions retain explicit selection support for tests and other callers.

September's JSON has three more pageviews than the accepted SQL export. Those
three action IDs occur in the original SQL rejection log as `Unsupported SQL
action type`; the API JSON identifies them as pageviews and the shared JSON
mapping validates them. August's accepted pageview totals match exactly. The
prepared history retains SQL data through September and replaces October only.

## Prepared Developer Portal history

The combined local export is `output/site8-history-through-2026-10/`. It contains
all available accepted event types for site 8, from 2024-09-17 through 2026-10-31:
1,651,240 events, including 1,299,128 pageviews, in 826 compact parts totaling
2,021,655,657 uncompressed bytes. The original event payloads and stable IDs are
preserved. Partial SQL October (15,672 events) was replaced by the complete
October JSON (68,707 accepted events); no duplicate IDs remain.

The two-year cutoff has **not** been applied to these files. The reference counts
from 2024-11-04 remain 1,616,259 events and 1,268,938 pageviews. Refresh the cutoff
for the eventual import date before preparing the selected import subset. The historical import remains paused; preparation makes no HTTP
requests.

The export's main `manifest.json` records part names, event counts, sizes and
SHA-256 checksums for compatible importers. Local artifact validation has already
checked every part; an importer is not required to generate SQL or JSON exports.

`report.json` contains event-type/month totals, replacement counts and source
manifest hashes; `summary.txt` provides a readable summary. `validation.json`
records the full independent verification. `provenance/` retains earlier reports,
source rejections, preparation/validation methods and prior upload-test state.
Archived manifests describe superseded source parts and must not be uploaded or
used to resume the new export. The original SQL dump and all daily JSON inputs
remain in `input/`.
