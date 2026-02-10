import json
from typing import Any


def safe_json_load(value: Any) -> Any:
    """Parse JSON string attributes into Python objects."""
    if isinstance(value, str):
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return value
    return value
