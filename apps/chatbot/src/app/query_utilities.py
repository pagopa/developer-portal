import datetime
import json
from typing import List
from boto3.dynamodb.conditions import Key

from src.app.sqs_init import sqs_queue_monitor
from src.app.models import Query, QueryResponse, tables
from src.modules.logger import get_logger
from src.modules.settings import SETTINGS
from src.modules.codec import compress_payload

LOGGER = get_logger(__name__, level=SETTINGS.log_level)


def prepare_body_to_return(
    query: Query,
    session: dict | None,
    answer: str,
    answer_json: dict,
    trace_id: str,
    now: datetime,
) -> QueryResponse:

    if query.queriedAt is None:
        queriedAt = now.isoformat()
    else:
        queriedAt = query.queriedAt

    createdAt = now.isoformat()
    createdAtDate = createdAt[:10]

    bodyToReturn = QueryResponse(
        id=trace_id,
        sessionId=session["id"],
        question=query.question,
        answer=answer,
        createdAt=createdAt,
        createdAtDate=createdAtDate,
        queriedAt=queriedAt,
        badAnswer=False,
        chips=answer_json.get("chips", []),
    )

    # TODO: remove this debug line
    bodyToReturn.chips = ["debug chip 01", "debug chip 02", "debug chip 03"]

    return bodyToReturn


def prepare_body_to_save(
    bodyToReturn: QueryResponse,
    query: Query,
    answer: str,
    answer_json: dict,
    now: datetime,
) -> dict:

    days = SETTINGS.expire_days
    expires_at = int((now + datetime.timedelta(days=days)).timestamp())

    bodyToSave = bodyToReturn.model_dump()
    bodyToSave["question"] = query.question
    bodyToSave["answer"] = answer
    bodyToSave["topics"] = answer_json.get("products", [])
    bodyToSave["expiresAt"] = expires_at

    return bodyToSave


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


def backfill_created_at_date() -> None:
    """
    Backfill the `createdAtDate` field for all existing items in the table.
    """

    items = []
    last_evaluated_key = None
    page_size = 200
    while True:
        if last_evaluated_key:
            response = tables["queries"].scan(
                ExclusiveStartKey=last_evaluated_key, Limit=page_size
            )
        else:
            response = tables["queries"].scan(Limit=page_size)
        items.extend(response.get("Items", []))
        last_evaluated_key = response.get("LastEvaluatedKey")

        if not last_evaluated_key:
            break

    for item in items:
        created_at_date = item["createdAt"][:10]
        item["createdAtDate"] = created_at_date

        tables["queries"].put_item(Item=item)

    LOGGER.info(f"Backfilled {len(items)} items with `createdAtDate`.")


def fix_unbalanced_code_blocks(text: str) -> str:
    """
    Ensures code blocks delimited by \n``` are balanced.
    If unbalanced, removes the last dangling delimiter.
    """
    count = text.count("\n```")
    if count % 2 == 1:  # unbalanced
        last_index = text.rfind("\n```")
        if last_index != -1:
            text = text[:last_index] + text[last_index + 4 :]
    return text


def get_final_response(response_str: str, references: List[str]) -> str:

    response_str = fix_unbalanced_code_blocks(response_str)
    unique_references = list(dict.fromkeys(references))

    if len(unique_references) > 0:
        response_str += "\n\nRif:"
        for ref in unique_references:
            response_str += "\n" + ref

    return response_str
