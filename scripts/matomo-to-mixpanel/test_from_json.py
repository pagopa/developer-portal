"""Exercise restored JSON input with synthetic visits and offline validation."""

import copy
import hashlib
import io
import json
import subprocess
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from datetime import date
from pathlib import Path
from unittest.mock import patch

import from_json
from main import convert_action
from test_main import epoch, sample


def visit(site: int = 8, visit_id: int = 42, action_id: int = 100) -> dict:
    data, action = sample()
    data.update(idSite=site, idVisit=visit_id, actionDetails=[{**action, 'pageId': action_id}])
    return data


class JsonTests(unittest.TestCase):
    def setUp(self) -> None:
        self.root = Path(self.enterContext(tempfile.TemporaryDirectory()))
        self.source = self.root / 'input'
        self.source.mkdir()
        self.output = self.root / 'out'
        self.stdout = self.enterContext(redirect_stdout(io.StringIO()))
        self.enterContext(patch('socket.socket.connect', side_effect=AssertionError('Network is forbidden')))

    def write(self, name: str, visits: object) -> Path:
        path = self.source / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(visits))
        return path

    def convert(self, **options: object) -> dict:
        options.setdefault('all_events', False)
        return from_json.run(self.source, self.output, reserve_bytes=0, **options)

    def manifest(self) -> dict:
        manifest = json.loads((self.output / 'manifest.json').read_text())
        self.assertIn(manifest['status'], ('completed', 'completed_with_errors'))
        self.assertEqual(manifest['events'], sum(part['events'] for part in manifest['files']))
        return manifest

    def events(self) -> list[dict]:
        events = []
        for part in self.manifest()['files']:
            payload = (self.output / part['file']).read_bytes()
            self.assertEqual(len(payload), part['bytes'])
            self.assertEqual(hashlib.sha256(payload).hexdigest(), part['sha256'])
            lines = payload.splitlines()
            self.assertEqual(len(lines), part['events'])
            self.assertLessEqual(part['events'], 2000)
            self.assertLessEqual(part['bytes'], 9 * 1024**2)
            events.extend(json.loads(line) for line in lines)
        return events

    def test_only_site8_pageviews_are_exported_with_shared_mapping(self) -> None:
        selected = visit()
        selected['actionDetails'].extend([
            {**selected['actionDetails'][0], 'type': 'event', 'pageId': 101},
            {**selected['actionDetails'][0], 'type': 'search', 'pageId': 102}])
        self.write('day.json', [selected, visit(site=4, visit_id=43)])
        report = self.convert(site_id=8)
        self.assertEqual(report['status'], 'completed')
        self.assertEqual(report['converted_actions'], 1)
        self.assertEqual(report['non_pageview_actions_skipped'], 2)
        self.assertEqual(report['other_site_actions_skipped'], 1)
        self.assertEqual(report['sites'], {'8': 1, '4': 1})
        self.assertEqual(self.events(), [convert_action(selected, selected['actionDetails'][0])])

    def test_reader_discovers_nested_json_and_ignores_windows_sidecars(self) -> None:
        self.write('nested/first.JSON', [visit()])
        self.write('second.json', [visit(visit_id=43, action_id=101)])
        (self.source / 'bad.json:Zone.Identifier').write_text('Windows metadata')
        report = self.convert(site_id=8)
        self.assertEqual(report['processed_files'], 2)
        self.assertEqual(report['converted_actions'], 2)
        self.assertEqual(len(report['inputs']), 2)

    def test_all_event_families_keep_shared_mapping_and_site_selection(self) -> None:
        selected = visit()
        action = selected['actionDetails'][0]
        selected['actionDetails'] = [
            {**action, 'type': kind, 'pageId': 100 + index, 'crashEventId': 900}
            for index, kind in enumerate(('action', 'download', 'outlink', 'event', 'crash', 'media', 'search'))]
        other = visit(site=4, visit_id=43)
        other['actionDetails'][0]['type'] = 'crash'
        self.write('day.json', [selected, other])
        report = self.convert(site_id=8, all_events=True)
        self.assertEqual(report['status'], 'completed')
        self.assertEqual(report['event_scope'], 'all')
        self.assertEqual(report['converted_actions'], 7)
        self.assertEqual(report['non_pageview_actions_skipped'], 0)
        self.assertEqual(report['other_site_actions_skipped'], 1)
        self.assertEqual(self.events(), [convert_action(selected, item) for item in selected['actionDetails']])
        self.assertEqual(len(report['events_by_type']), 7)
        self.assertEqual(report['events_by_type']['Page Viewed'], 1)
        self.assertEqual(report['first_event'], report['first_pageview'])

    def test_all_event_dates_use_each_action_time_across_midnight(self) -> None:
        selected = visit()
        selected.update(firstActionTimestamp=epoch('2026-09-30T21:55:00'),
                        lastActionTimestamp=epoch('2026-09-30T22:05:00'))
        action = selected['actionDetails'][0]
        selected['actionDetails'] = [
            {**action, 'type': 'event', 'timestamp': epoch('2026-09-30T23:55:00')},
            {**action, 'type': 'outlink', 'pageId': 101, 'timestamp': epoch('2026-10-01T00:05:00')}]
        self.write('day.json', [selected])
        report = self.convert(all_events=True, start=date(2026, 10, 1), end=date(2026, 10, 31))
        self.assertEqual(report['converted_actions'], 1)
        self.assertEqual(report['date_filtered_actions'], 1)
        self.assertEqual(report['date_filtered_pageviews'], 0)
        self.assertEqual(report['first_event'], '2026-10-01T00:05:00+02:00')
        self.assertIsNone(report['first_pageview'])
        self.assertEqual(self.events()[0]['event'], 'Outbound Link Clicked')

    def test_all_event_duplicates_and_conflicts_remain_checked_across_files(self) -> None:
        selected = visit()
        selected['actionDetails'][0]['type'] = 'event'
        self.write('1.json', [selected])
        self.write('2.json', [selected])
        changed = copy.deepcopy(selected)
        changed['actionDetails'][0]['eventName'] = 'Changed event'
        self.write('3.json', [changed])
        report = self.convert(all_events=True)
        self.assertEqual(report['status'], 'completed_with_errors')
        self.assertEqual((report['converted_actions'], report['duplicates'], report['rejected_actions']), (1, 1, 1))
        self.assertEqual(report['events_by_type'], {'Matomo Custom Event': 1})
        self.assertEqual(len(self.events()), 1)

    def test_invalid_non_pageview_actions_are_reported_in_all_event_mode(self) -> None:
        selected = visit()
        action = selected['actionDetails'][0]
        selected['actionDetails'] = [
            {**action, 'type': 'outlink'},
            {**action, 'type': 'unsupported'},
            {**action, 'type': 'crash'},
            {**action, 'type': 'crash', 'crashEventId': 900, 'timestamp': epoch('2026-06-08T14:00:00')}]
        self.write('day.json', [selected])
        report = self.convert(all_events=True)
        self.assertEqual(report['status'], 'completed_with_errors')
        self.assertEqual((report['converted_actions'], report['rejected_actions']), (1, 3))
        self.assertEqual(report['non_pageview_actions_skipped'], 0)
        self.assertEqual(self.events()[0]['event'], 'Outbound Link Clicked')

    def test_all_event_count_only_retains_type_counts_without_payload_files(self) -> None:
        selected = visit()
        selected['actionDetails'].append({**selected['actionDetails'][0], 'type': 'download', 'pageId': 101})
        self.write('day.json', [selected])
        report = self.convert(site_id=8, all_events=True, count_only=True)
        self.assertEqual(report['events_by_type'], {'Page Viewed': 1, 'File Downloaded': 1})
        self.assertEqual(report['converted_actions'], 2)
        self.assertFalse((self.output / 'manifest.json').exists())
        self.assertFalse(list(self.output.glob('events-*')))

    def test_single_file_and_existing_output_are_supported_safely(self) -> None:
        source = self.write('day.json', [visit()])
        before = source.read_bytes()
        from_json.run(source, self.output, site_id=8, reserve_bytes=0)
        with self.assertRaises(FileExistsError):
            from_json.run(source, self.output, reserve_bytes=0)
        self.assertEqual(source.read_bytes(), before)

    def test_parts_compact_across_input_days_and_respect_event_limits(self) -> None:
        for day in range(3):
            self.write(f'{day}.json', [visit(visit_id=day + 1, action_id=day + 1)])
        report = self.convert(part_events=2)
        manifest = self.manifest()
        self.assertEqual([part['events'] for part in manifest['files']], [2, 1])
        self.assertEqual(report['payload_bytes'], sum(part['bytes'] for part in manifest['files']))

    def test_byte_limit_splits_parts_before_the_event_limit(self) -> None:
        item = visit()
        line = json.dumps(convert_action(item, item['actionDetails'][0]), ensure_ascii=False,
                          separators=(',', ':')).encode() + b'\n'
        self.write('day.json', [item, visit(visit_id=43, action_id=101)])
        self.convert(part_bytes=len(line) + 100)
        manifest = self.manifest()
        self.assertEqual([part['events'] for part in manifest['files']], [1, 1])

    def test_count_only_does_not_write_event_files_or_upload_manifest(self) -> None:
        self.write('day.json', [visit()])
        report = self.convert(count_only=True, site_id=8)
        self.assertEqual(report['converted_actions'], 1)
        self.assertGreater(report['payload_bytes'], 0)
        self.assertFalse((self.output / 'manifest.json').exists())
        self.assertFalse(list(self.output.glob('events-*')))

    def test_duplicates_are_checked_across_files_and_conflicts_are_reported(self) -> None:
        item = visit()
        self.write('1.json', [item])
        self.write('2.json', [item])
        changed = copy.deepcopy(item)
        changed['actionDetails'][0]['pageTitle'] = 'Changed title'
        self.write('3.json', [changed])
        report = self.convert()
        self.assertEqual(report['status'], 'completed_with_errors')
        self.assertEqual((report['converted_actions'], report['duplicates'], report['rejected_actions']), (1, 1, 1))
        self.assertEqual(len(self.events()), 1)

    def test_actual_event_date_controls_selection_instead_of_visit_start(self) -> None:
        item = visit()
        item.update(firstActionTimestamp=epoch('2026-09-30T21:55:00'),
                    lastActionTimestamp=epoch('2026-09-30T22:05:00'))
        first = item['actionDetails'][0]
        first.update(timestamp=epoch('2026-09-30T23:55:00'), pageId=100)
        item['actionDetails'].append({**first, 'timestamp': epoch('2026-10-01T00:05:00'), 'pageId': 101})
        self.write('2026-09-30.json', [item])
        report = self.convert(start=date(2026, 10, 1), end=date(2026, 10, 31))
        self.assertEqual((report['converted_actions'], report['date_filtered_pageviews']), (1, 1))
        self.assertEqual(self.events()[0]['properties']['matomo_action_id'], 'pageId:101')

    def test_invalid_actions_and_visits_are_reported_without_raw_source_data(self) -> None:
        item = visit()
        item['actionDetails'].extend([None, {**item['actionDetails'][0], 'pageId': None}])
        self.write('day.json', [item, {'visitIp': 'private-source-text'}])
        report = self.convert()
        self.assertEqual((report['converted_actions'], report['rejected_actions'], report['invalid_visits']), (1, 2, 1))
        self.assertNotIn('private-source-text', (self.output / 'issues.ndjson').read_text())

    def test_aggregate_or_malformed_json_never_produces_an_upload_manifest(self) -> None:
        self.write('day.json', {'nb_visits': 10, 'nb_actions': 20})
        with self.assertRaisesRegex(ValueError, 'visits array'):
            self.convert()
        self.assertFalse((self.output / 'manifest.json').exists())
        self.assertEqual(json.loads((self.output / 'report.json').read_text())['status'], 'failed')

    def test_nonfinite_json_numbers_are_rejected_without_the_uploader(self) -> None:
        source = self.write('day.json', [])
        for constant in ('NaN', 'Infinity', '-Infinity'):
            with self.subTest(constant=constant):
                source.write_text('[{"invalid":' + constant + '}]')
                with self.assertRaisesRegex(ValueError, 'Invalid UTF-8 JSON'):
                    from_json.read_visits(source)

    def test_conversion_cannot_continue_when_the_output_lock_is_unavailable(self) -> None:
        self.write('day.json', [visit()])
        with patch.object(from_json.fcntl, 'flock', side_effect=BlockingIOError('Output is locked')):
            with self.assertRaises(BlockingIOError):
                self.convert()
        self.assertFalse((self.output / 'manifest.json').exists())

    def test_changed_source_is_detected_before_publishing_the_manifest(self) -> None:
        source = self.write('day.json', [visit()])
        original = from_json.read_visits

        def change(path: Path) -> tuple[list, dict]:
            result = original(path)
            path.write_bytes(path.read_bytes() + b' ')
            return result

        with patch.object(from_json, 'read_visits', change), self.assertRaisesRegex(ValueError, 'changed'):
            self.convert()
        self.assertFalse((self.output / 'manifest.json').exists())

    def test_write_failure_does_not_publish_partial_output(self) -> None:
        self.write('day.json', [visit()])
        with patch.object(from_json.Parts, 'write', side_effect=OSError('Synthetic write failure')):
            with self.assertRaisesRegex(OSError, 'Synthetic write failure'):
                self.convert()
        self.assertFalse((self.output / 'manifest.json').exists())

    def test_bad_options_and_nested_output_are_rejected(self) -> None:
        self.write('day.json', [visit()])
        for options in ({'site_id': 0}, {'start': date(2026, 6, 8), 'end': date(2026, 6, 7)},
                        {'part_events': 2001}, {'part_bytes': 10_000_000}):
            with self.subTest(options=options), self.assertRaises(ValueError):
                self.convert(**options)
        with self.assertRaisesRegex(ValueError, 'outside'):
            from_json.run(self.source, self.source / 'nested', reserve_bytes=0)
        self.assertFalse(self.output.exists())

    def test_main_restores_json_dispatch_and_passes_site_and_date_options(self) -> None:
        self.write('day.json', [visit(), visit(site=4, visit_id=43)])
        result = subprocess.run([sys.executable, '-B', str(Path(__file__).with_name('main.py')),
                                 str(self.source), '--site-id', '8', '--from-date', '2026-06-07',
                                 '--to-date', '2026-06-07', '--min-free-gib', '0',
                                 '--output-dir', str(self.output)], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(len(self.events()), 1)

    def test_json_cli_rejects_sql_only_options(self) -> None:
        self.write('day.json', [visit()])
        for flag in ('--include-unplayed-media', '--table-prefix'):
            args = [flag, 'matomo_'] if flag == '--table-prefix' else [flag]
            result = subprocess.run([sys.executable, '-B', str(Path(__file__).with_name('main.py')),
                                     str(self.source), *args, '--output-dir', str(self.output)],
                                    capture_output=True, text=True)
            self.assertEqual(result.returncode, 2)
            self.assertFalse(self.output.exists())

    def test_cli_rejects_all_event_override(self) -> None:
        self.write('day.json', [visit()])
        for script in ('main.py', 'from_json.py'):
            result = subprocess.run([sys.executable, '-B', str(Path(__file__).with_name(script)),
                                     str(self.source), '--all-events', '--output-dir', str(self.output)],
                                    capture_output=True, text=True)
            self.assertEqual(result.returncode, 2)
            self.assertIn('Page Viewed events only', result.stderr)
            self.assertFalse(self.output.exists())

    def test_json_defaults_keep_only_site8_pageviews_without_selection_flags(self) -> None:
        selected = visit()
        selected['actionDetails'].append({**selected['actionDetails'][0], 'type': 'event', 'pageId': 101})
        self.write('day.json', [selected, visit(site=4, visit_id=43)])
        report = from_json.run(self.source, self.output, reserve_bytes=0)
        self.assertEqual(report['site_id'], 8)
        self.assertEqual(report['event_scope'], 'pageviews')
        self.assertEqual(report['converted_actions'], 1)
        self.assertEqual(report['other_site_actions_skipped'], 1)
        self.assertEqual({event['event'] for event in self.events()}, {'Page Viewed'})

    def test_main_defaults_keep_only_site8_pageviews(self) -> None:
        selected = visit()
        selected['actionDetails'].append({**selected['actionDetails'][0], 'type': 'event', 'pageId': 101})
        self.write('day.json', [selected, visit(site=4, visit_id=43)])
        result = subprocess.run([sys.executable, '-B', str(Path(__file__).with_name('main.py')),
                                 str(self.source), '--min-free-gib', '0', '--output-dir', str(self.output)],
                                capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(len(self.events()), 1)
        self.assertEqual({event['properties']['matomo_site_id'] for event in self.events()}, {'8'})

    def test_cli_readers_reject_other_sites_before_creating_output(self) -> None:
        self.write('day.json', [visit()])
        for script in ('main.py', 'from_json.py', 'from_sql.py'):
            result = subprocess.run([sys.executable, '-B', str(Path(__file__).with_name(script)),
                                     str(self.source / 'day.json'), '--site-id', '4',
                                     '--output-dir', str(self.output)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 2, result.stderr)
            self.assertFalse(self.output.exists())


if __name__ == '__main__':
    unittest.main()
