import importlib.util
from pathlib import Path
from types import ModuleType

import pytest


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

    assert f"({expected} / 100.0 * webinar_duration_minutes)" in query
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
