import json
import gzip
import base64
from typing import Any, Dict

from src.modules.logger import get_logger


LOGGER = get_logger(__name__)


def safe_json_load(value):
    """Parse JSON string attributes into Python objects."""
    if isinstance(value, str):
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return value
    return value


def compress_payload(payload: Dict[str, Any]) -> str:
    """Compress and encode a JSON payload.
    Args:
        payload (Dict[str, Any]): The original JSON payload.
    Returns:
        str: The Base64-encoded compressed payload.
    """
    json_bytes = json.dumps(payload).encode("utf-8")
    compressed_data = gzip.compress(json_bytes)
    encoded_data = base64.b64encode(compressed_data).decode("utf-8")
    LOGGER.info(f"Compressed from {len(json_bytes)} to {len(compressed_data)} bytes.")
    return encoded_data


def decompress_payload(encoded_data: str) -> Dict[str, Any]:
    """Decode and decompress a Base64-encoded compressed JSON payload.
    Args:
        encoded_data (str): The Base64-encoded compressed payload.
    Returns:
        Dict[str, Any]: The original JSON-deserialized payload.
    """

    compressed_data = base64.b64decode(encoded_data)
    json_bytes = gzip.decompress(compressed_data)
    output = safe_json_load(json_bytes.decode("utf-8"))
    LOGGER.info(f"Decompressed from {len(compressed_data)} to {len(json_bytes)} bytes.")
    return output
