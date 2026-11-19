"""Upload a converter manifest to Mixpanel, one part at a time, with --resume."""

import argparse
import base64
import fcntl
import gzip
import hashlib
import json
import math
import os
import random
import re
import sqlite3
import sys
import time
from collections.abc import Iterator, Mapping
from contextlib import closing, contextmanager
from dataclasses import dataclass, field
from datetime import UTC, datetime
from email.message import Message
from email.utils import parsedate_to_datetime
from http.client import HTTPException
from pathlib import Path
from typing import Any, BinaryIO
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import HTTPRedirectHandler, Request, build_opener

# https://docs.mixpanel.com/reference/overview
API_HOSTS = {
    "https://api.mixpanel.com",
    "https://api-eu.mixpanel.com",
    "https://api-in.mixpanel.com",
}
MAX_REQUEST_BYTES = 10_000_000
MAX_RESPONSE_BYTES = 1_000_000
RETRYABLE_STATUSES = {408, 429, 500, 502, 503, 504}


def reject_constant(value: str) -> None:
    raise ValueError("Nonfinite JSON numbers are not supported")


def parse_json(data: bytes) -> Any:
    return json.loads(data.decode("utf-8"), parse_constant=reject_constant)


def is_integer(value: Any) -> bool:
    return isinstance(value, int) and not isinstance(value, bool)


@dataclass(frozen=True)
class Part:
    name: str
    events: int
    size: int
    sha256: str


@dataclass(frozen=True)
class Manifest:
    path: Path
    sha256: str
    status: str
    parts: tuple[Part, ...]
    events: int

    @classmethod
    def load(cls, path: Path) -> "Manifest":
        path = path.resolve(strict=True)
        raw = path.read_bytes()
        try:
            data = parse_json(raw)
        except (ValueError, UnicodeError):
            raise ValueError("Manifest must contain valid UTF-8 JSON") from None
        if not isinstance(data, dict) or data.get("status") not in (
            "completed", "completed_with_errors"
        ):
            raise ValueError("A manifest from a completed conversion is required")
        if not isinstance(data.get("files"), list):
            raise ValueError("Manifest files must be a list")
        parts = []
        names: set[str] = set()
        for item in data["files"]:
            if not isinstance(item, dict):
                raise ValueError("Invalid manifest part")
            name, count, size, digest = (
                item.get(key) for key in ("file", "events", "bytes", "sha256")
            )
            if not isinstance(name, str) or not re.fullmatch(r"events-[0-9]+\.ndjson", name):
                raise ValueError("Manifest parts must be numbered events-*.ndjson files")
            if name in names:
                raise ValueError(f"Duplicate manifest part: {name}")
            if not is_integer(count) or not 1 <= count <= 2000:
                raise ValueError(f"Invalid event count for {name}: expected 1-2000")
            if not is_integer(size) or not 1 <= size <= MAX_REQUEST_BYTES:
                raise ValueError(f"Invalid byte size for {name}: maximum 10 MB")
            if not isinstance(digest, str) or not re.fullmatch(r"[0-9a-f]{64}", digest):
                raise ValueError(f"Invalid SHA-256 for {name}")
            names.add(name)
            parts.append(Part(name, count, size, digest))
        total = data.get("events")
        if not is_integer(total) or total != sum(part.events for part in parts):
            raise ValueError("Manifest total does not match its part event counts")
        return cls(path, hashlib.sha256(raw).hexdigest(), data["status"], tuple(parts), total)

    def read_part(self, part: Part) -> bytes:
        path = self.path.parent / part.name
        if path.is_symlink():
            raise ValueError(f"Symbolic links are not supported: {part.name}")
        with path.open("rb") as stream:
            payload = stream.read(MAX_REQUEST_BYTES + 1)
        if len(payload) != part.size or hashlib.sha256(payload).hexdigest() != part.sha256:
            raise ValueError(f"Part size or checksum changed: {part.name}")
        lines = payload.splitlines()
        if len(lines) != part.events:
            raise ValueError(f"Part event count changed: {part.name}")
        for index, line in enumerate(lines, 1):
            try:
                event = parse_json(line)
                if not isinstance(event, dict) or not isinstance(event.get("event"), str) or not event["event"]:
                    raise ValueError("Missing event name")
                props = event.get("properties")
                if not isinstance(props, dict):
                    raise ValueError("Missing event properties")
                if not is_integer(props.get("time")) or not isinstance(props.get("distinct_id"), str):
                    raise ValueError("Missing or invalid time/distinct_id")
                insert_id = props.get("$insert_id")
                if not isinstance(insert_id, str) or not re.fullmatch(r"[A-Za-z0-9-]{1,36}", insert_id):
                    raise ValueError("Missing or invalid $insert_id")
                if len(line) >= 1_000_000:
                    raise ValueError("Event must be smaller than 1 MB")
            except (ValueError, UnicodeError):
                # JSON parser excerpts can contain source data; keep them out of logs.
                raise ValueError(f"Invalid event in {part.name}, line {index}") from None
        return payload


@dataclass(frozen=True)
class Config:
    host: str
    project_id: str | None
    target: str
    authorization: str = field(repr=False)

    @classmethod
    def from_env(cls, env: Mapping[str, str]) -> "Config":
        host = env.get("MIXPANEL_API_HOST", "https://api-eu.mixpanel.com").rstrip("/")
        if host not in API_HOSTS:
            raise ValueError("MIXPANEL_API_HOST must be an official HTTPS ingestion host")
        token = env.get("MIXPANEL_PROJECT_TOKEN", "")
        username = env.get("MIXPANEL_SERVICE_ACCOUNT_USERNAME", "")
        secret = env.get("MIXPANEL_SERVICE_ACCOUNT_SECRET", "")
        project = env.get("MIXPANEL_PROJECT_ID", "")
        if token and (username or secret or project):
            raise ValueError("Configure either a project token or a service account, not both")
        if token:
            if ":" in token:
                raise ValueError("Invalid project token")
            credentials = f"{token}:"
            target = "token-sha256:" + hashlib.sha256(token.encode()).hexdigest()
        elif username and secret and project:
            if ":" in username or not re.fullmatch(r"[0-9]+", project):
                raise ValueError("Invalid service account username or project ID")
            credentials = f"{username}:{secret}"
            target = "project:" + project
        else:
            raise ValueError(
                "Set MIXPANEL_PROJECT_TOKEN, or MIXPANEL_SERVICE_ACCOUNT_USERNAME, "
                "MIXPANEL_SERVICE_ACCOUNT_SECRET and MIXPANEL_PROJECT_ID"
            )
        authorization = "Basic " + base64.b64encode(credentials.encode()).decode("ascii")
        return cls(host, project or None, target, authorization)

    @property
    def url(self) -> str:
        params = {"strict": "1"}
        if self.project_id:
            params["project_id"] = self.project_id
        return self.host + "/import?" + urlencode(params)


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req: Request, fp: BinaryIO, code: int, msg: str,
                         headers: Message, newurl: str) -> None:
        # Never forward the authorization header to a redirected endpoint.
        return None


@dataclass(frozen=True)
class Response:
    status: int
    body: bytes
    retry_after: str | None = None

    def json(self) -> dict[str, Any]:
        try:
            value = parse_json(self.body)
        except (ValueError, UnicodeError):
            return {}
        return value if isinstance(value, dict) else {}


class Client:
    def __init__(self, config: Config, timeout: float) -> None:
        self.config, self.timeout = config, timeout
        self.opener = build_opener(NoRedirect())

    def post(self, payload: bytes) -> Response:
        request = Request(self.config.url, data=payload, method="POST", headers={
            "Authorization": self.config.authorization,
            "Content-Type": "application/x-ndjson",
            "Content-Encoding": "gzip",
            "Accept": "application/json",
            "User-Agent": "matomo-mixpanel-uploader/1",
        })
        try:
            response = self.opener.open(request, timeout=self.timeout)
        except HTTPError as error:
            response = error
        with response:
            body = response.read(MAX_RESPONSE_BYTES + 1)
            if len(body) > MAX_RESPONSE_BYTES:
                raise ValueError("Mixpanel response exceeded the size limit; file is unconfirmed")
            return Response(response.code, body, response.headers.get("Retry-After"))


@contextmanager
def locked(path: Path, *, create: bool = True) -> Iterator[None]:
    if not create and not path.exists():
        yield
        return
    with path.open("a+b" if create else "rb") as lock:
        try:
            fcntl.flock(lock, (fcntl.LOCK_EX if create else fcntl.LOCK_SH) | fcntl.LOCK_NB)
        except BlockingIOError:
            raise ValueError(f"Another process is using {path.name}") from None
        yield


class State:
    """Commit only one small per-file row for each request and its outcome."""

    def __init__(self, db: sqlite3.Connection, identity: dict[str, Any]) -> None:
        self.db = db
        tables = {row[0] for row in db.execute("SELECT name FROM sqlite_master WHERE type='table'")}
        if tables:
            if tables != {"upload_metadata", "upload_files"}:
                raise ValueError("The state file is not an uploader database")
            row = db.execute("SELECT config FROM upload_metadata WHERE id=1").fetchone()
            if row is None or json.loads(row[0]) != identity:
                raise ValueError("Manifest or destination changed; use the original upload state/configuration")
        else:
            with db:
                db.execute("BEGIN IMMEDIATE")
                db.execute("CREATE TABLE upload_metadata (id INTEGER PRIMARY KEY, config TEXT NOT NULL)")
                db.execute("INSERT INTO upload_metadata VALUES (1, ?)", (json.dumps(identity),))
                db.execute("""CREATE TABLE upload_files (
                    file TEXT PRIMARY KEY, sha256 TEXT NOT NULL, events INTEGER NOT NULL,
                    status TEXT NOT NULL, attempts INTEGER NOT NULL,
                    http_status INTEGER, details TEXT, updated_at TEXT NOT NULL
                )""")

    def confirmed(self, manifest: Manifest) -> set[str]:
        parts = {part.name: part for part in manifest.parts}
        result = set()
        for name, digest, events in self.db.execute(
            "SELECT file, sha256, events FROM upload_files WHERE status='confirmed'"
        ):
            if name not in parts or (parts[name].sha256, parts[name].events) != (digest, events):
                raise ValueError("Confirmed state does not match this manifest")
            result.add(name)
        return result

    def start(self, part: Part) -> None:
        with self.db:
            self.db.execute("""INSERT INTO upload_files
                (file, sha256, events, status, attempts, updated_at)
                VALUES (?, ?, ?, 'pending', 1, ?)
                ON CONFLICT(file) DO UPDATE SET status='pending', attempts=attempts+1,
                    http_status=NULL, details=NULL, updated_at=excluded.updated_at""",
                (part.name, part.sha256, part.events, datetime.now(UTC).isoformat()))

    def finish(self, part: Part, status: str, http_status: int | None,
               details: dict[str, Any]) -> None:
        with self.db:
            self.db.execute("""UPDATE upload_files SET status=?, http_status=?, details=?,
                updated_at=? WHERE file=?""", (status, http_status, json.dumps(details),
                datetime.now(UTC).isoformat(), part.name))


def retry_delay(attempt: int, retry_after: str | None) -> float:
    delay = min(60, 2 ** (attempt + 1)) + random.uniform(1, 5)
    if retry_after:
        try:
            requested = float(retry_after)
        except ValueError:
            try:
                requested = (parsedate_to_datetime(retry_after) - datetime.now(UTC)).total_seconds()
            except (ValueError, TypeError, OverflowError):
                requested = 0
        if math.isfinite(requested):
            delay = max(delay, requested)
    return delay


class UploadError(Exception):
    """A part could not be fully confirmed; earlier confirmations remain durable."""


def send_part(client: Client, state: State, part: Part, payload: bytes,
              max_retries: int) -> None:
    compressed = gzip.compress(payload, mtime=0)
    for attempt in range(max_retries + 1):
        state.start(part)
        retry_after = None
        try:
            response = client.post(compressed)
        except (URLError, OSError, HTTPException):
            reason = "Network error; request outcome may be unknown"
            state.finish(part, "failed", None, {"reason": reason})
            retryable = True
        else:
            data = response.json()
            imported = data.get("num_records_imported")
            if (response.status == 200 and data.get("code") == 200 and
                    data.get("status") == "OK" and is_integer(imported) and
                    imported == part.events and not data.get("failed_records")):
                state.finish(part, "confirmed", 200, {"num_records_imported": imported})
                return
            # Keep validation references, without raw server messages or source payloads.
            details: dict[str, Any] = {}
            if is_integer(imported):
                details["num_records_imported"] = imported
            failed = data.get("failed_records")
            if isinstance(failed, list):
                details["failed_records"] = [
                    {key: record[key] for key in ("index", "field", "$insert_id", "insert_id") if key in record}
                    for record in failed if isinstance(record, dict)
                ]
            status = "partial" if is_integer(imported) and imported > 0 else "failed"
            state.finish(part, status, response.status, details)
            reason = f"HTTP {response.status}; file not fully confirmed"
            if is_integer(imported):
                reason += f" ({imported}/{part.events} records reported imported)"
            retryable = response.status in RETRYABLE_STATUSES
            retry_after = response.retry_after
        if not retryable or attempt == max_retries:
            raise UploadError(f"{part.name}: {reason}. Inspect upload_files in the state database")
        delay = retry_delay(attempt, retry_after)
        print(f"{part.name}: {reason}. Retry {attempt + 1}/{max_retries} in {delay:.1f}s", flush=True)
        time.sleep(delay)


class Progress:
    def __init__(self, manifest: Manifest, confirmed: set[str], label: str) -> None:
        self.total_files, self.total_events = len(manifest.parts), manifest.events
        self.files = len(confirmed)
        self.events = sum(part.events for part in manifest.parts if part.name in confirmed)
        self.initial_events = self.events
        self.label = label
        self.started = self.last = time.monotonic()

    def report(self, *, force: bool = False) -> None:
        now = time.monotonic()
        if not force and now - self.last < 5:
            return
        self.last = now
        advanced = self.events - self.initial_events
        elapsed = max(now - self.started, 0.001)
        eta = f"{int((self.total_events - self.events) * elapsed / advanced)}s" if advanced else "calculating"
        if self.events == self.total_events:
            eta = "0s"
        percent = 100 * self.events / self.total_events if self.total_events else 100
        print(f"{self.label}: {self.files:,}/{self.total_files:,} files | "
              f"{self.events:,}/{self.total_events:,} events ({percent:.1f}%) | "
              f"{advanced / elapsed:,.0f} events/s | Estimated full export remaining: {eta}", flush=True)


def run(manifest_path: Path, *, dry_run: bool = False, resume: bool = False,
        max_files: int | None = None, state_file: Path | None = None,
        timeout: float = 60, max_retries: int = 5,
        environ: Mapping[str, str] | None = None) -> None:
    if max_files is not None and max_files < 1:
        raise ValueError("--max-files must be positive")
    if not math.isfinite(timeout) or timeout <= 0 or not 0 <= max_retries <= 20:
        raise ValueError("Timeout must be positive and finite; retries must be between 0 and 20")
    if dry_run and resume:
        raise ValueError("--dry-run validates files independently of upload state; omit --resume")
    manifest = Manifest.load(manifest_path)
    print(f"Manifest: {len(manifest.parts):,} files, {manifest.events:,} events, "
          f"{sum(part.size for part in manifest.parts):,} uncompressed bytes", flush=True)
    if manifest.status == "completed_with_errors":
        print("Conversion includes rejected source actions. Only accepted manifest events are included.", flush=True)
    with locked(manifest.path.parent / ".conversion.lock", create=False):
        if dry_run:
            print("DRY RUN: validating local files; no HTTP requests or upload state writes.", flush=True)
            progress = Progress(manifest, set(), "Validated")
            for part in manifest.parts[:max_files]:
                manifest.read_part(part)
                progress.files += 1
                progress.events += part.events
                progress.report()
            progress.report(force=True)
            return
        config = Config.from_env(os.environ if environ is None else environ)
        state_file = (state_file or manifest.path.parent / "upload-state.sqlite3").resolve()
        state_file.parent.mkdir(parents=True, exist_ok=True)
        identity = {"version": 1, "manifest_sha256": manifest.sha256,
                    "host": config.host, "target": config.target}
        print(f"Destination: {config.host}; project: {config.project_id or 'project token'}", flush=True)
        print(f"Upload state: {state_file}", flush=True)
        with locked(state_file.with_name(state_file.name + ".lock")):
            if state_file.exists() and not resume:
                raise ValueError("Upload state already exists. Use --resume to skip confirmed files")
            if not state_file.exists() and resume:
                raise ValueError("No upload state found; start without --resume or supply --state-file")
            with closing(sqlite3.connect(state_file)) as db:
                state = State(db, identity)
                confirmed = state.confirmed(manifest)
                progress = Progress(manifest, confirmed, "Confirmed")
                progress.report(force=True)
                client = Client(config, timeout)
                pending = [part for part in manifest.parts if part.name not in confirmed]
                try:
                    for part in pending[:max_files]:
                        payload = manifest.read_part(part)
                        send_part(client, state, part, payload, max_retries)
                        progress.files += 1
                        progress.events += part.events
                        progress.report()
                finally:
                    progress.report(force=True)
                if progress.files == len(manifest.parts):
                    print("Upload complete: all manifest files confirmed.", flush=True)
                else:
                    print("File limit reached. Add --resume to continue pending files.", flush=True)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", type=Path, help="Final converter manifest.json")
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--dry-run", action="store_true", help="Validate local files without HTTP or upload state writes")
    mode.add_argument("--resume", action="store_true", help="Resume existing state, skipping confirmed files")
    parser.add_argument("--max-files", type=int, help="Limit pending uploads (or first files in a dry run)")
    parser.add_argument("--state-file", type=Path, help="Checkpoint path (default: upload-state.sqlite3 beside manifest)")
    parser.add_argument("--timeout", type=float, default=60, help="HTTP timeout in seconds (default: 60)")
    parser.add_argument("--max-retries", type=int, default=5, help="Retries after the first attempt (default: 5)")
    args = parser.parse_args(argv)
    try:
        run(args.manifest, dry_run=args.dry_run, resume=args.resume, max_files=args.max_files,
            state_file=args.state_file, timeout=args.timeout, max_retries=args.max_retries)
    except KeyboardInterrupt:
        print("Interrupted. Run again with --resume; confirmed files will be skipped.", file=sys.stderr)
        return 130
    except (OSError, ValueError, sqlite3.Error, UploadError) as error:
        print(f"Upload stopped: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
