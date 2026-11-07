import unittest
from datetime import UTC, datetime

from main import action_time, clean_url, convert_action


def epoch(value: str) -> int:
    return int(datetime.fromisoformat(value).replace(tzinfo=UTC).timestamp())


def sample() -> tuple[dict, dict]:
    visit = {
        "idSite": 8, "idVisit": 42, "visitorId": "visitor123",
        "firstActionTimestamp": epoch("2026-06-07T12:00:00"),
        "lastActionTimestamp": epoch("2026-06-07T12:00:00"),
        "browserVersion": "148.0", "visitCount": "2", "city": "Rome",
        "fingerprint": "source-fingerprint", "visitIp": "192.0.0.0",
    }
    action = {
        "type": "action", "pageId": 100,
        "timestamp": epoch("2026-06-07T14:00:00"),
        "url": "https://example.com/page?secret=value#fragment",
        "pageTitle": None, "timeSpent": "0",
    }
    return visit, action


class MappingTests(unittest.TestCase):
    def test_types_missing_values_and_selected_fields(self) -> None:
        visit, action = sample()
        event = convert_action(visit, action)
        props = event["properties"]
        self.assertEqual(event["event"], "Page Viewed")
        self.assertEqual(props["time"], visit["firstActionTimestamp"])
        self.assertEqual(props["url"], action["url"])
        self.assertEqual(props["city"], "Rome")
        self.assertEqual(props["matomo_visit_ip"], "192.0.0.0")
        self.assertEqual(props["matomo_fingerprint"], "source-fingerprint")
        self.assertEqual(props["mapping_version"], "2")
        self.assertEqual(props["browser_version"], "148.0")
        self.assertEqual(props["visit_count"], 2)
        self.assertEqual(props["time_spent_seconds"], 0)
        self.assertEqual(props["ip"], 0)
        for field in ("page_title", "fingerprint", "visitIp"):
            self.assertNotIn(field, props)

    def test_source_location_and_crash_details(self) -> None:
        visit, action = sample()
        visit.update(latitude="0", longitude="16.87")
        action.update(type="crash", crashEventId=42, stackTrace="at load (app.js:1)",
                      resourceUri="webpack:///app.js?version=1#L1")
        props = convert_action(visit, action)["properties"]
        self.assertEqual(props["latitude"], 0)
        self.assertEqual(props["longitude"], 16.87)
        self.assertEqual(props["crash_stack_trace"], action["stackTrace"])
        self.assertEqual(props["crash_resource_uri"], action["resourceUri"])

    def test_invalid_coordinates_warn_without_rejecting_action(self) -> None:
        for latitude in ("NaN", "91", True):
            visit, action = sample()
            visit.update(latitude=latitude, longitude=None)
            warnings = []
            props = convert_action(visit, action, warnings)["properties"]
            self.assertNotIn("latitude", props)
            self.assertNotIn("longitude", props)
            self.assertEqual(len(warnings), 1)
            self.assertEqual(warnings[0]["field"], "latitude")

    def test_all_action_types_and_custom_fields(self) -> None:
        for kind, name in (("action", "Page Viewed"), ("download", "File Downloaded"),
                           ("outlink", "Outbound Link Clicked"), ("event", "Matomo Custom Event")):
            with self.subTest(kind=kind):
                visit, action = sample()
                action.update(type=kind, eventCategory="Chatbot", eventValue="1.5")
                event = convert_action(visit, action)
                self.assertEqual(event["event"], name)
                self.assertEqual(event["properties"]["matomo_event_value"], 1.5)

    def test_stable_ids_distinguish_actions(self) -> None:
        visit, action = sample()
        original = convert_action(visit, action)["properties"]["$insert_id"]
        self.assertEqual(len(original), 36)
        self.assertEqual(original, convert_action(visit, action)["properties"]["$insert_id"])
        action["pageId"] = 101
        self.assertNotEqual(original, convert_action(visit, action)["properties"]["$insert_id"])

    def test_invalid_required_fields_and_numbers(self) -> None:
        for field, value in (("timestamp", None), ("type", "unknown")):
            with self.subTest(field=field, value=value):
                visit, action = sample()
                action[field] = value
                with self.assertRaises(ValueError):
                    convert_action(visit, action)

    def test_long_strings_are_omitted_with_warnings(self) -> None:
        visit, action = sample()
        action["pageTitle"] = "x" * 256
        warnings = []
        event = convert_action(visit, action, warnings)
        self.assertNotIn("page_title", event["properties"])
        self.assertEqual(warnings, [{"field": "pageTitle", "property": "page_title",
                                    "reason": "exceeds 255 UTF-8 bytes"}])

    def test_invalid_optional_metadata_preserves_event(self) -> None:
        for field, target, value in (("timeSpent", "time_spent_seconds", "NaN"),
                                     ("timeSpent", "time_spent_seconds", True),
                                     ("pageTitle", "page_title", 123),
                                     ("url", "url", "invalid URL")):
            with self.subTest(field=field, value=value):
                visit, action = sample()
                action[field] = value
                warnings = []
                event = convert_action(visit, action, warnings)
                self.assertEqual(event["event"], "Page Viewed")
                self.assertNotIn(target, event["properties"])
                self.assertEqual(len(warnings), 1)
                self.assertEqual(warnings[0]["field"], field)

    def test_absent_optional_fields_are_not_warnings(self) -> None:
        visit, action = sample()
        warnings = []
        convert_action(visit, action, warnings)
        self.assertEqual(warnings, [])

    def test_crash_media_and_search_mapping(self) -> None:
        cases = (
            ("crash", {"crashEventId": 42, "crashType": "TypeError", "message": "Load failed"},
             "Application Crash", {"crash_type": "TypeError", "crash_message": "Load failed"}),
            ("media", {"media_type": "video", "watched_time": 10, "fullscreen": 1},
             "Media Interaction", {"media_type": "video", "media_watched_time_seconds": 10.0, "media_fullscreen": 1}),
            ("search", {"siteSearchKeyword": "test", "siteSearchCount": 2},
             "Site Search", {"search_keyword": "test", "search_result_count": 2}),
        )
        for kind, fields, name, expected in cases:
            with self.subTest(kind=kind):
                visit, action = sample()
                action.update(type=kind, **fields)
                if kind == "media":
                    action.pop("pageId")
                event = convert_action(visit, action)
                self.assertEqual(event["event"], name)
                self.assertTrue(event["properties"]["matomo_action_id"])
                for field, value in expected.items():
                    self.assertEqual(event["properties"][field], value)

    def test_url_removes_credentials_and_preserves_android_referrer(self) -> None:
        self.assertEqual(clean_url("https://user:password@example.com/p?q=1#f"), "https://example.com/p?q=1#f")
        self.assertEqual(clean_url("android-app://com.google.android.gm/?q=1", referrer=True),
                         "android-app://com.google.android.gm/?q=1")


class TimestampTests(unittest.TestCase):
    def test_winter_and_summer(self) -> None:
        for month, hour in (("01", "13"), ("06", "14")):
            utc = epoch(f"2026-{month}-07T12:00:00")
            visit = {"firstActionTimestamp": utc, "lastActionTimestamp": utc}
            self.assertEqual(action_time({"timestamp": epoch(f"2026-{month}-07T{hour}:00:00")}, visit), utc)

    def test_autumn_fold_resolved_by_visit_bounds(self) -> None:
        action = {"timestamp": epoch("2025-10-26T02:30:00")}
        for hour in ("00", "01"):
            utc = epoch(f"2025-10-26T{hour}:30:00")
            self.assertEqual(action_time(action, {"firstActionTimestamp": utc, "lastActionTimestamp": utc}), utc)

    def test_unresolved_fold_is_rejected(self) -> None:
        visit = {"firstActionTimestamp": epoch("2025-10-26T00:00:00"),
                 "lastActionTimestamp": epoch("2025-10-26T02:00:00")}
        with self.assertRaisesRegex(ValueError, "ambiguous"):
            action_time({"timestamp": epoch("2025-10-26T02:30:00")}, visit)

    def test_nonexistent_spring_hour_is_rejected(self) -> None:
        visit = {"firstActionTimestamp": epoch("2026-03-29T00:00:00"),
                 "lastActionTimestamp": epoch("2026-03-29T03:00:00")}
        with self.assertRaises(ValueError):
            action_time({"timestamp": epoch("2026-03-29T02:30:00")}, visit)

    def test_timestamp_within_visit_tolerance_is_reported_as_warning(self) -> None:
        # In January, the export's Rome wall-clock epoch is one hour ahead of UTC.
        action = {"timestamp": epoch("2026-01-26T10:03:55")}
        visit = {
            "firstActionTimestamp": epoch("2026-01-26T09:03:57"),
            "lastActionTimestamp": epoch("2026-01-26T09:04:00"),
        }
        warnings: list[dict[str, str]] = []
        self.assertEqual(action_time(action, visit, warnings), epoch("2026-01-26T09:03:55"))
        self.assertIn("2 seconds outside visit bounds", warnings[0]["reason"])

    def test_timestamp_outside_visit_tolerance_is_rejected(self) -> None:
        action = {"timestamp": epoch("2026-01-26T10:03:51")}
        visit = {
            "firstActionTimestamp": epoch("2026-01-26T09:03:57"),
            "lastActionTimestamp": epoch("2026-01-26T09:04:00"),
        }
        with self.assertRaisesRegex(ValueError, "outside visit bounds"):
            action_time(action, visit)


if __name__ == "__main__":
    unittest.main()
