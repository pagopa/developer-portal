"""Resumable conversion using compact staging tables and bounded output parts."""

import hashlib
import fcntl
import json
import os
import sqlite3
import sys
from datetime import UTC, date, datetime
from pathlib import Path
from typing import Any, BinaryIO
from uuid import NAMESPACE_URL, uuid5

from sql_storage import DiskGuard, Store

VERSION = 1
ACTION_TABLES = ('log_link_visit_action', 'log_crash_event', 'log_media')
ORDER = ('log_visit', 'log_action', 'log_crash', 'log_crash_stack',
         'log_media_plays', *ACTION_TABLES)


def atomic_json(path: Path, value: Any) -> None:
    temporary = path.with_suffix(path.suffix + '.tmp')
    with temporary.open('w', encoding='utf-8') as stream:
        json.dump(value, stream, indent=2, ensure_ascii=False)
        stream.write('\n')
        stream.flush()
        os.fsync(stream.fileno())
    temporary.replace(path)


def fingerprint(source: Path) -> dict[str, Any]:
    stat = source.stat()
    with source.open('rb') as stream:
        digest = hashlib.sha256(stream.read(1024 * 1024))
        stream.seek(max(0, stat.st_size - 1024 * 1024))
        digest.update(stream.read())
    return {'path': str(source.resolve()), 'size': stat.st_size, 'mtime_ns': stat.st_mtime_ns,
            'edge_sha256': digest.hexdigest()}


class Parts:
    def __init__(self, output: Path, files: list[dict[str, Any]], limit: int) -> None:
        self.output, self.files, self.limit = output, files, limit
        self.stream: BinaryIO | None = None
        self.size = self.count = 0

    def write(self, line: bytes) -> None:
        if len(line) > self.limit:
            raise ValueError('One event exceeds the configured output part size')
        if self.stream and self.size + len(line) > self.limit:
            self.finish()
        if self.stream is None:
            self.path = self.output / f'events-{len(self.files) + 1:05d}.partial.ndjson'
            self.stream = self.path.open('xb')
            self.digest = hashlib.sha256()
            self.size = self.count = 0
        self.stream.write(line)
        self.digest.update(line)
        self.size += len(line)
        self.count += 1

    def finish(self) -> None:
        if self.stream is None:
            return
        self.stream.flush()
        os.fsync(self.stream.fileno())
        self.stream.close()
        self.stream = None
        destination = self.path.with_name(self.path.name.replace('.partial', ''))
        self.path.replace(destination)
        self.files.append({'file': destination.name, 'events': self.count,
                           'bytes': self.size, 'sha256': self.digest.hexdigest()})

    def close(self) -> None:
        if self.stream:
            self.stream.close()
            self.stream = None


def recover_files(output: Path, state: dict[str, Any]) -> None:
    """Only remove generated parts which were never committed in this run."""
    committed = {part['file']: part for part in state['files']}
    for name, part in committed.items():
        path = output / name
        digest = hashlib.sha256()
        with path.open('rb') as stream:
            for block in iter(lambda: stream.read(1024 * 1024), b''):
                digest.update(block)
        if path.stat().st_size != part['bytes'] or digest.hexdigest() != part['sha256']:
            raise ValueError(f'Committed output changed: {name}; cannot resume')
    for path in output.glob('events-*.ndjson'):
        if path.name not in committed:
            path.unlink()
    issues = output / 'issues.ndjson'
    if issues.exists():
        if issues.stat().st_size < state['issues_offset']:
            raise ValueError('Issues file is shorter than its checkpoint')
        with issues.open('r+b') as stream:
            stream.truncate(state['issues_offset'])
    elif state['issues_offset']:
        raise ValueError('Issues file is missing; cannot resume')


def run_compact(source: Path, output: Path, site: int | None = None,
                start: date | None = None, end: date | None = None, prefix: str = '',
                include_unplayed: bool = False, *, resume: bool = False,
                part_events: int = 2000, part_bytes: int = 8 * 1024**2,
                reserve_bytes: int = 2 * 1024**3, host_volume: Path | None = None) -> dict[str, Any]:
    from from_sql import (Progress, ROME, VISIT_BOUND_TOLERANCE_SECONDS, build_action,
                          calculate_durations, convert_action, index_dump, records,
                          utc_seconds, visit_data)

    if site is not None and site <= 0:
        raise ValueError('Site ID must be positive')
    if start and end and end < start:
        raise ValueError('End date must not precede start date')
    if not 1 <= part_events <= 2000 or not 1 <= part_bytes <= 10_000_000 or reserve_bytes < 0:
        raise ValueError('Invalid part size or disk reserve')
    config = {'version': VERSION, 'source': fingerprint(source), 'site': site,
              'start': str(start), 'end': str(end), 'prefix': prefix,
              'include_unplayed': include_unplayed, 'part_events': part_events,
              'part_bytes': part_bytes}
    report: dict[str, Any] = {'status': 'running', 'site_id': site,
        'from_date': str(start) if start else None, 'to_date': str(end) if end else None,
        'sites': {}, 'first_visit_date': None, 'last_visit_date': None,
        'visits': 0, 'actions': 0, 'converted_actions': 0, 'rejected_actions': 0,
        'invalid_visits': 0, 'duplicates': 0, 'unplayed_media_skipped': 0,
        'warning_count': 0, 'errors_by_reason': {}, 'warnings_by_reason': {}, 'staged_rows': {}}
    if resume:
        if not (output / 'staging.sqlite').is_file():
            raise ValueError('No compact staging database found; old runs cannot be resumed')
    else:
        output.mkdir(parents=True, exist_ok=False)
    guard = DiskGuard(output, reserve_bytes, host_volume)
    guard.check(force=True)
    lock = (output / '.conversion.lock').open('a')
    try:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        lock.close()
        raise ValueError('Another converter is already using this output directory') from None
    db: Store | None = None
    parts: Parts | None = None
    state: dict[str, Any] | None = None
    validated = not resume
    try:
        db = sqlite3.connect(output / 'staging.sqlite', factory=Store)
        if resume:
            if not db.execute("SELECT 1 FROM sqlite_master WHERE name='state'").fetchone():
                raise ValueError('Old staging format cannot be resumed; start a new run')
            state = db.load_checkpoint()
            if state['config'] != config:
                raise ValueError('Source or conversion options changed; cannot resume this run')
            recover_files(output, state)
            validated = True
            report = state['report']
            index = state['index']
            db.initialize(index)
            print(f'Resuming phase: {state["phase"]}', flush=True)
        else:
            index = index_dump(source, prefix)
            guard.check(force=True)
            db.initialize(index)
            report['absent_optional_tables'] = [table for table in ORDER if table not in index]
            state = {'config': config, 'index': index, 'report': report, 'phase': 'staging',
                     'inserts': {}, 'files': [], 'issues_offset': 0,
                     'export_table': 0, 'export_seq': 0, 'processed': 0}
            db.checkpoint(state)
        report['status'] = 'running'
        report.pop('failure', None)
        with (output / 'issues.ndjson').open('ab') as issues:
            def issue(kind: str, reason: str, reference: dict[str, Any]) -> None:
                group = report['errors_by_reason' if kind == 'error' else 'warnings_by_reason']
                group[reason] = group.get(reason, 0) + 1
                if kind == 'warning':
                    report['warning_count'] += 1
                issues.write((json.dumps({'kind': kind, 'reason': reason, **reference}) + '\n').encode())

            def checkpoint() -> None:
                guard.check()
                issues.flush()
                os.fsync(issues.fileno())
                # Persist file creation/renames before committing references to them in SQLite.
                directory_fd = os.open(output, os.O_RDONLY | os.O_DIRECTORY)
                try:
                    os.fsync(directory_fd)
                finally:
                    os.close(directory_fd)
                state['issues_offset'] = issues.tell()
                db.checkpoint(state)

            if state['phase'] == 'staging':
                for table in ORDER:
                    statements = index.get(table, {}).get('inserts', [])
                    completed = state['inserts'].get(table, 0)
                    if table in report['staged_rows'] and completed == len(statements):
                        continue
                    count = report['staged_rows'].get(table, 0)
                    pending: list[dict[str, Any]] = []
                    pending_bytes = 0
                    progress = Progress(f'Phase 2 - Reading {table}', sum(n for _, n in statements), 'bytes',
                                        sum(n for _, n in statements[:completed]))

                    def flush() -> None:
                        nonlocal pending_bytes
                        guard.check()
                        db.insert_rows(table, pending)
                        pending.clear()
                        pending_bytes = 0

                    def statement_done(next_statement: int) -> None:
                        flush()
                        report['staged_rows'][table] = count
                        state['inserts'][table] = next_statement
                        checkpoint()

                    for row in records(source, index, table, progress, completed, statement_done):
                        if table == 'log_visit':
                            if site is not None and row['idsite'] != site:
                                continue
                            try:
                                day = datetime.fromtimestamp(utc_seconds(row['visit_first_action_time']), UTC).astimezone(ROME).date()
                                if (start and day < start) or (end and day > end):
                                    continue
                                visit_data(row)
                                site_key, day_text = str(row['idsite']), str(day)
                                report['sites'][site_key] = report['sites'].get(site_key, 0) + 1
                                report['first_visit_date'] = min(report['first_visit_date'] or day_text, day_text)
                                report['last_visit_date'] = max(report['last_visit_date'] or day_text, day_text)
                            except (ValueError, TypeError) as error:
                                report['invalid_visits'] += 1
                                issue('error', str(error), {'table': table, 'id': row.get('idvisit')})
                                continue
                        elif 'idvisit' in row:
                            if (site is not None and row.get('idsite', site) != site) or db.lookup('log_visit', row['idvisit']) is None:
                                continue
                        # Drop unused fields before buffering: wide visits can be very large.
                        retained = {field: row.get(field) for field in db.columns[table]}
                        pending.append(retained)
                        pending_bytes += len(repr(retained)) * 4
                        count += 1
                        if len(pending) >= 5000 or pending_bytes >= 8 * 1024**2:
                            flush()
                    statement_done(len(statements))
                    print(f'Staged {table}: {count}', flush=True)
                report['visits'] = report['staged_rows']['log_visit']
                if not report['visits']:
                    raise ValueError('No visits found for this site and date range')
                state['phase'] = 'durations'
                checkpoint()
            if state['phase'] == 'durations':
                # A duration interruption replays this phase, retaining all staged source rows.
                calculate_durations(db, report['staged_rows']['log_link_visit_action'], guard.check)
                state['phase'] = 'export'
                checkpoint()
            if state['phase'] == 'export':
                parts = Parts(output, state['files'], part_bytes)
                total = sum(report['staged_rows'][table] for table in ACTION_TABLES)
                progress = Progress('Phase 4 - Writing events', total, 'actions', state['processed'])
                for table_number in range(state['export_table'], len(ACTION_TABLES)):
                    table = ACTION_TABLES[table_number]
                    since_checkpoint = 0
                    for row in db.rows(table, state['export_seq']):
                        guard.check()
                        key = (f"{row['idvisit']}:{row['idview']}" if table == 'log_media'
                               else str(row[db.columns[table][0]]))
                        ref = {'table': table, 'id': key, 'matomo_visit_id': row['idvisit']}
                        if table == 'log_media' and not include_unplayed and not row.get('watched_time'):
                            report['unplayed_media_skipped'] += 1
                        else:
                            report['actions'] += 1
                            try:
                                raw_visit = db.lookup('log_visit', row['idvisit'])
                                visit = visit_data(raw_visit)
                                action, extra = build_action(db, table, row)
                                stamp = utc_seconds(row['server_time'])
                                lower, upper = visit['firstActionTimestamp'], visit['lastActionTimestamp']
                                if not lower - VISIT_BOUND_TOLERANCE_SECONDS <= stamp <= upper + VISIT_BOUND_TOLERANCE_SECONDS:
                                    raise ValueError('timestamp: outside visit bounds')
                                notes: list[dict[str, str]] = []
                                if not lower <= stamp <= upper:
                                    notes.append({'reason': 'timestamp: accepted within 5-second tolerance'})
                                visit.update(firstActionTimestamp=stamp, lastActionTimestamp=stamp)
                                event = convert_action(visit, action, notes)
                                props = event['properties']
                                props.update(source_format='matomo_sql', sql_mapping_version='1')
                                if extra.pop('_stack_omitted', False):
                                    notes.append({'reason': 'compressed crash stack omitted'})
                                props.update(extra)
                                for field in ('config_browser_name', 'config_os', 'config_device_type',
                                              'config_device_brand', 'location_region', 'referer_type'):
                                    if raw_visit.get(field) not in (None, ''):
                                        props['matomo_' + field] = raw_visit[field]
                                if table == 'log_media':
                                    props['$insert_id'] = str(uuid5(NAMESPACE_URL, f"matomo/{row['idsite']}/{row['idvisit']}/mediaView:{row['idview']}"))
                                    if not row.get('watched_time'):
                                        event['event'] = 'Media Observed'
                                line = json.dumps(event, ensure_ascii=False, allow_nan=False, separators=(',', ':')).encode()
                                digest = hashlib.sha256(line).digest()
                                seen = db.execute('SELECT hash FROM seen WHERE id=?', (props['$insert_id'],)).fetchone()
                                if seen:
                                    if seen[0] != digest:
                                        raise ValueError('Conflicting records share an event identifier')
                                    report['duplicates'] += 1
                                else:
                                    # Validate the part size before registering the identifier.
                                    if len(line) + 1 > part_bytes:
                                        raise ValueError('One event exceeds the configured output part size')
                                    db.execute('INSERT INTO seen VALUES (?,?)', (props['$insert_id'], digest))
                                    parts.write(line + b'\n')
                                    report['converted_actions'] += 1
                                    for note in notes:
                                        issue('warning', note['reason'], ref)
                            except (ValueError, TypeError, UnicodeError) as error:
                                report['rejected_actions'] += 1
                                issue('error', str(error), ref)
                        state['export_seq'] = row['_seq']
                        state['processed'] += 1
                        since_checkpoint += 1
                        progress.update(state['processed'])
                        if since_checkpoint >= part_events:
                            parts.finish()
                            checkpoint()
                            since_checkpoint = 0
                    parts.finish()
                    state['export_table'], state['export_seq'] = table_number + 1, 0
                    checkpoint()
                progress.update(state['processed'], force=True)
                state['phase'] = 'complete'
                checkpoint()
        report['status'] = 'completed_with_errors' if report['rejected_actions'] or report['invalid_visits'] else 'completed'
        report['output_files'] = state['files']
        db.checkpoint(state)
        atomic_json(output / 'manifest.json', {'status': report['status'], 'files': state['files'],
                                              'events': report['converted_actions']})
        atomic_json(output / 'report.json', report)
        return report
    except BaseException as error:
        if db:
            db.rollback()
        if validated:
            report['status'] = 'interrupted' if isinstance(error, KeyboardInterrupt) else 'failed'
            report['failure'] = str(error)
            try:
                atomic_json(output / 'report.json', report)
            except OSError as report_error:
                print(f'Could not write failure report: {report_error}. Original error: {error}', file=sys.stderr)
        raise
    finally:
        if parts:
            parts.close()
        if db:
            db.close()
        lock.close()
