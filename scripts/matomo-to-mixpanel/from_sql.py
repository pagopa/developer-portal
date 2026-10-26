"""Read a Matomo mysqldump locally and write Mixpanel NDJSON; never execute SQL."""

import argparse
import html
import ipaddress
import re
import sqlite3
import sys
import time
from collections.abc import Iterator
from collections.abc import Callable
from datetime import UTC, date, datetime
from pathlib import Path
from typing import Any

from main import ROME, SCRIPT_DIR, VISIT_BOUND_TOLERANCE_SECONDS, convert_action
from sql_storage import Store

# This reader targets the single-line extended INSERT format of the supplied dump.
MAX_LINE = 64 * 1024 * 1024
TABLES = ('log_action', 'log_visit', 'log_link_visit_action', 'log_crash',
          'log_crash_event', 'log_crash_stack', 'log_media', 'log_media_plays')
KEYS = dict(zip(TABLES, ('idaction', 'idvisit', 'idlink_va', 'idlogcrash',
                        'idlogcrashevent', 'idlogcrashstack', 'idview', 'idview')))
TOKEN = re.compile(rb"(?:_binary )?'(?:\\.|''|[^'\\])*'|0x[0-9a-fA-F]+|NULL|[-+]?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?", re.S)
CREATE = re.compile(rb'CREATE TABLE `([^`]+)` \(')
INSERT = re.compile(rb'INSERT INTO `([^`]+)` VALUES ')
PERFORMANCE = ('time_network', 'time_server', 'time_transfer', 'time_dom_processing',
               'time_dom_completion', 'time_on_load')


class Progress:
    """Report phase-local progress; byte estimates do not imply an exact row total."""

    def __init__(self, label: str, total: int, unit: str, initial: int = 0) -> None:
        self.label, self.total, self.unit = label, total, unit
        self.initial = initial
        self.started = self.last = time.monotonic()
        print(f'{label}: starting ({total:,} {unit})', flush=True)

    def update(self, completed: int, *, force: bool = False) -> None:
        now = time.monotonic()
        if not force and now - self.last < 5:
            return
        self.last = now
        elapsed = now - self.started
        advanced = completed - self.initial
        remaining = elapsed * (self.total - completed) / advanced if advanced > 0 else None
        if completed == self.total:
            remaining = 0
        eta = f'{max(0, int(remaining)) // 60}m {max(0, int(remaining)) % 60}s' if remaining is not None else 'calculating'
        percent = completed / self.total * 100 if self.total else 100
        print(f'{self.label}: {percent:.1f}% ({completed:,}/{self.total:,} {self.unit}) | '
              f'Estimated phase remaining: {eta}', flush=True)


def literal(raw: bytes) -> Any:
    if raw == b'NULL':
        return None
    if raw.startswith(b'0x'):
        return bytes.fromhex(raw[2:].decode()).hex()
    binary = raw.startswith(b'_binary ')
    if binary:
        raw = raw[8:]
    if raw.startswith(b"'"):
        escapes = {b'0': b'\0', b'n': b'\n', b'r': b'\r', b't': b'\t',
                   b'b': b'\b', b'Z': b'\x1a'}
        value = raw[1:-1]
        # Most fields have no escapes; avoid a regex substitution for each one.
        if b'\\' in value or b"''" in value:
            value = re.sub(rb"\\(.)|''", lambda m: (escapes.get(m[1], m[1])
                           if m[1] is not None else b"'"), value, flags=re.S)
        return value.hex() if binary else value.decode('utf-8')
    return float(raw) if any(c in raw for c in b'.eE') else int(raw)


def tuples(line: bytes, position: int,
           progress: Callable[[int], None] | None = None) -> Iterator[list[Any]]:
    count = 0
    while line[position:position + 1] == b'(':
        position += 1
        values = []
        while True:
            match = TOKEN.match(line, position)
            if not match:
                raise ValueError('Unsupported or malformed SQL literal')
            values.append(literal(match[0]))
            position = match.end()
            delimiter = line[position:position + 1]
            position += 1
            if delimiter == b')':
                break
            if delimiter != b',':
                raise ValueError('Unsupported SQL value separator')
        yield values
        count += 1
        if progress is not None and count % 2048 == 0:
            progress(position)
        if line[position:position + 1] != b',':
            break
        position += 1
    if line[position:].strip() != b';':
        raise ValueError('Expected a complete single-line INSERT ending in semicolon')


def index_dump(source: Path, prefix: str) -> dict[str, Any]:
    index: dict[str, Any] = {}
    active = None
    size = source.stat().st_size
    progress = Progress('Phase 1 - Indexing SQL', size, 'bytes')
    with source.open('rb') as stream:
        while True:
            offset = stream.tell()
            line = stream.readline(MAX_LINE + 1)
            if not line:
                break
            if len(line) > MAX_LINE:
                raise ValueError('SQL line exceeds 64 MiB; re-export with smaller INSERT statements')
            match = CREATE.match(line)
            if match:
                name = match[1].decode()
                table = name[len(prefix):] if name.startswith(prefix) else ''
                active = table if table in TABLES else None
                if active:
                    if active in index:
                        raise ValueError(f'Duplicate table definition: {name}')
                    index[active] = {'columns': [], 'inserts': []}
            elif active:
                column = re.match(rb'\s+`([^`]+)`', line)
                if column:
                    index[active]['columns'].append(column[1].decode())
                if line.startswith(b')'):
                    active = None
            match = INSERT.match(line)
            if match:
                name = match[1].decode()
                table = name[len(prefix):] if name.startswith(prefix) else ''
                if table in TABLES:
                    if table not in index:
                        raise ValueError(f'Missing CREATE TABLE before INSERT: {name}')
                    index[table]['inserts'].append((offset, len(line)))
            elif line.startswith((b'INSERT ', b'REPLACE ')):
                if any(('`' + prefix + t + '`').encode() in line[:1024] for t in TABLES):
                    raise ValueError('Unsupported INSERT format: explicit columns/REPLACE are not supported')
            progress.update(stream.tell())
    progress.update(size, force=True)
    for table in TABLES[:3]:
        if table not in index or KEYS[table] not in index[table]['columns']:
            raise ValueError(f'Required table or key missing: {prefix}{table}')
    return index


def records(source: Path, index: dict[str, Any], table: str,
            progress: Progress | None = None, start_insert: int = 0,
            statement_done: Callable[[int], None] | None = None) -> Iterator[dict[str, Any]]:
    spec = index.get(table)
    if not spec:
        return
    with source.open('rb') as stream:
        completed = sum(length for _, length in spec['inserts'][:start_insert])
        for statement, (offset, length) in enumerate(spec['inserts'][start_insert:], start_insert):
            stream.seek(offset)
            line = stream.read(length)
            match = INSERT.match(line)
            if not match:
                raise ValueError('Dump changed during conversion')
            callback = (lambda position: progress.update(completed + position)) if progress else None
            for values in tuples(line, match.end(), callback):
                if len(values) != len(spec['columns']):
                    raise ValueError(f'Column count mismatch in {table} at byte {offset}')
                yield dict(zip(spec['columns'], values))
            completed += length
            if statement_done:
                statement_done(statement + 1)
            if progress:
                progress.update(completed)
        if progress:
            progress.update(completed, force=True)


def utc_seconds(value: str) -> int:
    return int(datetime.fromisoformat(value).replace(tzinfo=UTC).timestamp())


def get_record(db: Store, table: str, key: Any) -> dict[str, Any]:
    row = db.lookup(table, key)
    if row is None:
        raise ValueError(f'Missing {table} reference: {key}')
    return row


def action_name(db: Store, key: Any, *, url: bool = False) -> Any:
    if key in (None, 0):
        return None
    row = get_record(db, 'log_action', key)
    value = row['name']
    if url and value is not None:
        prefixes = {None: '', 0: 'http://', 1: 'http://www.', 2: 'https://', 3: 'https://www.'}
        if row.get('url_prefix') not in prefixes:
            raise ValueError('Unsupported URL prefix')
        if not value.startswith(('http://', 'https://')):
            value = prefixes[row.get('url_prefix')] + value
    return html.unescape(value) if isinstance(value, str) else value


def visit_data(row: dict[str, Any]) -> dict[str, Any]:
    result = {'idSite': row['idsite'], 'idVisit': row['idvisit'],
              'visitorId': row['idvisitor'],
              'firstActionTimestamp': utc_seconds(row['visit_first_action_time']),
              'lastActionTimestamp': utc_seconds(row['visit_last_action_time'])}
    fields = {'visitor_count_visits': 'visitCount', 'location_city': 'city',
              'location_country': 'countryCode', 'location_latitude': 'latitude',
              'location_longitude': 'longitude', 'config_id': 'fingerprint',
              'config_browser_version': 'browserVersion', 'config_os_version': 'operatingSystemVersion',
              'config_device_model': 'deviceModel',
              'config_resolution': 'resolution', 'location_browser_lang': 'languageCode',
              'referer_name': 'referrerName', 'referer_url': 'referrerUrl'}
    for source, target in fields.items():
        result[target] = row.get(source)
    for suffix in ('id', 'name', 'source', 'medium', 'keyword', 'content', 'group', 'placement'):
        result['campaign' + suffix.title()] = row.get('campaign_' + suffix)
    result['visitorType'] = {0: 'new', 1: 'returning', 2: 'returningCustomer'}.get(row.get('visitor_returning'))
    result['referrerType'] = {1: 'direct', 2: 'search', 3: 'website', 6: 'campaign', 7: 'social'}.get(row.get('referer_type'))
    if row.get('location_ip'):
        result['visitIp'] = str(ipaddress.ip_address(bytes.fromhex(row['location_ip'])))
    return result


def build_action(db: Store, table: str, row: dict[str, Any]) -> tuple[dict[str, Any], dict[str, Any]]:
    stamp = utc_seconds(row['server_time'])
    # Use the common event identity convention with SQL's exact UTC time.
    wall = int(datetime.fromtimestamp(stamp, UTC).astimezone(ROME).replace(tzinfo=UTC).timestamp())
    action: dict[str, Any] = {'timestamp': wall}
    extra: dict[str, Any] = {}
    if table == 'log_link_visit_action':
        if row.get('idaction_event_category'):
            kind = 'event'
        elif row.get('idaction_name') and get_record(db, 'log_action', row['idaction_name'])['type'] == 8:
            kind = 'search'
        elif row.get('idaction_url'):
            kind = {1: 'action', 2: 'outlink', 3: 'download', 10: 'event'}.get(
                get_record(db, 'log_action', row['idaction_url'])['type'])
        else:
            kind = None
        if kind is None:
            raise ValueError('Unsupported SQL action type')
        action.update(type=kind, pageId=row['idlink_va'], idpageview=row.get('idpageview'),
                      pageviewPosition=row.get('pageview_position'),
                      url=action_name(db, row.get('idaction_url'), url=True))
        if kind == 'action':
            action['pageTitle'] = action_name(db, row.get('idaction_name'))
        if kind == 'event':
            for source, target in [('idaction_event_category', 'eventCategory'),
                                   ('idaction_event_action', 'eventAction'), ('idaction_name', 'eventName')]:
                action[target] = action_name(db, row.get(source))
            action['eventValue'] = row.get('custom_float')
        if kind == 'search':
            action.update(siteSearchKeyword=action_name(db, row.get('idaction_name')),
                          siteSearchCategory=row.get('search_cat'), siteSearchCount=row.get('search_count'))
        times = [row.get(k) for k in PERFORMANCE]
        for key, value in zip(PERFORMANCE, times):
            if value is not None and value >= 0:
                extra[key + '_ms'] = value
        if any(v is not None and v >= 0 for v in times):
            action['pageLoadTimeMilliseconds'] = sum(v for v in times if v is not None and v >= 0)
        # time_spent_ref_action belongs to the PREVIOUS action; do not map it here.
        duration = db.execute('SELECT seconds FROM durations WHERE action_id=?', (row['idlink_va'],)).fetchone()
        if duration is not None and kind == 'action':
            action['timeSpent'] = duration[0]
    elif table == 'log_crash_event':
        crash = get_record(db, 'log_crash', row['idlogcrash'])
        action.update(type='crash', crashEventId=row['idlogcrashevent'], crashId=row['idlogcrash'],
                      idpageview=row.get('idpageview'), resourceLine=row.get('resource_line'),
                      resourceColumn=row.get('resource_column'), category=row.get('category'),
                      crashType=crash.get('crash_type'), message=crash.get('message'),
                      resourceUri=action_name(db, row.get('idaction_resource_uri')) or crash.get('resource_uri'),
                      stackTrace=crash.get('stack_trace'))
        if row.get('idlogcrashstack'):
            stack = get_record(db, 'log_crash_stack', row['idlogcrashstack'])
            # Compressed stacks need explicit decoding, never send compressed bytes as text.
            if stack.get('compressed'):
                extra['_stack_omitted'] = True
            else:
                action['stackTrace'] = bytes.fromhex(stack['value']).decode('utf-8')
    elif table == 'log_media':
        if row.get('media_type') not in (1, 2):
            raise ValueError('Unsupported SQL media type')
        action.update(type='media', url=row.get('resource'),
                      media_type={1: 'video', 2: 'audio'}[row['media_type']])
        for key in ('media_title', 'player_name', 'fullscreen', 'time_to_initial_play',
                    'watched_time', 'media_progress', 'media_length'):
            action[key] = row.get(key)
        extra['matomo_media_view_id'] = row['idview']
        found = db.lookup('log_media_plays', f"{row['idvisit']}:{row['idview']}")
        if found:
            segments = found
            values = {k: v for k, v in segments.items() if k.startswith('segment_')}
            if any(v not in (None, 0, 1) for v in values.values()):
                raise ValueError('Invalid media segment indicator')
            extra['media_consumed_segment_ends_seconds'] = sorted(
                int(k.removeprefix('segment_')) for k, v in values.items() if v == 1)
    return action, extra


def calculate_durations(db: Store, total: int | None = None,
                        check_disk: Callable[[], None] | None = None) -> None:
    """Accumulate time attributed to a page by later actions, as Matomo Live does."""
    db.execute('DROP TABLE IF EXISTS durations')
    db.execute('CREATE TABLE durations (action_id INTEGER PRIMARY KEY, seconds REAL)')
    page: dict[str, Any] | None = None
    visit_id = None
    spent = 0
    progress = Progress('Phase 3 - Page durations', total, 'actions') if total is not None else None
    if progress:
        print('Preparing the visit/time index; percentage advances after indexing.', flush=True)
    disk_error: list[OSError] = []

    def monitor() -> int:
        if progress:
            progress.update(0)
        try:
            if check_disk:
                check_disk()
        except OSError as error:
            disk_error.append(error)
            return 1
        return 0

    db.set_progress_handler(monitor, 100000)
    try:
        db.execute('CREATE INDEX IF NOT EXISTS actions_by_visit_time '
                   'ON log_link_visit_action(idvisit,server_time,idlink_va)')
    except sqlite3.OperationalError:
        if disk_error:
            raise disk_error[0]
        raise
    finally:
        db.set_progress_handler(None, 0)
    db.commit()

    def save(last: bool) -> None:
        if page is None:
            return
        value = spent
        if last:
            visit = get_record(db, 'log_visit', page['idvisit'])
            elapsed = utc_seconds(page['server_time']) - utc_seconds(visit['visit_first_action_time'])
            remaining = (visit.get('visit_total_time') or 0) - elapsed
            if remaining > 10:
                value = remaining
        db.execute('INSERT INTO durations VALUES (?,?)', (page['idlink_va'], value))

    query = 'SELECT * FROM log_link_visit_action ORDER BY idvisit,server_time,idlink_va'
    cursor = db.execute(query)
    db.set_progress_handler(None, 0)
    for processed, values in enumerate(cursor, 1):
        row = dict(zip(['_seq', *db.columns['log_link_visit_action']], values))
        if row['idvisit'] != visit_id:
            save(True)
            page, spent, visit_id = None, 0, row['idvisit']
        if page is not None:
            spent += row.get('time_spent_ref_action') or 0
        reference = db.lookup('log_action', row.get('idaction_url'))
        is_page = reference and reference['type'] == 1 and not row.get('idaction_event_category')
        if is_page:
            save(False)
            page, spent = row, 0
        if progress and processed % 2048 == 0:
            progress.update(processed)
        if processed % 5000 == 0:
            if check_disk:
                check_disk()
            db.commit()
    save(True)
    db.commit()
    if progress:
        progress.update(total, force=True)


def run(source: Path, output: Path, site: int | None = None,
        start: date | None = None, end: date | None = None,
        prefix: str = '', include_unplayed: bool = False, *,
        resume: bool = False, part_events: int = 2000,
        part_bytes: int = 8 * 1024**2, reserve_bytes: int = 2 * 1024**3,
        host_volume: Path | None = None) -> dict[str, Any]:
    from sql_pipeline import run_compact

    return run_compact(source, output, site, start, end, prefix, include_unplayed,
                       resume=resume, part_events=part_events, part_bytes=part_bytes,
                       reserve_bytes=reserve_bytes, host_volume=host_volume)


def format_summary(report: dict[str, Any], output: Path) -> str:
    """Describe a completed conversion using its existing counters, without reading events."""
    descriptions = {
        'Unsupported SQL action type': 'unsupported SQL action types',
        'timestamp: outside visit bounds': 'timestamps outside visit bounds',
        'timestamp: accepted within 5-second tolerance': 'timestamps accepted within the 5-second tolerance',
        'url: invalid or unsupported absolute URL': 'invalid or unsupported URLs omitted',
        'exceeds 255 UTF-8 bytes': 'optional strings over 255 UTF-8 bytes omitted',
        'compressed crash stack omitted': 'compressed crash stacks omitted',
    }
    status = {
        'completed': 'Conversion completed.',
        'completed_with_errors': 'Conversion completed with rejected actions or invalid visits.',
    }.get(report['status'], f"Conversion status: {report['status']}.")
    first, last = report.get('first_visit_date'), report.get('last_visit_date')
    period = f'{first} to {last}' if first and last else 'not available'
    lines = [status, '',
             f"- {report['converted_actions']:,} events converted.",
             f"- {report['rejected_actions']:,} actions rejected.",
             f"- {report['unplayed_media_skipped']:,} unplayed media rows intentionally excluded.",
             f"- {len(report['output_files']):,} NDJSON files created.",
             f'- Visit dates: {period}.',
             f"- {report['visits']:,} visits; {report['invalid_visits']:,} invalid visits; "
             f"{report['duplicates']:,} duplicate events skipped.",
             '', 'Rejection / invalid-visit reasons:']
    errors = report.get('errors_by_reason', {})
    if not errors:
        lines.append('- None.')
    for reason, count in sorted(errors.items(), key=lambda item: (-item[1], item[0])):
        lines.append(f'- {count:,}: {descriptions.get(reason, reason)}.')
    lines.extend(['', f"Warnings: {report['warning_count']:,} (converted events retained; "
                  'one event may have multiple warnings).'])
    for reason, count in sorted(report.get('warnings_by_reason', {}).items(),
                                key=lambda item: (-item[1], item[0])):
        lines.append(f'- {count:,}: {descriptions.get(reason, reason)}.')
    lines.extend(['', 'Visits per Matomo site:'])
    for site, count in report.get('sites', {}).items():
        lines.append(f'- Site {site}: {count:,} visits.')
    lines.extend(['', f'Readable summary: {output / "summary.txt"}',
                  f'Import file list: {output / "manifest.json"}',
                  f'Detailed report: {output / "report.json"}',
                  f'Individual errors and warnings: {output / "issues.ndjson"}'])
    return '\n'.join(lines) + '\n'


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('input', type=Path, help='Uncompressed .sql mysqldump')
    parser.add_argument('--site-id', type=int, help='Optional site filter (default: all sites)')
    parser.add_argument('--from-date', type=date.fromisoformat, help='Optional first date')
    parser.add_argument('--to-date', type=date.fromisoformat, help='Optional last date')
    parser.add_argument('--table-prefix', default='', help='For example matomo_ (default: no prefix)')
    parser.add_argument('--include-unplayed-media', action='store_true', help='Emit zero-watched-time rows as Media Observed')
    parser.add_argument('--output-dir', type=Path)
    parser.add_argument('--resume', action='store_true', help='Resume the specified output directory')
    parser.add_argument('--part-events', type=int, default=2000, help='Maximum source actions per checkpoint/part (1-2000)')
    parser.add_argument('--part-mib', type=int, default=8, help='Maximum uncompressed part size in MiB (1-9)')
    parser.add_argument('--min-free-gib', type=float, default=2, help='Free disk reserve in GiB')
    parser.add_argument('--host-volume', type=Path, help='Host volume to check (WSL default: /mnt/c)')
    args = parser.parse_args(argv)
    if args.resume and args.output_dir is None:
        parser.error('--resume requires --output-dir')
    output = args.output_dir or SCRIPT_DIR / 'output' / datetime.now(UTC).strftime('sql-%Y%m%dT%H%M%S-%fZ')
    try:
        report = run(args.input, output, args.site_id, args.from_date, args.to_date,
                     args.table_prefix, args.include_unplayed_media, resume=args.resume,
                     part_events=args.part_events, part_bytes=args.part_mib * 1024**2,
                     reserve_bytes=int(args.min_free_gib * 1024**3), host_volume=args.host_volume)
    except KeyboardInterrupt:
        print(f'Interrupted. Resume with the same input/options and --resume --output-dir {output}', file=sys.stderr)
        return 130
    except (OSError, ValueError, TypeError, KeyError, sqlite3.Error) as error:
        print(f'Conversion failed: {error}. Inspect {output}/report.json', file=sys.stderr)
        return 1
    summary = format_summary(report, output)
    print('\n' + summary, end='')
    try:
        (output / 'summary.txt').write_text(summary, encoding='utf-8')
    except OSError as error:
        print(f'Could not save readable summary: {error}. See the summary above or report.json.', file=sys.stderr)
    return int(report['status'] != 'completed')


if __name__ == '__main__':
    sys.exit(main())
