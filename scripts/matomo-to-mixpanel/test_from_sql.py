"""SQL reader tests use synthetic records; no production data or credentials."""
import io
import json
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch
from contextlib import redirect_stdout
from datetime import date
from pathlib import Path

from from_sql import Progress, index_dump, literal, records, run, tuples


def dump(path: Path, tables: dict[str, list[dict]]) -> None:
    def value(item: object) -> str:
        if item is None:
            return 'NULL'
        if isinstance(item, str):
            return "'" + item.replace('\\', '\\\\').replace("'", "\\'") + "'"
        return str(item)
    with path.open('w') as stream:
        for table, rows in tables.items():
            columns = list(rows[0])
            stream.write(f'CREATE TABLE `{table}` (\n')
            stream.write(',\n'.join(f' `{key}` TEXT' for key in columns))
            stream.write('\n) ENGINE=InnoDB;\n')
            stream.write(f'INSERT INTO `{table}` VALUES ')
            stream.write(','.join('(' + ','.join(value(row.get(k)) for k in columns) + ')' for row in rows))
            stream.write(';\n')


def read_events(output: Path) -> list[dict]:
    manifest = json.loads((output / 'manifest.json').read_text())
    return [json.loads(line) for part in manifest['files']
            for line in (output / part['file']).read_text().splitlines()]


def fixture() -> dict[str, list[dict]]:
    visit = {'idvisit': 42, 'idsite': 8, 'idvisitor': 'abc123',
             'visit_first_action_time': '2026-06-07 12:00:00',
             'visit_last_action_time': '2026-06-07 12:01:00'}
    return {'log_visit': [visit], 'log_action': [
        {'idaction': 1, 'type': 1, 'name': 'example.com/p', 'url_prefix': 2},
        {'idaction': 2, 'type': 4, 'name': 'Page', 'url_prefix': None},
        {'idaction': 3, 'type': 8, 'name': 'search term', 'url_prefix': None}],
        'log_link_visit_action': [{'idlink_va': 100, 'idsite': 8, 'idvisit': 42,
            'server_time': '2026-06-07 12:00:00', 'idaction_url': 1,
            'idaction_name': 2, 'idpageview': 'abcdef', 'time_network': 2, 'time_server': 3}],
        'log_media': [{'idvisit': 42, 'idsite': 8, 'idview': 'video1',
            'server_time': '2026-06-07 12:00:00', 'resource': 'https://example.com/video',
            'media_type': 1, 'watched_time': 10},
            {'idvisit': 42, 'idsite': 8, 'idview': 'video2',
            'server_time': '2026-06-07 12:00:00', 'resource': 'https://example.com/video',
            'media_type': 1, 'watched_time': 0}],
        'log_media_plays': [{'idvisit': 42, 'idview': 'video1', 'segment_15': 1, 'segment_30': 0}],
        'log_crash': [{'idlogcrash': 1, 'message': 'Oops', 'crash_type': 'Error'}],
        'log_crash_event': [{'idlogcrashevent': 5, 'idsite': 8, 'idvisit': 42,
                            'idlogcrash': 1, 'server_time': '2026-06-07 12:00:01'}]}


class MainCLITests(unittest.TestCase):
    def invoke(self, *args: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run([sys.executable, str(Path(__file__).with_name('main.py')), *args],
                              capture_output=True, text=True, check=False)

    def test_main_dispatches_sql_and_forwards_options(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / 'input.SQL'
            dump(source, {'matomo_' + k: v for k, v in fixture().items()})
            result = self.invoke(str(source), '--site-id', '8', '--from-date', '2026-06-07',
                                 '--to-date', '2026-06-07', '--table-prefix', 'matomo_',
                                 '--include-unplayed-media', '--output-dir', str(root / 'out'))
            self.assertEqual(result.returncode, 0, result.stderr)
            report = json.loads((root / 'out/report.json').read_text())
            self.assertEqual(report['converted_actions'], 4)
            self.assertEqual(report['unplayed_media_skipped'], 0)

    def test_sql_validation_does_not_create_output(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / 'input.sql'
            dump(source, fixture())
            cases = [['--site-id', '8', '--from-date', '2026-06-08', '--to-date', '2026-06-07'],
                     ['--site-id', '0', '--from-date', '2026-06-07', '--to-date', '2026-06-07']]
            for options in cases:
                result = self.invoke(str(source), *options, '--output-dir', str(root / 'out'))
                self.assertEqual(result.returncode, 2)
                self.assertFalse((root / 'out').exists())

    def test_no_arguments_discovers_sql_and_includes_all_sites_and_dates(self) -> None:
        import main as entry

        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            nested = root / 'input' / 'nested'
            nested.mkdir(parents=True)
            data = fixture()
            data['log_visit'].append({**data['log_visit'][0], 'idvisit': 43, 'idsite': 9,
                                     'visit_first_action_time': '2026-06-08 12:00:00',
                                     'visit_last_action_time': '2026-06-08 12:01:00'})
            data['log_media'].append({**data['log_media'][0], 'idvisit': 43, 'idsite': 9,
                                      'server_time': '2026-06-08 12:00:00'})
            dump(nested / 'dump.SQL', data)
            (nested / 'old.json').write_text('not JSON; must not be processed alongside SQL')
            with patch.object(entry, 'SCRIPT_DIR', root), patch.object(sys, 'argv', ['main.py']), redirect_stdout(io.StringIO()):
                self.assertEqual(entry.main(), 0)
            summaries = list((root / 'output').glob('*/summary.json'))
            self.assertEqual(len(summaries), 1)
            summary = json.loads(summaries[0].read_text())
            report_path = summaries[0].parent / summary['results'][0]['report']
            report = json.loads(report_path.read_text())
            self.assertEqual(report['sites'], {'8': 1, '9': 1})
            self.assertEqual(report['first_visit_date'], '2026-06-07')
            self.assertEqual(report['last_visit_date'], '2026-06-08')
            events = read_events(report_path.parent)
            media = [e for e in events if e['event'] == 'Media Interaction']
            self.assertEqual(len(media), 2)
            self.assertEqual(len({e['properties']['$insert_id'] for e in media}), 2)

    def test_sql_without_filters_and_optional_site_filter(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / 'dump.sql'
            dump(source, fixture())
            for name, flags in [('all', []), ('filtered', ['--site-id', '8'])]:
                result = self.invoke(str(source), *flags, '--output-dir', str(root / name))
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertEqual(json.loads((root / name / 'report.json').read_text())['visits'], 1)

    def test_json_input_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / 'day.json'
            source.write_text('[]')
            result = self.invoke(str(source), '--output-dir', str(root / 'out'))
            self.assertEqual(result.returncode, 2)
            self.assertFalse((root / 'out').exists())

    def test_sql_errors_propagate_to_main_exit_code(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            data = fixture()
            data['log_link_visit_action'][0]['idaction_url'] = 999
            dump(root / 'input.sql', data)
            result = self.invoke(str(root / 'input.sql'), '--site-id', '8',
                                 '--from-date', '2026-06-07', '--to-date', '2026-06-07',
                                 '--output-dir', str(root / 'out'))
            self.assertEqual(result.returncode, 1)
            report = json.loads((root / 'out/report.json').read_text())
            self.assertEqual(report['rejected_actions'], 1)
            summary = (root / 'out/summary.txt').read_text()
            self.assertIn(summary, result.stdout)
            self.assertIn('2 events converted.', summary)
            self.assertIn('1 actions rejected.', summary)
            self.assertIn('1 unplayed media rows intentionally excluded.', summary)
            self.assertIn('Missing log_action reference: 999', summary)


class SQLTests(unittest.TestCase):
    def test_progress_uses_table_bytes_and_phase_estimate(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / 'dump.sql'
            dump(source, fixture())
            output = io.StringIO()
            with redirect_stdout(output):
                index = index_dump(source, '')
                total = sum(length for _, length in index['log_visit']['inserts'])
                progress = Progress('Reading visits', total, 'bytes')
                rows = list(records(source, index, 'log_visit', progress))
            self.assertEqual(len(rows), 1)
            self.assertIn(f'100.0% ({total:,}/{total:,} bytes)', output.getvalue())
            self.assertIn('Estimated phase remaining: 0m 0s', output.getvalue())
        with patch('from_sql.time.monotonic', side_effect=[0, 10]), redirect_stdout(io.StringIO()) as output:
            progress = Progress('Test', 100, 'actions')
            progress.update(25)
        self.assertIn('25.0%', output.getvalue())
        self.assertIn('Estimated phase remaining: 0m 30s', output.getvalue())

    def test_staging_flushes_full_batch_and_remaining_rows(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            data = fixture()
            visit = data['log_visit'][0]
            data['log_visit'] = [{**visit, 'idvisit': key} for key in range(1, 5002)]
            dump(root / 'input.sql', data)
            with redirect_stdout(io.StringIO()):
                report = run(root / 'input.sql', root / 'out')
            self.assertEqual(report['visits'], 5001)
            self.assertEqual(report['converted_actions'], 3)
            self.assertEqual(report['status'], 'completed')

    def test_literals_and_sql_not_executed(self) -> None:
        self.assertEqual(literal(b"_binary '\\0\\xff'"), b'\0xff'.hex())
        self.assertEqual(literal(b'0x00ff'), '00ff')
        self.assertEqual(literal(b"'it\\'s, (safe); DROP TABLE x;\\n'"), "it's, (safe); DROP TABLE x;\n")
        self.assertEqual(literal(b"'it''s'"), "it's")
        self.assertEqual(list(tuples(b"(NULL,-1,1.5e2,'x');\n", 0)), [[None, -1, 150.0, 'x']])
        with self.assertRaises(ValueError):
            list(tuples(b'(1,NOW());', 0))
        with self.assertRaises(ValueError):
            list(tuples(b'(1)', 0))

    def test_end_to_end_mapping_and_segments(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            data = fixture()
            data['log_link_visit_action'].append({**data['log_link_visit_action'][0],
                'idlink_va': 101, 'idaction_url': None, 'idaction_name': 3})
            dump(root / 'input.sql', data)
            with redirect_stdout(io.StringIO()):
                report = run(root / 'input.sql', root / 'out', 8, date(2026, 6, 7), date(2026, 6, 7))
            self.assertEqual(report['converted_actions'], 4)
            self.assertEqual(report['unplayed_media_skipped'], 1)
            events = read_events(root / 'out')
            page = next(e['properties'] for e in events if e['event'] == 'Page Viewed')
            self.assertEqual(page['url'], 'https://example.com/p')
            self.assertEqual(page['page_load_time_ms'], 5)
            self.assertEqual(page['time_network_ms'], 2)
            media = next(e['properties'] for e in events if e['event'] == 'Media Interaction')
            self.assertEqual(media['media_consumed_segment_ends_seconds'], [15])
            self.assertEqual(next(e['properties']['search_keyword'] for e in events if e['event'] == 'Site Search'), 'search term')
            with self.assertRaises(FileExistsError):
                run(root / 'input.sql', root / 'out', 8, date(2026, 6, 7), date(2026, 6, 7))

    def test_search_with_url_is_not_mapped_as_a_page_view(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            data = fixture()
            data['log_link_visit_action'].append({**data['log_link_visit_action'][0],
                'idlink_va': 101, 'idaction_name': 3})
            dump(root / 'input.sql', data)
            with redirect_stdout(io.StringIO()):
                run(root / 'input.sql', root / 'out')
            events = read_events(root / 'out')
            search = next(event for event in events if event['properties']['matomo_action_id'] == 'pageId:101')
            self.assertEqual(search['event'], 'Site Search')
            self.assertEqual(search['properties']['search_keyword'], 'search term')

    def test_missing_reference_is_reported_and_unplayed_is_explicit(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            data = fixture()
            data['log_link_visit_action'][0]['idaction_url'] = 999
            dump(root / 'input.sql', data)
            with redirect_stdout(io.StringIO()):
                report = run(root / 'input.sql', root / 'out', 8, date(2026, 6, 7), date(2026, 6, 7), include_unplayed=True)
            self.assertEqual(report['rejected_actions'], 1)
            self.assertEqual(report['status'], 'completed_with_errors')
            events = read_events(root / 'out')
            self.assertIn('Media Observed', [e['event'] for e in events])
            self.assertEqual(len({e['properties']['$insert_id'] for e in events}), 3)

    def test_utc_autumn_fold_and_local_day_selection(self) -> None:
        for clock in ('00:30:00', '01:30:00'):
            with self.subTest(clock=clock), tempfile.TemporaryDirectory() as directory:
                root = Path(directory)
                data = fixture()
                data = {k: data[k] for k in ('log_visit', 'log_action', 'log_link_visit_action')}
                stamp = f'2025-10-26 {clock}'
                data['log_visit'][0].update(visit_first_action_time=stamp, visit_last_action_time=stamp)
                data['log_link_visit_action'][0]['server_time'] = stamp
                dump(root / 'input.sql', data)
                with redirect_stdout(io.StringIO()):
                    report = run(root / 'input.sql', root / 'out', 8, date(2025, 10, 26), date(2025, 10, 26))
                self.assertEqual(report['converted_actions'], 1)

    def test_page_duration_accumulates_intermediate_actions(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            data = fixture()
            data = {k: data[k] for k in ('log_visit', 'log_action', 'log_link_visit_action')}
            first = data['log_link_visit_action'][0]
            first['time_spent_ref_action'] = 0
            data['log_action'].append({'idaction': 4, 'type': 2, 'name': 'external.test', 'url_prefix': 2})
            data['log_link_visit_action'].extend([
                {**first, 'idlink_va': 101, 'server_time': '2026-06-07 12:00:10',
                 'idaction_url': 4, 'time_spent_ref_action': 10},
                {**first, 'idlink_va': 102, 'server_time': '2026-06-07 12:00:30',
                 'time_spent_ref_action': 20}])
            data['log_visit'][0]['visit_total_time'] = 50
            dump(root / 'input.sql', data)
            with redirect_stdout(io.StringIO()):
                run(root / 'input.sql', root / 'out', 8, date(2026, 6, 7), date(2026, 6, 7))
            events = read_events(root / 'out')
            pages = [e['properties'] for e in events if e['event'] == 'Page Viewed']
            self.assertEqual([p['time_spent_seconds'] for p in pages], [30, 20])

    def test_prefix_and_rome_day_boundary(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            data = fixture()
            data = {k: data[k] for k in ('log_visit', 'log_action', 'log_link_visit_action')}
            data['log_visit'][0].update(visit_first_action_time='2026-06-06 22:30:00',
                                        visit_last_action_time='2026-06-06 22:30:00')
            data['log_link_visit_action'][0]['server_time'] = '2026-06-06 22:30:00'
            dump(root / 'input.sql', {'matomo_' + k: v for k, v in data.items()})
            with redirect_stdout(io.StringIO()):
                report = run(root / 'input.sql', root / 'out', 8, date(2026, 6, 7), date(2026, 6, 7), prefix='matomo_')
            self.assertEqual(report['converted_actions'], 1)

    def test_truncated_insert_is_fatal(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            dump(root / 'input.sql', fixture())
            source = root / 'input.sql'
            source.write_text(source.read_text().rstrip()[:-1])
            with redirect_stdout(io.StringIO()), self.assertRaises(ValueError):
                run(source, root / 'out', 8, date(2026, 6, 7), date(2026, 6, 7))
            self.assertEqual(json.loads((root / 'out/report.json').read_text())['status'], 'failed')
            self.assertFalse((root / 'out/manifest.json').exists())

    def test_no_matching_visits_fails_with_report(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            dump(root / 'input.sql', fixture())
            with redirect_stdout(io.StringIO()), self.assertRaisesRegex(ValueError, 'No visits'):
                run(root / 'input.sql', root / 'out', 99, date(2026, 6, 7), date(2026, 6, 7))
            self.assertEqual(json.loads((root / 'out/report.json').read_text())['status'], 'failed')
            self.assertFalse((root / 'out/manifest.json').exists())


if __name__ == '__main__':
    unittest.main()
