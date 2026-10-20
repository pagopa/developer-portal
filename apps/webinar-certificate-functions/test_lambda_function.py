import importlib
import json
from pathlib import Path
from types import ModuleType
from unittest.mock import Mock

import pytest


COLUMNS = [
    "webinarid",
    "minutes_spent_watching",
    "webinar_duration_minutes",
    "watch_percentage",
    "reached_80_percent_at",
    "last_viewed_at",
]
VALUES = [
    "TestWebinar456",
    "10.98",
    "10.0",
    "109.8",
    "2026-08-25 08:33:30.473 UTC",
    "2026-08-25 08:35:31.289 UTC",
]


@pytest.fixture
def lambda_module(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("ATHENA_OUTPUT_LOCATION", "s3://test-athena-results/")
    return importlib.import_module("lambda_function")


def make_row(values: list[str | None]) -> dict:
    return {
        "Data": [
            {"VarCharValue": value} if value is not None else {}
            for value in values
        ]
    }


def make_page(rows: list[dict]) -> dict:
    return {
        "ResultSet": {
            "ResultSetMetadata": {
                "ColumnInfo": [{"Name": column} for column in COLUMNS]
            },
            "Rows": rows,
        }
    }


def test_fetch_results_returns_all_columns_across_pages(lambda_module) -> None:
    athena = Mock()
    second_values = [
        "provaheartbeat",
        "15.93",
        "2.0",
        "796.7",
        "2026-09-24 13:11:49.683 UTC",
        "2026-09-25 07:47:31.567 UTC",
    ]
    athena.get_paginator.return_value.paginate.return_value = [
        make_page([make_row(COLUMNS), make_row(VALUES)]),
        make_page([make_row(second_values)]),
    ]

    assert lambda_module._fetch_results(athena, "query-id") == [
        dict(zip(COLUMNS, VALUES)),
        dict(zip(COLUMNS, second_values)),
    ]
    athena.get_paginator.assert_called_once_with("get_query_results")
    athena.get_paginator.return_value.paginate.assert_called_once_with(
        QueryExecutionId="query-id"
    )


@pytest.mark.parametrize("values", [VALUES[:4] + [None, None], VALUES[:4]])
def test_fetch_results_preserves_null_columns(lambda_module, values) -> None:
    athena = Mock()
    athena.get_paginator.return_value.paginate.return_value = [
        make_page([make_row(COLUMNS), make_row(values)])
    ]

    assert lambda_module._fetch_results(athena, "query-id") == [
        dict(zip(COLUMNS, VALUES[:4] + [None, None]))
    ]


def test_fetch_results_returns_empty_list_without_matches(lambda_module) -> None:
    athena = Mock()
    athena.get_paginator.return_value.paginate.return_value = [
        make_page([make_row(COLUMNS)])
    ]

    assert lambda_module._fetch_results(athena, "query-id") == []


def test_handler_returns_json_objects(lambda_module, monkeypatch) -> None:
    athena = Mock()
    athena.start_query_execution.return_value = {"QueryExecutionId": "query-id"}
    athena.get_query_execution.return_value = {
        "QueryExecution": {"Status": {"State": "SUCCEEDED"}}
    }
    athena.get_paginator.return_value.paginate.return_value = [
        make_page([make_row(COLUMNS), make_row(VALUES)])
    ]
    client = Mock(return_value=athena)
    monkeypatch.setattr(lambda_module.boto3, "client", client)
    event = {
        "requestContext": {"authorizer": {"jwt": {"claims": {"sub": "user-id"}}}}
    }

    response = lambda_module.handler(event, None)

    assert response["statusCode"] == 200
    assert response["headers"] == {"Content-Type": "application/json"}
    assert json.loads(response["body"]) == [dict(zip(COLUMNS, VALUES))]
    client.assert_called_once_with("athena")
    assert (
        "WHERE userid = 'user-id'"
        in athena.start_query_execution.call_args.kwargs["QueryString"]
    )


def test_handler_rejects_missing_identity(lambda_module, monkeypatch) -> None:
    client = Mock()
    monkeypatch.setattr(lambda_module.boto3, "client", client)

    response = lambda_module.handler({}, None)

    assert response["statusCode"] == 401
    assert json.loads(response["body"]) == {
        "error": "Unauthorized: missing user identity"
    }
    client.assert_not_called()


def load_lambda(monkeypatch: pytest.MonkeyPatch, percentage: str | None) -> ModuleType:
    monkeypatch.setenv("ATHENA_OUTPUT_LOCATION", "s3://test-athena-results/")
    if percentage is None:
        monkeypatch.delenv("MIN_WATCH_PERCENTAGE", raising=False)
    else:
        monkeypatch.setenv("MIN_WATCH_PERCENTAGE", percentage)
    spec = importlib.util.spec_from_file_location(
        "certificate_lambda", Path(__file__).with_name("lambda_function.py")
    )
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


@pytest.mark.parametrize(
    ("percentage", "expected"),
    [(None, "80.0"), ("90", "90.0"), ("75.5", "75.5"), ("0", "0.0"), ("100", "100.0")],
)
def test_load_query_uses_environment_percentage(
    monkeypatch: pytest.MonkeyPatch, percentage: str | None, expected: str
) -> None:
    module = load_lambda(monkeypatch, percentage)

    query = module._load_query("user's-id")

    assert f"({expected} / 100.0 * duration)" in query
    assert f"({expected} / 100.0 * MAX(duration))" in query
    assert "AS reached_80_percent_at" in query
    assert "WHERE userid = 'user''s-id'" in query
    assert "<MIN_WATCH_PERCENTAGE>" not in query
    assert "<USER_ID>" not in query


@pytest.mark.parametrize("percentage", ["-1", "101", "nan", "inf", "-inf", "invalid", ""])
def test_invalid_percentage_fails_initialization(
    monkeypatch: pytest.MonkeyPatch, percentage: str
) -> None:
    with pytest.raises(ValueError):
        load_lambda(monkeypatch, percentage)


def test_user_id_is_not_processed_as_a_percentage_placeholder(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    module = load_lambda(monkeypatch, "90")

    assert "WHERE userid = '<MIN_WATCH_PERCENTAGE>'" in module._load_query(
        "<MIN_WATCH_PERCENTAGE>"
    )
