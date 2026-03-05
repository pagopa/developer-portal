import datetime
import json
import logging

from src.app import sqs_queue_monitor
from src.app.database import tables, Key
from src.modules import SETTINGS
from src.modules.codec import compress_payload

LOGGER = logging.getLogger(__name__)


def create_monitor_trace(trace_data: dict, should_evaluate: bool) -> None:
    """Send trace creation message to monitor queue.

    The monitor lambda will create the trace, then enqueue evaluation if requested.
    This prevents race conditions by ensuring trace exists before scores are added.
    """
    if sqs_queue_monitor is None:
        LOGGER.warning(f"sqs_queue_monitor is None, cannot send message {trace_data}")
    else:
        payload = {
            "operation": "create_trace",
            "data": compress_payload(trace_data),
            "should_evaluate": should_evaluate,
        }
        sqs_queue_monitor.send_message(
            MessageBody=json.dumps(payload),
            MessageGroupId=trace_data["trace_id"],  # Required for FIFO queues
        )


def can_evaluate() -> bool:
    """
    Decide whether to evaluate the query or not.
    This is based on the amount of daily query
    """
    max_daily_evaluations = SETTINGS.max_daily_evaluations
    result = count_queries_created_today() < max_daily_evaluations
    return result


def count_queries_created_today() -> int:
    today = datetime.datetime.now(datetime.timezone.utc).date().isoformat()

    response = tables["queries"].query(
        IndexName="QueriesByCreatedAtDateIndex",
        KeyConditionExpression=Key("createdAtDate").eq(today),
        Select="COUNT",
    )

    return response["Count"]
