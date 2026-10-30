"""Exercise upload/recovery with synthetic exports and no network access."""

import base64
import fcntl
import gzip
import hashlib
import io
import json
import sqlite3
import tempfile
import unittest
from contextlib import ExitStack, redirect_stderr, redirect_stdout
from datetime import UTC, datetime, timedelta
from email.message import Message
from email.utils import format_datetime
from pathlib import Path
from unittest.mock import Mock, call, patch
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urlsplit

from upload import Client, Config, Manifest, Response, State, UploadError, main, retry_delay, run

TOKEN_ENV = {"MIXPANEL_PROJECT_TOKEN": "synthetic-project-token"}


def response(status: int, imported: int | None = None, **extra: object) -> Response:
    body: dict[str, object] = {"code": status, "status": "OK" if status == 200 else "Error", **extra}
    if imported is not None:
        body["num_records_imported"] = imported
    return Response(status, json.dumps(body).encode())


def accept(payload: bytes) -> Response:
    return response(200, len(gzip.decompress(payload).splitlines()))


def export(root: Path, counts: tuple[int, ...] = (2, 1)) -> Path:
    parts = []
    index = 0
    for number, count in enumerate(counts, 1):
        events = []
        for _ in range(count):
            index += 1
            events.append({"event": "Page Viewed", "properties": {
                "time": 1_700_000_000 + index, "distinct_id": "synthetic-visitor",
                "$insert_id": f"{index:032x}", "ip": 0, "source": "matomo",
            }})
        payload = b"".join(json.dumps(event).encode() + b"\n" for event in events)
        name = f"events-{number:05d}.ndjson"
        (root / name).write_bytes(payload)
        parts.append({"file": name, "events": count, "bytes": len(payload),
                      "sha256": hashlib.sha256(payload).hexdigest()})
    manifest = root / "manifest.json"
    manifest.write_text(json.dumps({"status": "completed", "events": sum(counts), "files": parts}))
    return manifest


class UploadTests(unittest.TestCase):
    def setUp(self) -> None:
        stack = self.enterContext(ExitStack())
        self.root = Path(stack.enter_context(tempfile.TemporaryDirectory()))
        self.manifest = export(self.root)
        self.state_path = self.root / "upload-state.sqlite3"
        self.stdout, self.stderr = io.StringIO(), io.StringIO()
        stack.enter_context(redirect_stdout(self.stdout))
        stack.enter_context(redirect_stderr(self.stderr))
        # Unexpected network calls fail even if a test forgets to mock Client.post.
        stack.enter_context(patch("socket.socket.connect", side_effect=AssertionError("Network is forbidden in tests")))
        self.post = stack.enter_context(patch.object(Client, "post", side_effect=accept))
        self.sleep = stack.enter_context(patch("upload.time.sleep"))
        stack.enter_context(patch("upload.random.uniform", return_value=1))

    def upload(self, **options: object) -> None:
        options.setdefault("environ", TOKEN_ENV)
        run(self.manifest, **options)

    def rows(self, path: Path | None = None) -> list[tuple]:
        with sqlite3.connect(path or self.state_path) as db:
            return db.execute("SELECT file, status, attempts, http_status, details FROM upload_files ORDER BY file").fetchall()

    def test_limited_upload_resumes_only_remaining_parts(self) -> None:
        self.upload(max_files=1)
        first_payload = self.post.call_args.args[0]
        self.assertEqual(gzip.decompress(first_payload), (self.root / "events-00001.ndjson").read_bytes())
        self.assertEqual(self.rows()[0][1:4], ("confirmed", 1, 200))
        self.post.reset_mock()
        self.upload(resume=True)
        self.post.assert_called_once()
        self.assertEqual(gzip.decompress(self.post.call_args.args[0]), (self.root / "events-00002.ndjson").read_bytes())
        self.assertEqual([row[1] for row in self.rows()], ["confirmed", "confirmed"])
        self.assertIn("3/3 events (100.0%)", self.stdout.getvalue())

    def test_completed_resume_performs_no_uploads(self) -> None:
        self.upload()
        self.post.reset_mock()
        self.upload(resume=True)
        self.post.assert_not_called()

    def test_existing_state_requires_resume(self) -> None:
        self.upload(max_files=1)
        self.post.reset_mock()
        with self.assertRaisesRegex(ValueError, "Use --resume"):
            self.upload()
        self.post.assert_not_called()

    def test_missing_resume_state_is_rejected(self) -> None:
        with self.assertRaisesRegex(ValueError, "No upload state"):
            self.upload(resume=True)
        self.post.assert_not_called()
        self.assertFalse(self.state_path.exists())

    def test_retryable_failure_keeps_previous_confirmations(self) -> None:
        self.post.side_effect = [response(200, 2), response(503)]
        with self.assertRaises(UploadError):
            self.upload(max_retries=0)
        self.assertEqual([row[1] for row in self.rows()], ["confirmed", "failed"])
        self.post.reset_mock(side_effect=True)
        self.post.side_effect = accept
        self.upload(resume=True)
        self.post.assert_called_once()
        self.assertEqual([row[2] for row in self.rows()], [1, 2])

    def test_interruption_after_remote_success_replays_only_unconfirmed_part(self) -> None:
        original = State.finish

        def fail_checkpoint(state: State, part: object, status: str,
                            http_status: int | None, details: dict) -> None:
            if part.name == "events-00002.ndjson" and status == "confirmed":
                raise OSError("simulated checkpoint write failure")
            original(state, part, status, http_status, details)

        with patch.object(State, "finish", fail_checkpoint), self.assertRaises(OSError):
            self.upload()
        last_payload = self.post.call_args.args[0]
        self.assertEqual([row[1] for row in self.rows()], ["confirmed", "pending"])
        self.post.reset_mock()
        self.upload(resume=True)
        self.post.assert_called_once_with(last_payload)

    def test_keyboard_interrupt_is_reported_and_can_resume(self) -> None:
        self.post.side_effect = [response(200, 2), KeyboardInterrupt()]
        with patch.dict("os.environ", TOKEN_ENV, clear=True):
            self.assertEqual(main([str(self.manifest)]), 130)
        self.assertIn("--resume", self.stderr.getvalue())
        self.post.reset_mock(side_effect=True)
        self.post.side_effect = accept
        self.upload(resume=True)
        self.post.assert_called_once()

    def test_partial_validation_failure_is_saved_without_retry_or_skip(self) -> None:
        self.post.side_effect = None
        self.post.return_value = response(400, 1, failed_records=[{
            "index": 1, "$insert_id": "synthetic-id", "field": "properties.time",
            "message": "source data must not be copied into logs",
        }])
        with self.assertRaises(UploadError):
            self.upload()
        self.post.assert_called_once()
        self.sleep.assert_not_called()
        row = self.rows()[0]
        self.assertEqual(row[1:4], ("partial", 1, 400))
        self.assertEqual(json.loads(row[4])["num_records_imported"], 1)
        self.assertEqual(json.loads(row[4])["failed_records"][0]["index"], 1)
        self.assertNotIn("source data", row[4] + self.stdout.getvalue())
        self.post.reset_mock(side_effect=True)
        self.post.side_effect = accept
        self.upload(resume=True)
        self.assertEqual(self.post.call_count, 2)

    def test_incoherent_success_responses_are_never_confirmed(self) -> None:
        cases = [Response(200, b"not JSON"), response(200, 1), response(200),
                 response(200, 2, failed_records=[{"index": 0}]),
                 Response(200, b'{"code":200,"status":"OK","num_records_imported":true}')]
        self.post.side_effect = None
        for index, reply in enumerate(cases):
            with self.subTest(reply=reply):
                self.post.reset_mock()
                self.post.return_value = reply
                state = self.root / f"incoherent-{index}.sqlite3"
                with self.assertRaises(UploadError):
                    self.upload(state_file=state)
                self.post.assert_called_once()
                self.assertNotEqual(self.rows(state)[0][1], "confirmed")
        self.sleep.assert_not_called()

    def test_rate_limit_and_server_errors_back_off_then_confirm(self) -> None:
        self.post.side_effect = [Response(429, b"{}", "17"), response(502), response(200, 2)]
        self.upload(max_files=1)
        self.assertEqual(self.post.call_count, 3)
        self.assertEqual(self.sleep.call_args_list, [call(17), call(5)])
        self.assertEqual(self.rows()[0][1:4], ("confirmed", 3, 200))
        self.assertEqual(len({args.args[0] for args in self.post.call_args_list}), 1)

    def test_network_errors_are_retried_without_logging_exception_contents(self) -> None:
        self.post.side_effect = [URLError("sensitive diagnostic"), TimeoutError(), response(200, 2)]
        self.upload(max_files=1)
        self.assertEqual(self.post.call_count, 3)
        self.assertNotIn("sensitive diagnostic", self.stdout.getvalue())

    def test_retries_are_bounded(self) -> None:
        self.post.side_effect = TimeoutError()
        with self.assertRaises(UploadError):
            self.upload(max_retries=2)
        self.assertEqual(self.post.call_count, 3)
        self.assertEqual(self.sleep.call_count, 2)
        self.assertEqual(self.rows()[0][1:3], ("failed", 3))

    def test_permanent_http_errors_do_not_retry(self) -> None:
        self.post.side_effect = None
        for status in (301, 400, 401, 403, 413):
            with self.subTest(status=status):
                self.post.reset_mock()
                self.post.return_value = response(status)
                with self.assertRaises(UploadError):
                    self.upload(state_file=self.root / f"error-{status}.sqlite3")
                self.post.assert_called_once()
        self.sleep.assert_not_called()

    def test_resume_rejects_different_destinations(self) -> None:
        self.upload(max_files=1)
        self.post.reset_mock()
        for env in ({"MIXPANEL_PROJECT_TOKEN": "another-test-project"},
                    {**TOKEN_ENV, "MIXPANEL_API_HOST": "https://api.mixpanel.com"}):
            with self.subTest(env=env), self.assertRaisesRegex(ValueError, "destination changed"):
                self.upload(resume=True, environ=env)
        self.post.assert_not_called()

    def test_resume_rejects_a_changed_manifest(self) -> None:
        self.upload(max_files=1)
        self.post.reset_mock()
        self.manifest.write_text(self.manifest.read_text() + "\n")
        with self.assertRaisesRegex(ValueError, "Manifest or destination changed"):
            self.upload(resume=True)
        self.post.assert_not_called()

    def test_dry_run_needs_no_credentials_and_does_not_write_state(self) -> None:
        before = set(self.root.iterdir())
        self.upload(dry_run=True, max_files=1, environ={})
        self.post.assert_not_called()
        self.assertEqual(set(self.root.iterdir()), before)
        self.assertIn("Validated: 1/2 files", self.stdout.getvalue())

    def test_completed_conversion_with_rejections_can_be_validated(self) -> None:
        data = json.loads(self.manifest.read_text())
        data["status"] = "completed_with_errors"
        self.manifest.write_text(json.dumps(data))
        self.upload(dry_run=True)
        self.assertIn("rejected source actions", self.stdout.getvalue())

    def test_changed_missing_and_invalid_parts_are_not_sent(self) -> None:
        part = self.root / "events-00001.ndjson"
        part.write_bytes(part.read_bytes() + b" ")
        with self.assertRaisesRegex(ValueError, "checksum changed"):
            self.upload()
        part.unlink()
        with self.assertRaises(FileNotFoundError):
            self.upload(resume=True)
        self.post.assert_not_called()
        self.assertEqual(self.rows(), [])

    def test_state_lock_prevents_concurrent_upload(self) -> None:
        with (self.root / "upload-state.sqlite3.lock").open("a") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            with self.assertRaisesRegex(ValueError, "Another process"):
                self.upload()
        self.post.assert_not_called()

    def test_active_converter_prevents_upload_and_validation(self) -> None:
        with (self.root / ".conversion.lock").open("a") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            for dry_run in (True, False):
                with self.assertRaisesRegex(ValueError, "Another process"):
                    self.upload(dry_run=dry_run)
        self.post.assert_not_called()

    def test_existing_conversion_database_is_never_modified(self) -> None:
        with sqlite3.connect(self.state_path) as db:
            db.execute("CREATE TABLE source_data (id INTEGER)")
        before = self.state_path.read_bytes()
        with self.assertRaisesRegex(ValueError, "not an uploader database"):
            self.upload(resume=True)
        self.assertEqual(self.state_path.read_bytes(), before)
        self.post.assert_not_called()

    def test_credentials_are_not_saved_to_state_or_printed(self) -> None:
        self.upload()
        content = self.state_path.read_bytes() + self.stdout.getvalue().encode()
        self.assertNotIn(TOKEN_ENV["MIXPANEL_PROJECT_TOKEN"].encode(), content)
        self.assertNotIn(Config.from_env(TOKEN_ENV).authorization.encode(), content)

    def test_invalid_options_and_missing_credentials_do_not_send(self) -> None:
        for options in ({"timeout": float("nan")}, {"timeout": 0}, {"max_retries": -1},
                        {"max_files": 0}, {"resume": True, "dry_run": True}, {"environ": {}}):
            with self.subTest(options=options), self.assertRaises(ValueError):
                self.upload(**options)
        self.post.assert_not_called()
        self.assertFalse(self.state_path.exists())


class InputTests(unittest.TestCase):
    def test_invalid_manifest_entries_and_totals(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            manifest = export(Path(directory))
            original = json.loads(manifest.read_text())
            cases = [{**original, "status": "running"}, {**original, "events": 99},
                     {**original, "files": original["files"] * 2}, {**original, "files": None}]
            for change in ({"file": "issues.ndjson"}, {"file": "../events-00001.ndjson"},
                           {"file": "events-00001.partial.ndjson"}, {"events": 2001},
                           {"events": True}, {"bytes": 10_000_001}, {"sha256": "invalid"}):
                cases.append({**original, "files": [{**original["files"][0], **change}]})
            for data in cases:
                with self.subTest(data=data):
                    manifest.write_text(json.dumps(data))
                    with self.assertRaises(ValueError):
                        Manifest.load(manifest)

    def test_invalid_events_are_detected_even_with_matching_checksums(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            manifest = export(root, (1,))
            source = json.loads((root / "events-00001.ndjson").read_bytes())
            payloads = [b"not JSON\n", b"{}\n", b'{"event":"test","properties":{}}\n',
                        json.dumps({**source, "properties": {**source["properties"], "$insert_id": ""}}).encode(),
                        json.dumps({**source, "properties": {**source["properties"], "time": float("nan")}}).encode()]
            for payload in payloads:
                with self.subTest(payload=payload):
                    data = json.loads(manifest.read_text())
                    data["files"][0].update(bytes=len(payload), sha256=hashlib.sha256(payload).hexdigest())
                    manifest.write_text(json.dumps(data))
                    (root / "events-00001.ndjson").write_bytes(payload)
                    loaded = Manifest.load(manifest)
                    with self.assertRaisesRegex(ValueError, "Invalid event"):
                        loaded.read_part(loaded.parts[0])


class ConfigTests(unittest.TestCase):
    def test_token_auth_uses_eu_host_basic_auth_and_no_project_id(self) -> None:
        config = Config.from_env(TOKEN_ENV)
        self.assertEqual(config.host, "https://api-eu.mixpanel.com")
        self.assertEqual(base64.b64decode(config.authorization.removeprefix("Basic ")).decode(),
                         TOKEN_ENV["MIXPANEL_PROJECT_TOKEN"] + ":")
        self.assertEqual(parse_qs(urlsplit(config.url).query), {"strict": ["1"]})
        self.assertNotIn(TOKEN_ENV["MIXPANEL_PROJECT_TOKEN"], repr(config))

    def test_service_account_auth_includes_project_and_survives_secret_rotation(self) -> None:
        env = {"MIXPANEL_SERVICE_ACCOUNT_USERNAME": "synthetic-account",
               "MIXPANEL_SERVICE_ACCOUNT_SECRET": "synthetic-secret", "MIXPANEL_PROJECT_ID": "12345"}
        config = Config.from_env(env)
        self.assertEqual(base64.b64decode(config.authorization.removeprefix("Basic ")).decode(),
                         "synthetic-account:synthetic-secret")
        self.assertEqual(parse_qs(urlsplit(config.url).query), {"strict": ["1"], "project_id": ["12345"]})
        self.assertEqual(config.target, Config.from_env({**env, "MIXPANEL_SERVICE_ACCOUNT_SECRET": "rotated"}).target)

    def test_ambiguous_incomplete_or_unsafe_configuration_is_rejected(self) -> None:
        cases = [{}, {**TOKEN_ENV, "MIXPANEL_PROJECT_ID": "12345"},
                 {"MIXPANEL_SERVICE_ACCOUNT_USERNAME": "synthetic-account"}]
        for host in ("http://api-eu.mixpanel.com", "https://example.com", "https://api-eu.mixpanel.com/import"):
            cases.append({**TOKEN_ENV, "MIXPANEL_API_HOST": host})
        for env in cases:
            with self.subTest(env=env), self.assertRaises(ValueError):
                Config.from_env(env)


class HttpBody(io.BytesIO):
    def __init__(self, code: int, body: bytes) -> None:
        super().__init__(body)
        self.code = code
        self.headers = Message()


class ClientTests(unittest.TestCase):
    def test_request_headers_body_and_timeout(self) -> None:
        opener = Mock()
        opener.open.return_value = HttpBody(200, b'{"status":"OK"}')
        config = Config.from_env(TOKEN_ENV)
        with patch("upload.build_opener", return_value=opener):
            payload = gzip.compress(b'{"synthetic":true}\n', mtime=0)
            reply = Client(config, 12).post(payload)
        request = opener.open.call_args.args[0]
        self.assertEqual(opener.open.call_args.kwargs, {"timeout": 12})
        self.assertEqual(request.full_url, "https://api-eu.mixpanel.com/import?strict=1")
        self.assertEqual(request.get_header("Authorization"), config.authorization)
        self.assertEqual(request.get_header("Content-type"), "application/x-ndjson")
        self.assertEqual(request.get_header("Content-encoding"), "gzip")
        self.assertEqual(request.data, payload)
        self.assertEqual(request.get_method(), "POST")
        self.assertEqual(reply.status, 200)

    def test_http_errors_preserve_status_and_retry_after(self) -> None:
        opener = Mock()
        headers = Message()
        headers["Retry-After"] = "20"
        opener.open.side_effect = HTTPError("https://api-eu.mixpanel.com/import", 429,
                                           "Too Many Requests", headers, io.BytesIO(b"{}"))
        with patch("upload.build_opener", return_value=opener):
            reply = Client(Config.from_env(TOKEN_ENV), 12).post(b"compressed-test-data")
        self.assertEqual((reply.status, reply.retry_after, reply.body), (429, "20", b"{}"))

    def test_oversized_responses_are_not_accepted(self) -> None:
        opener = Mock()
        opener.open.return_value = HttpBody(200, b"x" * 1_000_001)
        with patch("upload.build_opener", return_value=opener):
            with self.assertRaisesRegex(ValueError, "size limit"):
                Client(Config.from_env(TOKEN_ENV), 12).post(b"test-data")

    def test_retry_after_supports_dates_and_invalid_values(self) -> None:
        now = datetime(2026, 1, 1, tzinfo=UTC)
        with patch("upload.datetime") as clock, patch("upload.random.uniform", return_value=1):
            clock.now.return_value = now
            self.assertEqual(retry_delay(0, format_datetime(now + timedelta(seconds=30))), 30)
            for value in ("invalid", "NaN", "Infinity", "-1"):
                self.assertEqual(retry_delay(0, value), 3)


if __name__ == "__main__":
    unittest.main()
