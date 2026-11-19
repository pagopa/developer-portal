"""Recovery, bounded output and disk-pressure checks using synthetic dumps."""

import fcntl
import hashlib
import io
import json
import sqlite3
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

from from_sql import run
from sql_pipeline import Parts
from sql_storage import DiskGuard, Store
import test_from_sql
from test_from_sql import dump, fixture, read_events


class PipelineTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.source, self.output = self.root / 'dump.sql', self.root / 'out'
        dump(self.source, fixture())
        self.stdout = redirect_stdout(io.StringIO())
        self.stdout.__enter__()
        self.addCleanup(self.stdout.__exit__, None, None, None)

    def convert(self, **options: object) -> dict:
        return run(self.source, self.output, part_events=1, **options)

    def assert_matches_clean_run(self) -> None:
        clean = self.root / 'clean'
        expected = run(self.source, clean, part_events=1)
        actual = self.convert(resume=True)
        self.assertEqual(actual, expected)
        self.assertEqual(read_events(self.output), read_events(clean))
        self.assertEqual((self.output / 'issues.ndjson').read_bytes(), (clean / 'issues.ndjson').read_bytes())
        self.assertFalse(list(self.output.glob('*.partial.ndjson')))

    def test_parts_manifest_and_compact_native_storage(self) -> None:
        data = fixture()
        data['log_visit'][0]['unused_large_field'] = 'x' * 10000
        data['log_visit'][0]['config_browser_version'] = '001.0'
        dump(self.source, data)
        report = self.convert()
        self.assertEqual(report['converted_actions'], 3)
        manifest = json.loads((self.output / 'manifest.json').read_text())
        self.assertEqual(len(manifest['files']), 3)
        for part in manifest['files']:
            content = (self.output / part['file']).read_bytes()
            self.assertEqual(len(content), part['bytes'])
            self.assertEqual(hashlib.sha256(content).hexdigest(), part['sha256'])
            self.assertEqual(len(content.splitlines()), part['events'])
        with sqlite3.connect(self.output / 'staging.sqlite') as db:
            columns = [row[1] for row in db.execute('PRAGMA table_info(log_visit)')]
            self.assertNotIn('unused_large_field', columns)
            self.assertEqual(db.execute('SELECT config_browser_version,idvisit FROM log_visit').fetchone(), ('001.0', 42))

    def test_staging_rollback_and_resume_at_insert_boundary(self) -> None:
        # Split visits into two statements, then interrupt after inserting the second.
        text = self.source.read_text()
        visit_insert = next(line for line in text.splitlines(True) if line.startswith('INSERT INTO `log_visit`'))
        second = visit_insert.replace('(42,', '(43,')
        self.source.write_text(text.replace(visit_insert, visit_insert + second))
        original = Store.insert_rows

        def interrupt(db: Store, table: str, rows: list[dict]) -> None:
            original(db, table, rows)
            if table == 'log_visit' and any(row['idvisit'] == 43 for row in rows):
                raise KeyboardInterrupt()

        with patch.object(Store, 'insert_rows', interrupt), self.assertRaises(KeyboardInterrupt):
            self.convert()
        with sqlite3.connect(self.output / 'staging.sqlite') as db:
            self.assertEqual(db.execute('SELECT count(*) FROM log_visit').fetchone()[0], 1)
        self.assert_matches_clean_run()

    def test_export_recovers_finished_but_uncommitted_part(self) -> None:
        original = Store.checkpoint

        def interrupt(db: Store, state: dict) -> None:
            if state['phase'] == 'export' and state['processed'] == 2:
                raise KeyboardInterrupt()
            original(db, state)

        with patch.object(Store, 'checkpoint', interrupt), self.assertRaises(KeyboardInterrupt):
            self.convert()
        self.assertEqual(len(list(self.output.glob('events-*.ndjson'))), 2)
        self.assert_matches_clean_run()

    def test_export_recovers_unfinished_part(self) -> None:
        original = Parts.write

        def interrupt(parts: Parts, line: bytes) -> None:
            original(parts, line)
            raise OSError('simulated write failure')

        with patch.object(Parts, 'write', interrupt), self.assertRaisesRegex(OSError, 'write failure'):
            self.convert()
        self.assertEqual(len(list(self.output.glob('*.partial.ndjson'))), 1)
        self.assert_matches_clean_run()

    def test_uncommitted_issues_and_counters_are_replayed_once(self) -> None:
        data = fixture()
        data['log_action'][1]['name'] = 'x' * 300
        first = data['log_link_visit_action'][0]
        data['log_link_visit_action'].append({**first, 'idlink_va': 101, 'idaction_url': 999})
        dump(self.source, data)
        original = Store.checkpoint

        def interrupt(db: Store, state: dict) -> None:
            if state['phase'] == 'export' and state['processed'] == 2:
                raise OSError('interrupted after writing rejection')
            original(db, state)

        with patch.object(Store, 'checkpoint', interrupt), self.assertRaises(OSError):
            self.convert()
        self.assert_matches_clean_run()
        report = json.loads((self.output / 'report.json').read_text())
        self.assertEqual(report['rejected_actions'], 1)
        self.assertEqual(report['warning_count'], 1)

    def test_default_parts_never_exceed_api_batch_limits(self) -> None:
        data = fixture()
        first = data['log_link_visit_action'][0]
        data['log_link_visit_action'] = [{**first, 'idlink_va': i} for i in range(1, 2101)]
        dump(self.source, data)
        report = run(self.source, self.output)
        self.assertEqual(report['converted_actions'], 2102)
        for part in report['output_files']:
            self.assertLessEqual(part['events'], 2000)
            self.assertLessEqual(part['bytes'], 8 * 1024**2)

    def test_oversize_part_options_are_rejected_before_writing(self) -> None:
        with self.assertRaises(ValueError):
            run(self.source, self.output, part_events=2001)
        self.assertFalse(self.output.exists())

    def test_quoted_sql_identifiers_preserve_reference_matching(self) -> None:
        data = fixture()
        data['log_visit'][0]['idvisit'] = '42'
        data['log_action'][0]['idaction'] = '1'
        data['log_media'][0]['idview'] = 123
        data['log_media_plays'][0]['idview'] = '123'
        dump(self.source, data)
        report = self.convert()
        self.assertEqual(report['converted_actions'], 3)
        media = next(e for e in read_events(self.output) if e['event'] == 'Media Interaction')
        self.assertEqual(media['properties']['media_consumed_segment_ends_seconds'], [15])

    def test_duration_phase_is_rebuilt_after_interruption(self) -> None:
        import from_sql
        original = from_sql.calculate_durations

        def interrupt(db: Store, *args: object) -> None:
            original(db, *args)
            raise KeyboardInterrupt()

        with patch.object(from_sql, 'calculate_durations', interrupt), self.assertRaises(KeyboardInterrupt):
            self.convert()
        self.assert_matches_clean_run()

    def test_source_options_and_committed_output_are_validated(self) -> None:
        self.convert()
        with self.assertRaisesRegex(ValueError, 'options changed'):
            self.convert(resume=True, site=8)
        self.source.write_text(self.source.read_text() + '\n')
        with self.assertRaisesRegex(ValueError, 'Source'):
            self.convert(resume=True)

    def test_changed_part_is_not_overwritten(self) -> None:
        self.convert()
        part = next(self.output.glob('events-*.ndjson'))
        part.write_text('changed')
        with self.assertRaisesRegex(ValueError, 'output changed'):
            self.convert(resume=True)
        self.assertEqual(part.read_text(), 'changed')

    def test_old_staging_is_not_reused(self) -> None:
        self.output.mkdir()
        with sqlite3.connect(self.output / 'staging.sqlite') as db:
            db.execute('CREATE TABLE records (data TEXT)')
        with self.assertRaisesRegex(ValueError, 'Old staging'):
            self.convert(resume=True)

    def test_active_output_cannot_be_resumed_concurrently(self) -> None:
        self.convert()
        with (self.output / '.conversion.lock').open('a') as lock:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            with self.assertRaisesRegex(ValueError, 'already using'):
                self.convert(resume=True)

    def test_disk_guard_checks_output_and_host(self) -> None:
        guard = DiskGuard(self.root, 100, self.root / 'host')
        with patch('sql_storage.shutil.disk_usage', side_effect=[SimpleNamespace(free=200), SimpleNamespace(free=50)]) as usage:
            with self.assertRaisesRegex(OSError, 'Low disk space'):
                guard.check(force=True)
        self.assertEqual([call.args[0] for call in usage.call_args_list], [self.root, self.root / 'host'])

    def test_disk_failure_report_cannot_hide_original_failure(self) -> None:
        with patch.object(Store, 'insert_rows', side_effect=OSError('original disk failure')), \
             patch('sql_pipeline.atomic_json', side_effect=OSError('report disk failure')), \
             self.assertRaisesRegex(OSError, 'original disk failure'):
            self.convert()

    def test_byte_limit_splits_parts(self) -> None:
        files: list[dict] = []
        parts = Parts(self.root, files, 10)
        parts.write(b'12345\n')
        parts.write(b'67890\n')
        parts.finish()
        self.assertEqual([part['bytes'] for part in files], [6, 6])

    def test_directory_cli_resume(self) -> None:
        inputs = self.root / 'inputs'
        inputs.mkdir()
        self.source.rename(inputs / self.source.name)
        invoke = test_from_sql.MainCLITests().invoke
        args = [str(inputs), '--output-dir', str(self.output), '--part-events', '1']
        first = invoke(*args)
        self.assertEqual(first.returncode, 0, first.stderr)
        resumed = invoke(*args, '--resume')
        self.assertEqual(resumed.returncode, 0, resumed.stderr)
        report = json.loads((self.output / 'files/dump.sql/report.json').read_text())
        self.assertEqual(report['converted_actions'], 3)


if __name__ == '__main__':
    unittest.main()
