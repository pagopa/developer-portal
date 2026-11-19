"""Convert an uncompressed Matomo SQL dump to Mixpanel NDJSON locally."""

import argparse
import json
import math
import sys
from collections.abc import Callable
from datetime import UTC, date, datetime
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit, urlunsplit
from uuid import NAMESPACE_URL, uuid5
from zoneinfo import ZoneInfo

ROME = ZoneInfo("Europe/Rome")
SCRIPT_DIR = Path(__file__).resolve().parent
VISIT_BOUND_TOLERANCE_SECONDS = 5
EVENT_NAMES = {
    "action": "Page Viewed",
    "download": "File Downloaded",
    "outlink": "Outbound Link Clicked",
    "event": "Matomo Custom Event",
    "crash": "Application Crash",
    "media": "Media Interaction",
    "search": "Site Search",
}
VISIT_FIELDS = {
    "visitorType": "visitor_type",
    "deviceType": "device_type",
    "deviceBrand": "device_brand",
    "deviceModel": "device_model",
    "operatingSystemName": "os_name",
    "operatingSystemVersion": "os_version",
    "browserName": "browser_name",
    "browserVersion": "browser_version",
    "languageCode": "language",
    "resolution": "resolution",
    "referrerType": "referrer_type",
    "referrerName": "referrer_name",
    "countryCode": "country_code",
    "region": "region",
    "city": "city",
    "visitIp": "matomo_visit_ip",
    "fingerprint": "matomo_fingerprint",
    "campaignId": "campaign_id",
    "campaignName": "campaign_name",
    "campaignSource": "campaign_source",
    "campaignMedium": "campaign_medium",
    "campaignKeyword": "campaign_keyword",
    "campaignContent": "campaign_content",
    "campaignGroup": "campaign_group",
    "campaignPlacement": "campaign_placement",
}
INVALID_IDS = {
    "", "0", "-1", "anon", "anonymous", "nil", "none", "null", "n/a",
    "na", "undefined", "unknown", "<nil>", "true", "false", "[]", "{}",
    "00000000-0000-0000-0000-000000000000",
}


def number(value: Any, field: str, *, integer: bool = False) -> int | float:
    if isinstance(value, bool) or not isinstance(value, (str, int, float)):
        raise ValueError(f"{field}: expected a number")
    try:
        result = float(value)
    except ValueError:
        raise ValueError(f"{field}: expected a number") from None
    if not math.isfinite(result) or (integer and not result.is_integer()):
        raise ValueError(f"{field}: invalid numeric value")
    return int(result) if integer else result


def coordinate(value: Any, field: str, limit: int) -> int | float:
    result = number(value, field)
    if not -limit <= result <= limit:
        raise ValueError(f"{field}: outside coordinate range")
    return result


def identifier(value: Any, field: str) -> str:
    if isinstance(value, bool) or not isinstance(value, (str, int)):
        raise ValueError(f"{field}: missing or invalid identifier")
    result = str(value).strip()
    if result.lower() in INVALID_IDS or len(result.encode("utf-8")) > 255:
        raise ValueError(f"{field}: missing or invalid identifier")
    return result


def action_time(
    action: dict[str, Any], visit: dict[str, Any],
    warnings: list[dict[str, str]] | None = None,
) -> int:
    raw = number(action.get("timestamp"), "timestamp", integer=True)
    start = number(visit.get("firstActionTimestamp"), "firstActionTimestamp", integer=True)
    end = number(visit.get("lastActionTimestamp"), "lastActionTimestamp", integer=True)
    try:
        # Matomo encodes Rome wall-clock time as epoch seconds in this export.
        local = datetime.fromtimestamp(raw, UTC).replace(tzinfo=None)
        candidates = set()
        for fold in (0, 1):
            utc = local.replace(tzinfo=ROME, fold=fold).astimezone(UTC)
            stamp = int(utc.timestamp())
            if (utc.astimezone(ROME).replace(tzinfo=None) == local
                    and start - VISIT_BOUND_TOLERANCE_SECONDS <= stamp <= end + VISIT_BOUND_TOLERANCE_SECONDS):
                candidates.add(stamp)
    except (OverflowError, OSError, ValueError):
        raise ValueError("timestamp: outside supported date range") from None
    # Visit bounds can resolve the repeated autumn hour; never guess otherwise.
    if len(candidates) != 1:
        raise ValueError("timestamp: ambiguous, nonexistent, or outside visit bounds")
    result = candidates.pop()
    if result < 31536000 or result > int(datetime.now(UTC).timestamp()):
        raise ValueError("timestamp: before 1971 or in the future")
    if warnings is not None and not start <= result <= end:
        distance = start - result if result < start else result - end
        warnings.append({
            "field": "timestamp",
            "property": "time",
            "reason": (
                f"timestamp: {distance} seconds outside visit bounds; "
                f"accepted within {VISIT_BOUND_TOLERANCE_SECONDS}-second tolerance"
            ),
        })
    return result


def clean_url(value: Any, *, referrer: bool = False) -> str:
    if not isinstance(value, str):
        raise ValueError("url: expected a string")
    try:
        parts = urlsplit(value)
        schemes = {"http", "https", "android-app"} if referrer else {"http", "https"}
        if parts.scheme not in schemes or not parts.hostname:
            raise ValueError()
        host = parts.hostname
        if ":" in host:
            host = f"[{host}]"
        if parts.port is not None:
            host += f":{parts.port}"
        return urlunsplit((parts.scheme, host, parts.path, parts.query, parts.fragment))
    except ValueError:
        raise ValueError("url: invalid or unsupported absolute URL") from None


def action_identifier(action: dict[str, Any], kind: str) -> str:
    if kind == "crash":
        return f"crashEventId:{identifier(action.get('crashEventId'), 'crashEventId')}"
    if kind != "media":
        return f"pageId:{identifier(action.get('pageId'), 'pageId')}"
    timestamp = identifier(action.get("timestamp"), "timestamp")
    pageview = action.get("idpageview")
    url = action.get("url")
    return f"derived:{uuid5(NAMESPACE_URL, f'{kind}:{timestamp}:{pageview or ""}:{url or ""}')}"


def optional_property(
    properties: dict[str, Any], warnings: list[dict[str, str]],
    value: Any, source: str, target: str,
    converter: Callable[[Any], Any] | None = None,
) -> None:
    if value is None or value == "":
        return
    try:
        if converter is None:
            if not isinstance(value, str):
                raise ValueError("expected a string")
        else:
            value = converter(value)
        if isinstance(value, str) and len(value.encode("utf-8")) > 255:
            raise ValueError("exceeds 255 UTF-8 bytes")
        properties[target] = value
    except (ValueError, OverflowError) as error:
        # Optional metadata must not discard an otherwise valid event.
        warnings.append({"field": source, "property": target, "reason": str(error)})


def convert_action(
    visit: dict[str, Any], action: dict[str, Any],
    warnings: list[dict[str, str]] | None = None,
) -> dict[str, Any]:
    if warnings is None:
        warnings = []
    kind = action.get("type")
    if not isinstance(kind, str) or kind not in EVENT_NAMES:
        raise ValueError("type: unsupported action type")
    site = identifier(visit.get("idSite"), "idSite")
    session = identifier(visit.get("idVisit"), "idVisit")
    action_id = action_identifier(action, kind)
    properties: dict[str, Any] = {
        "time": action_time(action, visit, warnings),
        "distinct_id": identifier(visit.get("visitorId"), "visitorId"),
        # A stable UUID fits Mixpanel's 36-byte limit and survives reruns.
        "$insert_id": str(uuid5(NAMESPACE_URL, f"matomo/{site}/{session}/{action_id}")),
        # Keep Matomo location data; do not infer location from the upload IP.
        "ip": 0,
        "source": "matomo",
        "mapping_version": "2",
        "matomo_site_id": site,
        "matomo_visit_id": session,
        "matomo_action_id": action_id,
        "matomo_action_type": kind,
    }
    for source, target in VISIT_FIELDS.items():
        optional_property(properties, warnings, visit.get(source), source, target)
    for source, target in {
        "idpageview": "matomo_pageview_id",
        "pageTitle": "page_title",
        "eventCategory": "matomo_event_category",
        "eventAction": "matomo_event_action",
        "eventName": "matomo_event_name",
        "crashType": "crash_type",
        "message": "crash_message",
        "category": "crash_category",
        "stackTrace": "crash_stack_trace",
        "resourceUri": "crash_resource_uri",
        "media_title": "media_title",
        "media_type": "media_type",
        "player_name": "media_player_name",
        "siteSearchKeyword": "search_keyword",
        "siteSearchCategory": "search_category",
    }.items():
        optional_property(properties, warnings, action.get(source), source, target)
    for record, source, target, integer in (
        (visit, "visitCount", "visit_count", True),
        (action, "pageviewPosition", "pageview_position", True),
        (action, "timeSpent", "time_spent_seconds", False),
        (action, "pageLoadTimeMilliseconds", "page_load_time_ms", False),
        (action, "eventValue", "matomo_event_value", False),
        (action, "crashId", "crash_id", True),
        (action, "resourceLine", "crash_resource_line", True),
        (action, "resourceColumn", "crash_resource_column", True),
        (action, "fullscreen", "media_fullscreen", True),
        (action, "time_to_initial_play", "media_time_to_initial_play_ms", False),
        (action, "watched_time", "media_watched_time_seconds", False),
        (action, "media_progress", "media_progress_seconds", False),
        (action, "media_length", "media_length_seconds", False),
        (action, "siteSearchCount", "search_result_count", True),
    ):
        optional_property(properties, warnings, record.get(source), source, target,
                          lambda value: number(value, source, integer=integer))
    for record, source, target in (
        (action, "url", "url"), (visit, "referrerUrl", "referrer_url")
    ):
        optional_property(properties, warnings, record.get(source), source, target,
                          lambda value: clean_url(value, referrer=source == "referrerUrl"))
    for source, limit in (("latitude", 90), ("longitude", 180)):
        optional_property(properties, warnings, visit.get(source), source, source,
                          lambda value: coordinate(value, source, limit))
    return {"event": EVENT_NAMES[kind], "properties": properties}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, nargs="?", default=SCRIPT_DIR / "input",
                        help="SQL dump or directory containing SQL dumps (default: input folder)")
    parser.add_argument("--output-dir", type=Path, help="New output directory (default: timestamped run in output)")
    parser.add_argument("--site-id", type=int, help="Optional site filter (default: all sites)")
    parser.add_argument("--from-date", type=date.fromisoformat, help="First Rome calendar date, YYYY-MM-DD")
    parser.add_argument("--to-date", type=date.fromisoformat, help="Last Rome calendar date, YYYY-MM-DD")
    parser.add_argument("--table-prefix", default=None, help="Table prefix, for example matomo_")
    parser.add_argument("--include-unplayed-media", action="store_true",
                        help="Emit zero-watched-time rows as Media Observed")
    parser.add_argument("--resume", action="store_true", help="Resume the specified output directory")
    parser.add_argument("--part-events", type=int, default=2000)
    parser.add_argument("--part-mib", type=int, default=8)
    parser.add_argument("--min-free-gib", type=float, default=2)
    parser.add_argument("--host-volume", type=Path)
    args = parser.parse_args()
    if args.resume and args.output_dir is None:
        parser.error("--resume requires --output-dir")
    if args.resume and not args.output_dir.is_dir():
        parser.error("The output directory to resume does not exist")
    sql_files = sorted(path for path in args.input.rglob('*')
                       if path.is_file() and path.suffix.lower() == '.sql') if args.input.is_dir() else (
                           [args.input] if args.input.suffix.lower() == '.sql' else [])
    if not sql_files:
        parser.error("Input must be an uncompressed .sql dump or a directory containing .sql dumps")
    if args.site_id is not None and args.site_id <= 0:
        parser.error("--site-id must be positive")
    if args.to_date is not None and args.from_date is not None and args.to_date < args.from_date:
        parser.error("--to-date must not precede --from-date")

    # The reader is separate because it contains the SQL parser and table joins.
    from from_sql import main as sql_main

    sql_args = ["--part-events", str(args.part_events), "--part-mib", str(args.part_mib),
                "--min-free-gib", str(args.min_free_gib)]
    if args.host_volume is not None:
        sql_args.extend(["--host-volume", str(args.host_volume)])
    for flag, value in {"--site-id": args.site_id, "--from-date": args.from_date,
                        "--to-date": args.to_date}.items():
        if value is not None:
            sql_args.extend([flag, str(value)])
    if args.table_prefix is not None:
        sql_args.extend(["--table-prefix", args.table_prefix])
    if args.include_unplayed_media:
        sql_args.append("--include-unplayed-media")
    if not args.input.is_dir():
        if args.resume:
            sql_args.append("--resume")
        if args.output_dir is not None:
            sql_args.extend(["--output-dir", str(args.output_dir)])
        return sql_main([str(args.input), *sql_args])

    print(f"Found {len(sql_files)} SQL dump(s).")
    print("Unspecified site/date filters include all sites and dates in the dump.")
    output = args.output_dir or SCRIPT_DIR / 'output' / datetime.now(UTC).strftime('sql-%Y%m%dT%H%M%S-%fZ')
    try:
        if output.resolve().is_relative_to(args.input.resolve()):
            raise ValueError('Output directory must be outside the input directory')
        output.mkdir(parents=True, exist_ok=args.resume)
        results = []
        for source in sql_files:
            relative = source.relative_to(args.input)
            destination = output / 'files' / relative
            resume_args = ['--resume'] if args.resume and destination.exists() else []
            code = sql_main([str(source), *sql_args, *resume_args, '--output-dir', str(destination)])
            results.append({'file': relative.as_posix(), 'exit_code': code,
                            'report': (destination / 'report.json').relative_to(output).as_posix()})
            if code:
                break
        (output / 'summary.json').write_text(json.dumps({'format': 'sql', 'results': results}, indent=2) + '\n')
    except (OSError, ValueError) as error:
        print(f'Conversion failed: {error}', file=sys.stderr)
        return 1
    print(f'Run index: {output / "summary.json"}')
    return int(any(result['exit_code'] for result in results))


if __name__ == "__main__":
    sys.exit(main())
