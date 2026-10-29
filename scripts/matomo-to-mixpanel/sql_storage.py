"""Compact staging tables and disk checks for the SQL converter."""

import json
import shutil
import sqlite3
import time
from collections import OrderedDict
from collections.abc import Iterator
from pathlib import Path
from typing import Any

# Keep every field used by mapping, validation, identity or page-duration logic.
# BLOB affinity preserves each parsed value's native type without coercing strings.
FIELDS = {
    'log_visit': '''idvisit idsite idvisitor visit_first_action_time visit_last_action_time
        visit_total_time visitor_count_visits visitor_returning location_city location_country
        location_latitude location_longitude location_ip config_id config_browser_version
        config_os_version config_device_model config_resolution location_browser_lang
        referer_name referer_url referer_type config_browser_name config_os config_device_type
        config_device_brand location_region campaign_id campaign_name campaign_source
        campaign_medium campaign_keyword campaign_content campaign_group campaign_placement'''.split(),
    'log_action': 'idaction type name url_prefix'.split(),
    'log_link_visit_action': '''idlink_va idsite idvisit server_time idaction_url idaction_name
        idaction_event_category idaction_event_action idpageview pageview_position custom_float
        search_cat search_count time_network time_server time_transfer time_dom_processing
        time_dom_completion time_on_load time_spent_ref_action'''.split(),
    'log_crash': 'idlogcrash crash_type message resource_uri stack_trace'.split(),
    'log_crash_event': '''idlogcrashevent idsite idvisit server_time idlogcrash idpageview
        resource_line resource_column category idaction_resource_uri idlogcrashstack'''.split(),
    'log_crash_stack': 'idlogcrashstack compressed value'.split(),
    'log_media': '''idview idvisit idsite server_time resource media_type media_title player_name
        fullscreen time_to_initial_play watched_time media_progress media_length'''.split(),
    'log_media_plays': 'idview idvisit idsite'.split(),
}
KEYS = {table: fields[0] for table, fields in FIELDS.items()}


def quote(name: str) -> str:
    return '"' + name.replace('"', '""') + '"'


class Store(sqlite3.Connection):
    """Use native SQLite values and a bounded lookup cache instead of JSON rows."""

    def initialize(self, index: dict[str, Any]) -> None:
        self.execute('PRAGMA cache_size=-65536')
        self.execute('PRAGMA temp_store=FILE')
        self.columns = {table: list(fields) for table, fields in FIELDS.items()}
        self.columns['log_media_plays'] += [name for name in index.get('log_media_plays', {}).get('columns', [])
                                            if name.startswith('segment_')]
        self.cache: OrderedDict[tuple[str, str], dict[str, Any]] = OrderedDict()
        self.cache_bytes = 0
        for table, fields in self.columns.items():
            primary = ['idvisit', 'idview'] if table in ('log_media', 'log_media_plays') else [KEYS[table]]
            declarations = ','.join(quote(field) + ' BLOB' for field in fields)
            self.execute(f'CREATE TABLE IF NOT EXISTS {table} '
                         f'(_seq INTEGER PRIMARY KEY,{declarations})')
            # Match identifiers as text, as the previous reader did, while retaining native properties.
            expressions = ','.join(f'CAST({quote(field)} AS TEXT)' for field in primary)
            self.execute(f'CREATE UNIQUE INDEX IF NOT EXISTS {table}_key ON {table} ({expressions})')
        self.execute('CREATE TABLE IF NOT EXISTS state (id INTEGER PRIMARY KEY, data TEXT)')
        self.execute('CREATE TABLE IF NOT EXISTS metadata (name TEXT PRIMARY KEY, data TEXT)')
        self.execute('CREATE TABLE IF NOT EXISTS parts (seq INTEGER PRIMARY KEY, data TEXT)')
        self.execute('CREATE TABLE IF NOT EXISTS seen (id TEXT PRIMARY KEY, hash BLOB) WITHOUT ROWID')
        self.part_count = self.execute('SELECT count(*) FROM parts').fetchone()[0]
        self.commit()

    def insert_rows(self, table: str, rows: list[dict[str, Any]]) -> None:
        columns = self.columns[table]
        names = ','.join(quote(name) for name in columns)
        placeholders = ','.join('?' for _ in columns)
        self.executemany(f'INSERT INTO {table} ({names}) VALUES ({placeholders})',
                         ([row.get(name) for name in columns] for row in rows))

    def lookup(self, table: str, key: Any) -> dict[str, Any] | None:
        cache_key = (table, str(key))
        if cache_key in self.cache:
            self.cache.move_to_end(cache_key)
            return self.cache[cache_key]
        if table in ('log_media', 'log_media_plays'):
            visit, view = str(key).split(':', 1)
            row = self.execute(f'SELECT * FROM {table} WHERE CAST(idvisit AS TEXT)=? AND CAST(idview AS TEXT)=?',
                               (visit, view)).fetchone()
        else:
            row = self.execute(f'SELECT * FROM {table} WHERE CAST({KEYS[table]} AS TEXT)=?', (str(key),)).fetchone()
        if row is None:
            return None
        result = dict(zip(['_seq', *self.columns[table]], row))
        size = len(repr(result)) * 4
        if size <= 65536:
            while self.cache and (len(self.cache) >= 2048 or self.cache_bytes + size > 8 * 1024 * 1024):
                _, removed = self.cache.popitem(last=False)
                self.cache_bytes -= len(repr(removed)) * 4
            self.cache[cache_key] = result
            self.cache_bytes += size
        return result

    def rows(self, table: str, after: int = 0) -> Iterator[dict[str, Any]]:
        for row in self.execute(f'SELECT * FROM {table} WHERE _seq>? ORDER BY _seq', (after,)):
            yield dict(zip(['_seq', *self.columns[table]], row))

    def checkpoint(self, state: dict[str, Any]) -> None:
        # Immutable metadata and completed parts must not be rewritten at every checkpoint.
        for key in ('config', 'index'):
            if not getattr(self, 'metadata_saved', False):
                self.execute('INSERT OR IGNORE INTO metadata VALUES (?,?)', (key, json.dumps(state[key])))
        for seq, part in enumerate(state['files'][self.part_count:], self.part_count + 1):
            self.execute('INSERT INTO parts VALUES (?,?)', (seq, json.dumps(part)))
        saved = {key: value for key, value in state.items() if key not in ('config', 'index', 'files')}
        saved['report'] = {key: value for key, value in state['report'].items() if key != 'output_files'}
        self.execute('INSERT OR REPLACE INTO state VALUES (1,?)', (json.dumps(saved),))
        self.commit()
        self.part_count = len(state['files'])
        self.metadata_saved = True

    def load_checkpoint(self) -> dict[str, Any]:
        saved = self.execute('SELECT data FROM state WHERE id=1').fetchone()
        if not saved:
            raise ValueError('No checkpoint found; start a new run')
        state = json.loads(saved[0])
        state.update({name: json.loads(data) for name, data in self.execute('SELECT name,data FROM metadata')})
        state['files'] = [json.loads(row[0]) for row in self.execute('SELECT data FROM parts ORDER BY seq')]
        return state


class DiskGuard:
    """Reserve space both on the output filesystem and on the WSL host volume."""

    def __init__(self, output: Path, reserve: int, host: Path | None = None) -> None:
        self.output, self.reserve = output, reserve
        self.host = host
        if host is None and Path('/proc/sys/kernel/osrelease').exists():
            if 'microsoft' in Path('/proc/sys/kernel/osrelease').read_text().lower() and Path('/mnt/c').is_dir():
                self.host = Path('/mnt/c')
        self.last = 0.0

    def check(self, *, force: bool = False) -> None:
        now = time.monotonic()
        if not force and now - self.last < 2:
            return
        self.last = now
        for path in (self.output, self.host):
            if path is None:
                continue
            free = shutil.disk_usage(path).free
            if free < self.reserve:
                raise OSError(f'Low disk space on {path}: {free / 1024**3:.1f} GiB free; '
                              f'{self.reserve / 1024**3:.1f} GiB reserve required. Free space, then resume.')
