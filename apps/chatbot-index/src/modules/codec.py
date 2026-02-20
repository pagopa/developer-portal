import json
from typing import Any


from src.modules.logger import get_logger


LOGGER = get_logger(__name__)


def safe_json_load(value: Any) -> Any:
    """Parse JSON string attributes into Python objects."""
    if isinstance(value, str):
        try:
            return json.loads(value)
        except json.JSONDecodeError as e:
            LOGGER.warning(f"Failed to parse JSON string: {value}. Error: {e}")
            return value
    return value
