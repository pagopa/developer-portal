"""Count or export only Page Viewed events from a completed Mixpanel manifest."""

import argparse
import hashlib
import json
import math
import os
import sqlite3
import sys
import time
from collections import Counter, deque
from collections.abc import Generator
from concurrent.futures import ProcessPoolExecutor
from contextlib import closing
from datetime import UTC, date, datetime
from multiprocessing import get_context
from pathlib import Path
from typing import Any

from main import DEFAULT_SITE_ID, SCRIPT_DIR, matches_pageview
from sql_pipeline import atomic_json
from sql_storage import DiskGuard
from upload import Manifest, Part, locked

PAGEVIEW_EVENT = "Page Viewed"
STATE_FILE = "filter-state.sqlite3"


def is_pageview(event: dict[str, Any]) -> bool:
    return event.get("event") == PAGEVIEW_EVENT


def signature(path: Path) -> list[int]:
    if path.is_symlink():
        raise ValueError(f"Symbolic links are not supported: {path.name}")
    stat = path.stat()
    return [stat.st_dev, stat.st_ino, stat.st_size, stat.st_mtime_ns, stat.st_ctime_ns]


def select_part(manifest: Manifest, part: Part, site_id: int | None = None,
                start: date | None = None, end: date | None = None) -> tuple[bytes, dict[str, int]]:
    """Validate every source event, then retain its original bytes and line ending."""
    events: list[dict[str, Any]] = []
    payload = manifest.read_part(part, events=events)
    selected = []
    counts: Counter[str] = Counter()
    for line, event in zip(payload.splitlines(keepends=True), events, strict=True):
        counts[event["event"]] += 1
        if matches_pageview(event, site_id, start, end):
            selected.append(line)
    return b"".join(selected), dict(counts)


def read_source_part(manifest: Manifest, part: Part, site_id: int | None = None,
                     start: date | None = None, end: date | None = None
                     ) -> tuple[bytes, dict[str, int], list[int]]:
    path = manifest.path.parent / part.name
    source_signature = signature(path)
    selected, counts = select_part(manifest, part, site_id, start, end)
    if signature(path) != source_signature:
        raise ValueError(f"Source part changed while reading: {part.name}")
    return selected, counts, source_signature


def selected_parts(
    manifest: Manifest, parts: tuple[Part, ...], workers: int,
    site_id: int | None = None, start: date | None = None, end: date | None = None,
) -> Generator[tuple[Part, bytes, dict[str, int], list[int]], None, None]:
    if workers == 1:
        for part in parts:
            yield part, *read_source_part(manifest, part, site_id, start, end)
        return
    # Workers need only the manifest path, not a copy of its complete part list.
    reader = Manifest(manifest.path, manifest.sha256, manifest.status, (), manifest.events)
    with ProcessPoolExecutor(max_workers=workers, mp_context=get_context("spawn")) as executor:
        pending = deque()
        iterator = iter(parts)
        for _ in range(2 * workers):
            part = next(iterator, None)
            if part is not None:
                pending.append((part, executor.submit(read_source_part, reader, part, site_id, start, end)))
        while pending:
            part, future = pending.popleft()
            result = future.result()
            following = next(iterator, None)
            if following is not None:
                pending.append((following, executor.submit(read_source_part, reader, following, site_id, start, end)))
            # Commit in source order, retaining at most 2 * workers pending parts.
            yield part, *result


def write_part(output: Path, name: str, payload: bytes) -> dict[str, Any]:
    temporary = output / name.replace(".ndjson", ".partial.ndjson")
    destination = output / name
    if destination.exists():
        raise ValueError(f"Output already exists: {name}")
    with temporary.open("xb") as stream:
        stream.write(payload)
        stream.flush()
        os.fsync(stream.fileno())
    temporary.replace(destination)
    directory_fd = os.open(output, os.O_RDONLY | os.O_DIRECTORY)
    try:
        os.fsync(directory_fd)
    finally:
        os.close(directory_fd)
    return {"file": name, "events": len(payload.splitlines()), "bytes": len(payload),
            "sha256": hashlib.sha256(payload).hexdigest()}


class State:
    """Checkpoint one source part and its counters in each small transaction."""

    def __init__(self, db: sqlite3.Connection, identity: dict[str, Any], resume: bool) -> None:
        self.db = db
        if resume:
            row = db.execute("SELECT identity FROM filter_metadata WHERE id=1").fetchone()
            if row is None or json.loads(row[0]) != identity:
                raise ValueError("Source manifest or count-only mode changed, or selection changed; use a new output directory")
        else:
            with db:
                db.execute("CREATE TABLE filter_metadata (id INTEGER PRIMARY KEY, identity TEXT NOT NULL)")
                db.execute("INSERT INTO filter_metadata VALUES (1, ?)", (json.dumps(identity),))
                db.execute("""CREATE TABLE filter_parts (
                    seq INTEGER PRIMARY KEY, source_file TEXT NOT NULL UNIQUE,
                    signature TEXT NOT NULL, counts TEXT NOT NULL, kept_bytes INTEGER NOT NULL,
                    output_part TEXT, retained_events INTEGER NOT NULL
                )""")

    def rows(self) -> list[tuple[Any, ...]]:
        return self.db.execute("SELECT seq, source_file, signature, counts, kept_bytes, output_part, retained_events "
                               "FROM filter_parts ORDER BY seq").fetchall()

    def save(self, seq: int, part: Part, source_signature: list[int], counts: dict[str, int],
             kept_bytes: int, output_part: dict[str, Any] | None, retained_events: int) -> None:
        with self.db:
            self.db.execute("INSERT INTO filter_parts VALUES (?, ?, ?, ?, ?, ?, ?)", (
                seq, part.name, json.dumps(source_signature), json.dumps(counts), kept_bytes,
                json.dumps(output_part) if output_part else None, retained_events))


def recover(state: State, manifest: Manifest, output: Path, count_only: bool) -> None:
    rows = state.rows()
    committed = set()
    if len(rows) > len(manifest.parts):
        raise ValueError("Checkpoint contains more parts than the source manifest")
    for expected, row in enumerate(rows):
        seq, name, saved_signature, _, _, saved_part = row[:6]
        part = manifest.parts[expected]
        if seq != expected or name != part.name:
            raise ValueError("Checkpoint order does not match the source manifest")
        if signature(manifest.path.parent / name) != json.loads(saved_signature):
            raise ValueError(f"Previously processed source part changed: {name}")
        if saved_part:
            item = json.loads(saved_part)
            if count_only or item["file"] != name:
                raise ValueError("Checkpoint output does not match this filtering run")
            path = output / name
            signature(path)
            digest = hashlib.sha256()
            with path.open("rb") as stream:
                for block in iter(lambda: stream.read(1024 * 1024), b""):
                    digest.update(block)
            if path.stat().st_size != item["bytes"] or digest.hexdigest() != item["sha256"]:
                raise ValueError(f"Previously written pageviews changed: {name}")
            committed.add(name)
    # Only this run's uncommitted generated files may be removed during recovery.
    pending = {part.name for part in manifest.parts[len(rows):]}
    pending.update(name.replace(".ndjson", ".partial.ndjson") for name in list(pending))
    generated = list(output.glob("events-*.ndjson"))
    if any(path.name not in committed | pending or path.is_symlink() for path in generated):
        raise ValueError("Unexpected event files in the output directory")
    for path in generated:
        if path.name in pending:
            path.unlink()


def build_report(state: State, manifest: Manifest, count_only: bool) -> dict[str, Any]:
    rows = state.rows()
    counts: Counter[str] = Counter()
    for row in rows:
        counts.update(json.loads(row[3]))
    processed = sum(counts.values())
    kept = sum(row[6] for row in rows)
    excluded = processed - kept
    complete = len(rows) == len(manifest.parts)
    if processed != sum(part.events for part in manifest.parts[:len(rows)]):
        raise ValueError("Processed event counts do not match the source manifest")
    excluded_counts = dict(counts)
    excluded_counts[PAGEVIEW_EVENT] = counts[PAGEVIEW_EVENT] - kept
    return {
        "status": "completed" if complete else "incomplete", "count_only": count_only,
        "source_manifest": str(manifest.path), "source_manifest_sha256": manifest.sha256,
        "source_status": manifest.status, "source_events": manifest.events,
        "source_files": len(manifest.parts), "processed_files": len(rows),
        "processed_events": processed, "kept_events": kept, "excluded_events": excluded,
        "reduction_percent": 100 * excluded / processed if processed else 0,
        "filtered_pageviews": counts[PAGEVIEW_EVENT] - kept,
        "events_by_type": dict(sorted(counts.items())),
        "excluded_by_type": dict(sorted((name, count) for name, count in excluded_counts.items() if count)),
        "processed_bytes": sum(part.size for part in manifest.parts[:len(rows)]),
        "kept_bytes": sum(row[4] for row in rows),
        "expected_output_files": sum(row[6] > 0 for row in rows),
        "output_files": sum(row[5] is not None for row in rows),
    }


def format_summary(report: dict[str, Any]) -> str:
    mode = "Count" if report["count_only"] else "Pageview export"
    lines = [f"{mode} {report['status']}.", "",
             f"- Site selection: {report.get('site_id') if report.get('site_id') is not None else 'all sites'}.",
             f"- Event dates (Europe/Rome): {report.get('from_date') or 'unbounded'} to {report.get('to_date') or 'unbounded'}.",
             f"- Source: {report['source_events']:,} events in {report['source_files']:,} parts.",
             f"- Processed: {report['processed_events']:,} events in {report['processed_files']:,} parts.",
             f"- Pageviews retained: {report['kept_events']:,}.",
             f"- Events excluded: {report['excluded_events']:,} ({report['reduction_percent']:.2f}%).",
             f"- Pageview payload: {report['kept_bytes']:,} bytes "
             f"({report['kept_bytes'] / 1024**3:.2f} GiB) in {report['expected_output_files']:,} parts.",
             f"- Source conversion status: {report['source_status']}.",
             "- Source rejections and previously skipped media are outside these counts.",
             "", "Excluded events by type:"]
    lines.extend(f"- {name}{' (outside selected site/date)' if name == PAGEVIEW_EVENT else ''}: {count:,}."
                 for name, count in report["excluded_by_type"].items())
    if not report["excluded_by_type"]:
        lines.append("- None.")
    if report["count_only"]:
        lines.extend(["", "Count-only mode: no event files or upload manifest were written."])
    elif report["status"] != "completed":
        lines.extend(["", "Incomplete export: no upload manifest was published. Resume to finish."])
    return "\n".join(lines) + "\n"


class Progress:
    def __init__(self, total: int, processed: int, kept: int) -> None:
        self.total, self.initial = total, processed
        self.started = self.last = time.monotonic()
        self.processed, self.kept = processed, kept

    def report(self, *, force: bool = False) -> None:
        now = time.monotonic()
        if not force and now - self.last < 5:
            return
        elapsed = max(now - self.started, 0.001)
        rate = (self.processed - self.initial) / elapsed
        eta = f"{int((self.total - self.processed) / rate)}s" if rate else "calculating"
        percent = 100 * self.processed / self.total if self.total else 100
        print(f"Filtered {self.processed:,}/{self.total:,} events ({percent:.1f}%) | "
              f"Pageviews {self.kept:,} | Excluded {self.processed - self.kept:,} | "
              f"{rate:,.0f} events/s | Remaining {eta}", flush=True)
        self.last = now


def run(manifest_path: Path, output: Path, *, count_only: bool = False,
        resume: bool = False, max_files: int | None = None,
        reserve_bytes: int = 2 * 1024**3, host_volume: Path | None = None,
        workers: int = 1, site_id: int | None = DEFAULT_SITE_ID,
        start: date | None = None, end: date | None = None) -> dict[str, Any]:
    if max_files is not None and max_files < 1:
        raise ValueError("--max-files must be positive")
    if reserve_bytes < 0:
        raise ValueError("Disk reserve must not be negative")
    if not 1 <= workers <= 8:
        raise ValueError("--workers must be between 1 and 8")
    if site_id is not None and site_id <= 0:
        raise ValueError("--site-id must be positive")
    if start and end and end < start:
        raise ValueError("End date must not precede start date")
    manifest = Manifest.load(manifest_path)
    output = output.resolve()
    source_dir = manifest.path.parent
    if output.is_relative_to(source_dir) or source_dir.is_relative_to(output):
        raise ValueError("Output must be separate from the source export directory")
    identity = {"version": 2, "manifest": str(manifest.path), "sha256": manifest.sha256,
                "count_only": count_only, "site_id": site_id,
                "from_date": str(start) if start else None, "to_date": str(end) if end else None}
    with locked(source_dir / ".conversion.lock", create=False):
        if resume:
            if not (output / STATE_FILE).is_file():
                raise ValueError("No filter checkpoint found; start with a new output directory")
        else:
            output.mkdir(parents=True, exist_ok=False)
        guard = DiskGuard(output, reserve_bytes, host_volume)
        guard.check(force=True)
        # Share the converter's lock name so the existing uploader also respects it.
        with locked(output / ".conversion.lock"), closing(sqlite3.connect(output / STATE_FILE)) as db:
            state = State(db, identity, resume)
            if resume:
                recover(state, manifest, output, count_only)
            # WAL avoids recreating a rollback journal for every durable part checkpoint.
            db.execute("PRAGMA journal_mode=WAL")
            db.execute("PRAGMA synchronous=FULL")
            report = build_report(state, manifest, count_only)
            progress = Progress(manifest.events, report["processed_events"], report["kept_events"])
            first_part = report["processed_files"]
            stop = min(len(manifest.parts), first_part + max_files) if max_files else len(manifest.parts)
            try:
                with closing(selected_parts(manifest, manifest.parts[first_part:stop], workers, site_id, start, end)) as selections:
                    for seq, (part, selected, counts, source_signature) in enumerate(selections, first_part):
                        guard.check()
                        output_part = write_part(output, part.name, selected) if selected and not count_only else None
                        retained_events = len(selected.splitlines())
                        state.save(seq, part, source_signature, counts, len(selected), output_part, retained_events)
                        progress.processed += part.events
                        progress.kept += retained_events
                        progress.report()
            except BaseException:
                # Summarize only durable checkpoints, even if an output write was interrupted.
                try:
                    save_report(state, manifest, output, count_only)
                except (OSError, ValueError, sqlite3.Error):
                    print("Could not save the incomplete report; checkpoints remain available.", file=sys.stderr)
                raise
            progress.report(force=True)
            report = save_report(state, manifest, output, count_only)
            if report["status"] == "completed" and not count_only:
                files = [json.loads(row[5]) for row in state.rows() if row[5]]
                atomic_json(output / "manifest.json", {"status": manifest.status,
                                                       "events": report["kept_events"], "files": files})
            return report


def save_report(state: State, manifest: Manifest, output: Path, count_only: bool) -> dict[str, Any]:
    report = build_report(state, manifest, count_only)
    selection = json.loads(state.db.execute('SELECT identity FROM filter_metadata WHERE id=1').fetchone()[0])
    report.update({key: selection[key] for key in ('site_id', 'from_date', 'to_date')})
    atomic_json(output / "report.json", report)
    (output / "summary.txt").write_text(format_summary(report), encoding="utf-8")
    return report


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", type=Path, nargs="?",
                        default=SCRIPT_DIR / "output" / "site8-history-through-2026-10" / "manifest.json",
                        help="Source manifest (default: prepared site-8 history)")
    parser.add_argument("--output-dir", type=Path, help="Separate directory for reports/checkpoints and any event files")
    parser.add_argument("--count-only", action="store_true", help="Validate and count without writing event files")
    parser.add_argument("--site-id", type=int, choices=(DEFAULT_SITE_ID,), default=DEFAULT_SITE_ID,
                        help="Compatibility option; the site is fixed to Developer Portal (8)")
    parser.add_argument("--from-date", type=date.fromisoformat, help="First inclusive Rome event date")
    parser.add_argument("--to-date", type=date.fromisoformat, help="Last inclusive Rome event date")
    parser.add_argument("--resume", action="store_true", help="Resume the same output directory and mode")
    parser.add_argument("--max-files", type=int, help="Process at most this many pending source parts")
    parser.add_argument("--workers", type=int, default=1, help="Parallel readers (1-8, default: 1); checkpoints stay ordered")
    parser.add_argument("--min-free-gib", type=float, default=2, help="Free disk reserve in GiB (default: 2)")
    parser.add_argument("--host-volume", type=Path, help="Host volume to check (WSL default: /mnt/c)")
    args = parser.parse_args(argv)
    if args.resume and args.output_dir is None:
        parser.error("--resume requires --output-dir")
    if not math.isfinite(args.min_free_gib) or args.min_free_gib < 0:
        parser.error("--min-free-gib must be finite and nonnegative")
    mode = "count" if args.count_only else "export"
    output = args.output_dir or SCRIPT_DIR / "output" / datetime.now(UTC).strftime(
        f"pageviews-{mode}-%Y%m%dT%H%M%S-%fZ")
    print(f"Output directory: {output}", flush=True)
    try:
        report = run(args.manifest, output, count_only=args.count_only, resume=args.resume,
                     max_files=args.max_files, reserve_bytes=int(args.min_free_gib * 1024**3),
                     host_volume=args.host_volume, workers=args.workers, site_id=args.site_id,
                     start=args.from_date, end=args.to_date)
    except KeyboardInterrupt:
        print(f"Interrupted. Repeat the same command with --resume --output-dir {output}", file=sys.stderr)
        return 130
    except (OSError, ValueError, sqlite3.Error) as error:
        print(f"Filtering failed: {error}", file=sys.stderr)
        return 1
    print("\n" + format_summary(report), end="", flush=True)
    print(f"Detailed report: {output / 'report.json'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
