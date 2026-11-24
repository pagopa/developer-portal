"""Read Matomo visit/action JSON locally and export selected event families."""

import argparse
import fcntl
import hashlib
import json
import math
import sys
import time
from datetime import UTC, date, datetime
from pathlib import Path
from typing import Any

from main import DEFAULT_SITE_ID, PAGEVIEWS_ONLY, ROME, SCRIPT_DIR, convert_action, identifier, matches_event
from sql_pipeline import Parts, atomic_json
from sql_storage import DiskGuard

MAX_JSON_BYTES = 64 * 1024**2


def reject_nonfinite(value: str) -> None:
    raise ValueError('Nonfinite JSON numbers are not supported')


def file_signature(path: Path) -> tuple[int, int, int, int, int]:
    stat = path.stat()
    return stat.st_dev, stat.st_ino, stat.st_size, stat.st_mtime_ns, stat.st_ctime_ns


def read_visits(source: Path) -> tuple[list[Any], dict[str, Any]]:
    """Restore the previous JSON reader's visit-array input, with bounded reads."""
    before = file_signature(source)
    with source.open('rb') as stream:
        raw = stream.read(MAX_JSON_BYTES + 1)
    if len(raw) > MAX_JSON_BYTES:
        raise ValueError(f"JSON input exceeds 64 MiB: {source.name}")
    try:
        data = json.loads(raw.decode('utf-8'), parse_constant=reject_nonfinite)
    except (ValueError, UnicodeError):
        raise ValueError(f"Invalid UTF-8 JSON: {source.name}") from None
    if not isinstance(data, list):
        raise ValueError(f"Expected a Matomo visits array, not an aggregate/API error: {source.name}")
    if file_signature(source) != before:
        raise ValueError(f"Source JSON changed while reading: {source.name}")
    return data, {'file': str(source.resolve()), 'bytes': len(raw),
                  'sha256': hashlib.sha256(raw).hexdigest()}


def format_summary(report: dict[str, Any]) -> str:
    scope = 'all-event' if report['event_scope'] == 'all' else 'pageview'
    lines = [f"JSON {scope} {'count' if report['count_only'] else 'export'} {report['status']}.", '',
             f"- Site selection: {report['site_id'] if report['site_id'] is not None else 'all sites'}.",
             f"- Event dates (Europe/Rome): {report['from_date'] or 'unbounded'} to {report['to_date'] or 'unbounded'}.",
             f"- {report['processed_files']:,}/{report['source_files']:,} JSON files; {report['visits']:,} visits.",
             f"- {report['converted_actions']:,} unique events retained.",
             f"- {report['non_pageview_actions_skipped']:,} non-pageview actions excluded.",
             f"- {report['other_site_actions_skipped']:,} actions from other sites excluded.",
             f"- {report['date_filtered_actions']:,} events outside the selected event dates excluded.",
             f"- {report['duplicates']:,} duplicates; {report['rejected_actions']:,} rejected actions; "
             f"{report['invalid_visits']:,} invalid visits.",
             f"- {report['payload_bytes']:,} retained payload bytes; {len(report['output_files']):,} output parts.",
             f"- First event: {report['first_event'] or 'none'}.",
             f"- Last event: {report['last_event'] or 'none'}.",
             f"- {report['warning_count']:,} warnings on retained events.", '',
             'Retained events by type:']
    lines.extend(f"- {name}: {count:,}." for name, count in sorted(report['events_by_type'].items()))
    if not report['events_by_type']:
        lines.append('- None.')
    if report['count_only']:
        lines.append('- Count only: no event files or upload manifest written.')
    return '\n'.join(lines) + '\n'


def run(source: Path, output: Path, *, site_id: int | None = DEFAULT_SITE_ID,
        start: date | None = None, end: date | None = None, count_only: bool = False,
        all_events: bool = not PAGEVIEWS_ONLY,
        part_events: int = 2000, part_bytes: int = 8 * 1024**2,
        reserve_bytes: int = 2 * 1024**3, host_volume: Path | None = None) -> dict[str, Any]:
    if site_id is not None and site_id <= 0:
        raise ValueError('Site ID must be positive')
    if start and end and end < start:
        raise ValueError('End date must not precede start date')
    if not 1 <= part_events <= 2000 or not 1 <= part_bytes <= 9 * 1024**2 or reserve_bytes < 0:
        raise ValueError('Invalid part size or disk reserve')
    source, output = source.resolve(strict=True), output.resolve()
    if source.is_dir():
        if output.is_relative_to(source):
            raise ValueError('Output directory must be outside the input directory')
        files = sorted(p for p in source.rglob('*') if p.is_file() and p.suffix.lower() == '.json')
    else:
        files = [source] if source.suffix.lower() == '.json' else []
    if not files:
        raise ValueError('No visit/action JSON files found')
    signatures = {path: file_signature(path) for path in files}
    output.mkdir(parents=True, exist_ok=False)
    guard = DiskGuard(output, reserve_bytes, host_volume)
    guard.check(force=True)
    report: dict[str, Any] = {
        'status': 'running', 'source_format': 'matomo_visits_json', 'count_only': count_only,
        'event_scope': 'all' if all_events else 'pageviews', 'events_by_type': {},
        'site_id': site_id, 'from_date': str(start) if start else None, 'to_date': str(end) if end else None,
        'source_files': len(files), 'processed_files': 0, 'inputs': [],
        'visits': 0, 'sites': {}, 'actions': 0, 'non_pageview_actions_skipped': 0,
        'other_site_actions_skipped': 0, 'date_filtered_pageviews': 0, 'date_filtered_actions': 0,
        'converted_actions': 0, 'rejected_actions': 0, 'invalid_visits': 0, 'duplicates': 0,
        'warning_count': 0, 'errors_by_reason': {}, 'warnings_by_reason': {},
        'payload_bytes': 0, 'first_event': None, 'last_event': None,
        'first_pageview': None, 'last_pageview': None, 'output_files': [],
    }
    seen: dict[str, bytes] = {}
    parts = Parts(output, report['output_files'], part_bytes)
    first_stamp: int | None = None
    last_stamp: int | None = None
    first_pageview_stamp: int | None = None
    last_pageview_stamp: int | None = None
    last_progress = time.monotonic()
    with (output / '.conversion.lock').open('a+b') as lock, (output / 'issues.ndjson').open('xb') as issues:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        def issue(kind: str, reason: str, file: str, visit_index: int,
                  action_index: int | None = None) -> None:
            group = report['errors_by_reason' if kind == 'error' else 'warnings_by_reason']
            group[reason] = group.get(reason, 0) + 1
            issues.write((json.dumps({'kind': kind, 'reason': reason, 'file': file,
                                     'visit_index': visit_index, 'action_index': action_index}) + '\n').encode())

        try:
            for path in files:
                guard.check()
                data, fingerprint = read_visits(path)
                report['inputs'].append(fingerprint)
                for visit_index, visit in enumerate(data):
                    report['visits'] += 1
                    if not isinstance(visit, dict) or not isinstance(visit.get('actionDetails'), list):
                        report['invalid_visits'] += 1
                        issue('error', 'Invalid visit or actionDetails', path.name, visit_index)
                        continue
                    actions = visit['actionDetails']
                    report['actions'] += len(actions)
                    try:
                        visit_site = identifier(visit.get('idSite'), 'idSite')
                    except ValueError as error:
                        report['invalid_visits'] += 1
                        issue('error', str(error), path.name, visit_index)
                        continue
                    report['sites'][visit_site] = report['sites'].get(visit_site, 0) + 1
                    if site_id is not None and visit_site != str(site_id):
                        report['other_site_actions_skipped'] += len(actions)
                        continue
                    for action_index, action in enumerate(actions):
                        try:
                            if not isinstance(action, dict):
                                raise ValueError('Expected an action object')
                            if not all_events and action.get('type') != 'action':
                                report['non_pageview_actions_skipped'] += 1
                                continue
                            notes: list[dict[str, str]] = []
                            event = convert_action(visit, action, notes)
                            if not matches_event(event, site_id, start, end):
                                report['date_filtered_actions'] += 1
                                if event['event'] == 'Page Viewed':
                                    report['date_filtered_pageviews'] += 1
                                continue
                            line = json.dumps(event, ensure_ascii=False, allow_nan=False,
                                              separators=(',', ':')).encode() + b'\n'
                            if len(line) > part_bytes:
                                raise ValueError('One event exceeds the configured output part size')
                            insert_id = event['properties']['$insert_id']
                            digest = hashlib.sha256(line).digest()
                            if insert_id in seen:
                                if seen[insert_id] != digest:
                                    raise ValueError('Conflicting records share an event identifier')
                                report['duplicates'] += 1
                                continue
                            guard.check()
                            if not count_only:
                                parts.write(line)
                                if parts.count >= part_events:
                                    parts.finish()
                            seen[insert_id] = digest
                            report['converted_actions'] += 1
                            name = event['event']
                            report['events_by_type'][name] = report['events_by_type'].get(name, 0) + 1
                            report['payload_bytes'] += len(line)
                            stamp = event['properties']['time']
                            first_stamp = min(first_stamp if first_stamp is not None else stamp, stamp)
                            last_stamp = max(last_stamp if last_stamp is not None else stamp, stamp)
                            if name == 'Page Viewed':
                                first_pageview_stamp = min(stamp, first_pageview_stamp) if first_pageview_stamp is not None else stamp
                                last_pageview_stamp = max(stamp, last_pageview_stamp) if last_pageview_stamp is not None else stamp
                            for note in notes:
                                report['warning_count'] += 1
                                issue('warning', note['reason'], path.name, visit_index, action_index)
                        except (ValueError, TypeError, UnicodeError) as error:
                            report['rejected_actions'] += 1
                            issue('error', str(error), path.name, visit_index, action_index)
                report['processed_files'] += 1
                now = time.monotonic()
                if now - last_progress >= 5 or report['processed_files'] == len(files):
                    print(f"JSON files {report['processed_files']}/{len(files)} | "
                          f"Events retained {report['converted_actions']:,}", flush=True)
                    last_progress = now
            for path, before in signatures.items():
                if file_signature(path) != before:
                    raise ValueError(f'Source JSON changed during conversion: {path.name}')
            parts.finish()
            report['status'] = 'completed_with_errors' if report['rejected_actions'] or report['invalid_visits'] else 'completed'
            for key, stamp in (('first_event', first_stamp), ('last_event', last_stamp),
                               ('first_pageview', first_pageview_stamp), ('last_pageview', last_pageview_stamp)):
                if stamp is not None:
                    report[key] = datetime.fromtimestamp(stamp, UTC).astimezone(ROME).isoformat()
            atomic_json(output / 'report.json', report)
            (output / 'summary.txt').write_text(format_summary(report), encoding='utf-8')
            if not count_only:
                atomic_json(output / 'manifest.json', {'status': report['status'],
                    'events': report['converted_actions'], 'files': report['output_files']})
        except BaseException as error:
            report['status'] = 'interrupted' if isinstance(error, KeyboardInterrupt) else 'failed'
            try:
                atomic_json(output / 'report.json', report)
            except OSError:
                print('Could not save the failed JSON conversion report.', file=sys.stderr)
            raise
        finally:
            parts.close()
    return report


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('input', type=Path, help='Matomo visit/action JSON file or directory')
    parser.add_argument('--output-dir', type=Path)
    parser.add_argument('--site-id', type=int, choices=(DEFAULT_SITE_ID,), default=DEFAULT_SITE_ID,
                        help='Compatibility option; the site is fixed to Developer Portal (8)')
    parser.add_argument('--from-date', type=date.fromisoformat, help='First inclusive Rome event date')
    parser.add_argument('--to-date', type=date.fromisoformat, help='Last inclusive Rome event date')
    parser.add_argument('--count-only', action='store_true')
    parser.add_argument('--all-events', action='store_true', default=not PAGEVIEWS_ONLY, help=argparse.SUPPRESS)
    parser.add_argument('--part-events', type=int, default=2000)
    parser.add_argument('--part-mib', type=int, default=8)
    parser.add_argument('--min-free-gib', type=float, default=2)
    parser.add_argument('--host-volume', type=Path)
    args = parser.parse_args(argv)
    if PAGEVIEWS_ONLY and args.all_events:
        parser.error('This branch exports Page Viewed events only')
    if not math.isfinite(args.min_free_gib) or args.min_free_gib < 0:
        parser.error('--min-free-gib must be finite and nonnegative')
    output = args.output_dir or SCRIPT_DIR / 'output' / datetime.now(UTC).strftime('json-%Y%m%dT%H%M%S-%fZ')
    try:
        report = run(args.input, output, site_id=args.site_id, start=args.from_date, end=args.to_date,
                     count_only=args.count_only, all_events=args.all_events, part_events=args.part_events,
                     part_bytes=args.part_mib * 1024**2, reserve_bytes=int(args.min_free_gib * 1024**3),
                     host_volume=args.host_volume)
    except KeyboardInterrupt:
        print(f'Interrupted. Start a new JSON run; inspect {output}/report.json.', file=sys.stderr)
        return 130
    except (OSError, ValueError, TypeError) as error:
        print(f'JSON conversion failed: {error}', file=sys.stderr)
        return 1
    print('\n' + format_summary(report), end='')
    print(f'Report: {output / "report.json"}')
    return int(report['status'] != 'completed')


if __name__ == '__main__':
    sys.exit(main())
