"""Validate pageview filtering and recovery using synthetic exports, without HTTP."""

import fcntl
import hashlib
import io
import json
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from datetime import UTC, date, datetime
from pathlib import Path
from unittest.mock import patch

import filter_pageviews as filtering
from upload import Manifest


def event(name: str, number: int) -> bytes:
    value = {"event": name, "properties": {
        "time": 1_700_000_000 + number, "distinct_id": "synthetic-visitor",
        "$insert_id": f"{number:032x}", "url": "https://example.com/it/page",
        "matomo_pageview_id": "shared-page", "page_title": "Caffè",
        "time_spent_seconds": 30, "time_network_ms": 4, "matomo_site_id": "8",
    }}
    return (json.dumps(value, ensure_ascii=False, indent=None) + "\n").encode()


def export(root: Path, groups: list[list[bytes]], status: str = "completed") -> Path:
    root.mkdir()
    parts = []
    for number, lines in enumerate(groups, 1):
        payload = b"".join(lines)
        name = f"events-{number:05d}.ndjson"
        (root / name).write_bytes(payload)
        parts.append({"file": name, "events": len(lines), "bytes": len(payload),
                      "sha256": hashlib.sha256(payload).hexdigest()})
    path = root / "manifest.json"
    path.write_text(json.dumps({"status": status, "events": sum(part["events"] for part in parts),
                                "files": parts}))
    return path


class FilterTests(unittest.TestCase):
    def setUp(self) -> None:
        self.root = Path(self.enterContext(tempfile.TemporaryDirectory()))
        self.source = self.root / "source"
        self.output = self.root / "output"
        self.first = event("Page Viewed", 1)
        self.last = event("Page Viewed", 9).replace(b"\n", b"\r\n")
        self.groups = [[self.first, event("Matomo Custom Event", 2), event("Site Search", 3)],
                       [event("Media Interaction", 4), event("Media Observed", 5)],
                       [event("File Downloaded", 6), event("Outbound Link Clicked", 7),
                        event("Application Crash", 8), self.last]]
        self.manifest = export(self.source, self.groups)
        self.enterContext(redirect_stdout(io.StringIO()))
        self.enterContext(patch("socket.socket.connect", side_effect=AssertionError("Network is forbidden")))

    def run_filter(self, **options: object) -> dict:
        return filtering.run(self.manifest, self.output, reserve_bytes=0, **options)

    def test_mixed_parts_preserve_pageview_bytes_and_reconcile_counts(self) -> None:
        before = {p.name: p.read_bytes() for p in self.source.iterdir()}
        report = self.run_filter()
        self.assertEqual(report["status"], "completed")
        self.assertEqual((report["source_events"], report["kept_events"], report["excluded_events"]), (9, 2, 7))
        self.assertEqual(report["processed_events"], report["kept_events"] + report["excluded_events"])
        self.assertAlmostEqual(report["reduction_percent"], 700 / 9)
        self.assertEqual(report["kept_bytes"], len(self.first) + len(self.last))
        self.assertEqual(report["excluded_by_type"], {name: 1 for name in (
            "Application Crash", "File Downloaded", "Matomo Custom Event", "Media Interaction",
            "Media Observed", "Outbound Link Clicked", "Site Search")})
        manifest = Manifest.load(self.output / "manifest.json")
        self.assertEqual(manifest.events, 2)
        self.assertEqual([part.name for part in manifest.parts], ["events-00001.ndjson", "events-00003.ndjson"])
        self.assertEqual([manifest.read_part(part) for part in manifest.parts], [self.first, self.last])
        self.assertEqual({p.name: p.read_bytes() for p in self.source.iterdir()}, before)
        self.assertEqual(json.loads((self.output / "report.json").read_text()), report)
        self.assertIn("Pageviews retained: 2", (self.output / "summary.txt").read_text())

    def test_count_only_matches_export_without_writing_event_files(self) -> None:
        report = self.run_filter(count_only=True)
        self.assertEqual(report["kept_events"], 2)
        self.assertEqual(report["kept_bytes"], len(self.first) + len(self.last))
        self.assertEqual(report["expected_output_files"], 2)
        self.assertEqual(report["output_files"], 0)
        self.assertFalse((self.output / "manifest.json").exists())
        self.assertEqual(list(self.output.glob("events-*")), [])
        self.assertTrue((self.output / filtering.STATE_FILE).exists())

    def test_parallel_export_preserves_source_order_and_matches_sequential_output(self) -> None:
        report = self.run_filter(workers=2)
        sequential = self.root / "sequential"
        self.assertEqual(report, filtering.run(self.manifest, sequential, reserve_bytes=0))
        for name in ("manifest.json", "events-00001.ndjson", "events-00003.ndjson"):
            self.assertEqual((self.output / name).read_bytes(), (sequential / name).read_bytes())

    def test_parallel_count_resumes_a_sequential_checkpoint(self) -> None:
        self.run_filter(count_only=True, max_files=1)
        report = self.run_filter(count_only=True, resume=True, workers=2)
        self.assertEqual(report["processed_events"], 9)
        self.assertEqual(report["kept_events"], 2)
        self.assertEqual(report["output_files"], 0)

    def test_parallel_read_failure_leaves_a_resumable_ordered_checkpoint(self) -> None:
        (self.source / "events-00002.ndjson").write_bytes(b"changed")
        with self.assertRaisesRegex(ValueError, "checksum changed"):
            self.run_filter(workers=2)
        self.assertEqual(json.loads((self.output / "report.json").read_text())["processed_files"], 1)
        (self.source / "events-00002.ndjson").write_bytes(b"".join(self.groups[1]))
        self.assertEqual(self.run_filter(resume=True, workers=2)["kept_events"], 2)

    def test_invalid_worker_count_is_rejected_before_creating_output(self) -> None:
        for workers in (0, 9):
            with self.subTest(workers=workers), self.assertRaisesRegex(ValueError, "--workers"):
                self.run_filter(workers=workers)
        self.assertFalse(self.output.exists())

    def test_shared_part_validation_can_return_decoded_events_without_changing_payload(self) -> None:
        manifest = Manifest.load(self.manifest)
        events = []
        payload = manifest.read_part(manifest.parts[0], events=events)
        self.assertEqual(payload, b"".join(self.groups[0]))
        self.assertEqual(events, [json.loads(line) for line in self.groups[0]])

    def test_empty_result_and_empty_source_are_valid(self) -> None:
        for groups in ([], [[event("Site Search", 10)]]):
            with self.subTest(groups=groups), tempfile.TemporaryDirectory() as directory:
                root = Path(directory)
                source = export(root / "source", groups)
                report = filtering.run(source, root / "out", reserve_bytes=0)
                self.assertEqual(report["kept_events"], 0)
                self.assertEqual(Manifest.load(root / "out" / "manifest.json").parts, ())

    def test_source_conversion_rejections_remain_visible(self) -> None:
        data = json.loads(self.manifest.read_text())
        data["status"] = "completed_with_errors"
        self.manifest.write_text(json.dumps(data))
        report = self.run_filter()
        self.assertEqual(report["status"], "completed")
        self.assertEqual(report["source_status"], "completed_with_errors")
        self.assertEqual(Manifest.load(self.output / "manifest.json").status, "completed_with_errors")

    def test_existing_output_requires_explicit_resume(self) -> None:
        self.run_filter()
        with self.assertRaises(FileExistsError):
            self.run_filter()

    def test_limited_run_publishes_no_manifest_and_resumes_pending_parts(self) -> None:
        report = self.run_filter(max_files=1)
        self.assertEqual(report["status"], "incomplete")
        self.assertEqual(report["processed_events"], 3)
        self.assertFalse((self.output / "manifest.json").exists())
        original = filtering.select_part
        with patch.object(filtering, "select_part", wraps=original) as select:
            report = self.run_filter(resume=True)
        self.assertEqual(select.call_count, 2)
        self.assertEqual(report["kept_events"], 2)
        self.assertEqual(report["excluded_events"], 7)
        with patch.object(filtering, "select_part", side_effect=AssertionError("Already complete")):
            self.assertEqual(self.run_filter(resume=True), report)

    def test_count_only_resumes_without_changing_mode(self) -> None:
        self.run_filter(count_only=True, max_files=2)
        with self.assertRaisesRegex(ValueError, "mode changed"):
            self.run_filter(resume=True)
        self.assertEqual(self.run_filter(count_only=True, resume=True)["processed_events"], 9)

    def test_export_interruption_replays_only_uncommitted_part(self) -> None:
        original = filtering.State.save

        def interrupt(state: filtering.State, seq: int, *args: object) -> None:
            if seq == 2:
                raise KeyboardInterrupt
            original(state, seq, *args)

        with patch.object(filtering.State, "save", interrupt), self.assertRaises(KeyboardInterrupt):
            self.run_filter()
        self.assertTrue((self.output / "events-00003.ndjson").exists())
        report = json.loads((self.output / "report.json").read_text())
        self.assertEqual(report["processed_events"], 5)
        self.assertEqual(report["kept_events"], 1)
        self.assertFalse((self.output / "manifest.json").exists())
        report = self.run_filter(resume=True)
        self.assertEqual((report["processed_events"], report["kept_events"]), (9, 2))
        self.assertEqual((self.output / "events-00003.ndjson").read_bytes(), self.last)

    def test_partial_file_is_recovered_after_write_failure(self) -> None:
        original = filtering.write_part

        def interrupt(output: Path, name: str, payload: bytes) -> dict:
            (output / name.replace(".ndjson", ".partial.ndjson")).write_bytes(payload[:10])
            raise OSError("Synthetic interrupted write")

        with patch.object(filtering, "write_part", interrupt), self.assertRaises(OSError):
            self.run_filter(workers=2)
        with patch.object(filtering, "write_part", wraps=original):
            report = self.run_filter(resume=True, workers=2)
        self.assertEqual(report["kept_events"], 2)
        self.assertFalse(list(self.output.glob("*.partial.ndjson")))

    def test_changed_source_or_manifest_is_rejected_on_resume(self) -> None:
        self.run_filter(count_only=True, max_files=1)
        original = self.manifest.read_bytes()
        self.manifest.write_bytes(original + b" ")
        with self.assertRaisesRegex(ValueError, "manifest.*changed"):
            self.run_filter(count_only=True, resume=True)
        self.manifest.write_bytes(original)
        (self.source / "events-00001.ndjson").write_bytes(self.first)
        with self.assertRaisesRegex(ValueError, "source part changed"):
            self.run_filter(count_only=True, resume=True)

    def test_changed_output_is_not_overwritten_on_resume(self) -> None:
        self.run_filter(max_files=1)
        path = self.output / "events-00001.ndjson"
        path.write_bytes(b"changed")
        with self.assertRaisesRegex(ValueError, "pageviews changed"):
            self.run_filter(resume=True)
        self.assertEqual(path.read_bytes(), b"changed")

    def test_invalid_or_missing_source_parts_never_produce_upload_manifest(self) -> None:
        path = self.source / "events-00001.ndjson"
        path.write_bytes(path.read_bytes() + b" ")
        with self.assertRaisesRegex(ValueError, "checksum changed"):
            self.run_filter()
        self.assertFalse((self.output / "manifest.json").exists())
        path.unlink()
        with self.assertRaises(FileNotFoundError):
            self.run_filter(resume=True)

    def test_matching_checksum_does_not_allow_invalid_events(self) -> None:
        bad = export(self.root / "bad", [[b'{"event":"Page Viewed"}\n']])
        with self.assertRaisesRegex(ValueError, "Invalid event"):
            filtering.run(bad, self.output, reserve_bytes=0)

    def test_destination_must_be_separate_from_source(self) -> None:
        for path in (self.source, self.source / "nested", self.root):
            with self.subTest(path=path), self.assertRaisesRegex(ValueError, "separate"):
                filtering.run(self.manifest, path, reserve_bytes=0)

    def test_source_and_output_locks_prevent_concurrent_access(self) -> None:
        with (self.source / ".conversion.lock").open("a+b") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            with self.assertRaisesRegex(ValueError, "Another process"):
                self.run_filter()
        self.run_filter(max_files=1)
        with (self.output / ".conversion.lock").open("a+b") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            with self.assertRaisesRegex(ValueError, "Another process"):
                self.run_filter(resume=True)

    def test_low_disk_space_stops_before_writing_event_files(self) -> None:
        with patch.object(filtering.DiskGuard, "check", side_effect=OSError("Low disk space")):
            with self.assertRaisesRegex(OSError, "Low disk space"):
                self.run_filter()
        self.assertFalse(list(self.output.glob("events-*")))

    def test_report_write_failure_does_not_hide_the_original_error(self) -> None:
        with patch.object(filtering, "select_part", side_effect=OSError("Original read failure")), \
                patch.object(filtering, "save_report", side_effect=OSError("Report failure")), \
                redirect_stderr(io.StringIO()):
            with self.assertRaisesRegex(OSError, "Original read failure"):
                self.run_filter()

    def test_resume_requires_a_filter_checkpoint(self) -> None:
        self.output.mkdir()
        with self.assertRaisesRegex(ValueError, "No filter checkpoint"):
            self.run_filter(resume=True)

    def test_predicate_requires_the_exact_event_name(self) -> None:
        self.assertTrue(filtering.is_pageview({"event": "Page Viewed"}))
        for value in ({}, {"event": "pageview"}, {"event": "Site Search", "url": "https://example.com"}):
            self.assertFalse(filtering.is_pageview(value))

    def test_site_filter_reconciles_other_site_pageviews_and_survives_resume(self) -> None:
        other = json.loads(event('Page Viewed', 22))
        other['properties']['matomo_site_id'] = '4'
        source = export(self.root / 'mixed', [[self.first, json.dumps(other).encode() + b'\n'], [self.last]])
        report = filtering.run(source, self.output, site_id=8, max_files=1, reserve_bytes=0)
        self.assertEqual((report['kept_events'], report['excluded_events'], report['filtered_pageviews']), (1, 1, 1))
        self.assertEqual(report['excluded_by_type'], {'Page Viewed': 1})
        with self.assertRaisesRegex(ValueError, 'selection changed'):
            filtering.run(source, self.output, site_id=4, resume=True, reserve_bytes=0)
        report = filtering.run(source, self.output, site_id=8, resume=True, workers=2, reserve_bytes=0)
        self.assertEqual(report['kept_events'], 2)
        self.assertEqual(report['site_id'], 8)
        result = Manifest.load(self.output / 'manifest.json')
        self.assertEqual([result.read_part(p) for p in result.parts], [self.first, self.last])

    def test_event_date_filter_uses_inclusive_rome_days(self) -> None:
        lines = []
        for number, stamp in enumerate(('2026-09-30T21:59:59', '2026-09-30T22:00:00',
                                         '2026-10-31T22:59:59', '2026-10-31T23:00:00'), 30):
            item = json.loads(event('Page Viewed', number))
            item['properties']['time'] = int(datetime.fromisoformat(stamp).replace(tzinfo=UTC).timestamp())
            lines.append(json.dumps(item).encode() + b'\n')
        source = export(self.root / 'boundaries', [lines])
        report = filtering.run(source, self.output, site_id=8, start=date(2026, 10, 1),
                               end=date(2026, 10, 31), reserve_bytes=0)
        self.assertEqual((report['kept_events'], report['filtered_pageviews']), (2, 2))
        manifest = Manifest.load(self.output / 'manifest.json')
        self.assertEqual(manifest.read_part(manifest.parts[0]), lines[1] + lines[2])
        with self.assertRaisesRegex(ValueError, 'selection changed'):
            filtering.run(source, self.output, site_id=8, start=date(2026, 10, 2),
                           end=date(2026, 10, 31), resume=True, reserve_bytes=0)

    def test_site_filter_rejects_missing_site_metadata(self) -> None:
        item = json.loads(self.first)
        del item['properties']['matomo_site_id']
        source = export(self.root / 'missing-site', [[json.dumps(item).encode() + b'\n']])
        with self.assertRaisesRegex(ValueError, 'matomo_site_id'):
            filtering.run(source, self.output, site_id=8, reserve_bytes=0)
        self.assertFalse((self.output / 'manifest.json').exists())

    def test_cli_count_and_resume(self) -> None:
        args = [str(self.manifest), "--output-dir", str(self.output), "--count-only", "--min-free-gib", "0"]
        self.assertEqual(filtering.main([*args, "--max-files", "1"]), 0)
        self.assertEqual(filtering.main([*args, "--resume"]), 0)
        self.assertEqual(json.loads((self.output / "report.json").read_text())["processed_events"], 9)

    def test_cli_reports_interruption_and_invalid_options(self) -> None:
        with patch.object(filtering, "run", side_effect=KeyboardInterrupt), redirect_stderr(io.StringIO()):
            self.assertEqual(filtering.main([str(self.manifest)]), 130)
        for args in (["--resume"], ["--min-free-gib", "nan"], ["--min-free-gib", "-1"]):
            with self.subTest(args=args), redirect_stderr(io.StringIO()), self.assertRaises(SystemExit) as error:
                filtering.main([str(self.manifest), *args])
            self.assertEqual(error.exception.code, 2)
        with redirect_stderr(io.StringIO()):
            self.assertEqual(filtering.main([str(self.manifest), "--max-files", "0"]), 1)


    def test_default_run_selects_site8_without_selection_arguments(self) -> None:
        other = json.loads(event('Page Viewed', 22))
        other['properties']['matomo_site_id'] = '4'
        source = export(self.root / 'mixed-defaults', [[self.first, json.dumps(other).encode() + b'\n']])
        report = filtering.run(source, self.output, reserve_bytes=0)
        self.assertEqual(report['site_id'], 8)
        self.assertEqual(report['kept_events'], 1)

    def test_no_arguments_filters_the_prepared_history_of_site8(self) -> None:
        base = self.root / 'default-input'
        parent = base / 'output'
        parent.mkdir(parents=True)
        other = json.loads(event('Page Viewed', 22))
        other['properties']['matomo_site_id'] = '4'
        export(parent / 'site8-history-through-2026-10',
               [[self.first, json.dumps(other).encode() + b'\n', event('Matomo Custom Event', 23)]])
        with patch.object(filtering, 'SCRIPT_DIR', base):
            self.assertEqual(filtering.main([]), 0)
        reports = list(parent.glob('pageviews-export-*/report.json'))
        self.assertEqual(len(reports), 1)
        report = json.loads(reports[0].read_text())
        self.assertEqual(report['site_id'], 8)
        self.assertEqual((report['kept_events'], report['excluded_events']), (1, 2))


if __name__ == "__main__":
    unittest.main()
