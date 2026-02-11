import json
from typing import Any


def safe_json_load(value: Any, default: Any = None) -> Any:
    """Parse JSON string attributes into Python objects.

    If ``value`` is a JSON string, return the decoded Python object.
    If decoding fails with ``json.JSONDecodeError``, return ``default``
    instead. Non-string values are returned unchanged.
    """
    if isinstance(value, str):
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return default
    return value
