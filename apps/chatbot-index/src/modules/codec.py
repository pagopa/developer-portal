import json


def safe_json_load(value) -> dict | list | str:
    """Parse JSON string attributes into Python objects."""
    if isinstance(value, str):
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return value
    return value
