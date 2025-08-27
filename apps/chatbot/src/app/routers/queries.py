import datetime
import nh3
import json
import uuid
from botocore.exceptions import BotoCoreError, ClientError
from boto3.dynamodb.conditions import Key
from fastapi import APIRouter, Header, HTTPException
from typing import List, Annotated

from src.app.sqs_init import sqs_queue_evaluate
from src.app.models import Query, tables
from src.app.calls import chatbot_generate, chatbot_mask_pii
from src.app.sessions import (
    current_user_id,
    find_or_create_session,
    session_salt,
    hash_func,
    last_session_id,
    get_user_session,
)
from src.modules.logger import get_logger
from src.modules.settings import SETTINGS

LOGGER = get_logger(__name__)
router = APIRouter()


@router.post("/queries")
async def query_creation(
    query: Query,
    authorization: Annotated[str | None, Header()] = None,
):

    now = datetime.datetime.now(datetime.UTC)
    trace_id = str(uuid.uuid4())
    userId = current_user_id(authorization)
    session = find_or_create_session(userId, now=now)
    salt = session_salt(session["id"])
    query_str = nh3.clean(query.question)
    user_id = hash_func(userId, salt)
    messages = [item.model_dump() for item in query.history] if query.history else None

    lambda_payload = {
        "query_str": query_str,
        "trace_id": trace_id,
        "session_id": session["id"],
        "user_id": user_id,
        "messages": messages,
    }

    answer_json = chatbot_generate(lambda_payload)
    answer = answer_json.get("final_response", "")

    if can_evaluate():
        evaluation_data = {
            "query_str": query_str,
            "response_str": answer,
            "retrieved_contexts": answer_json["contexts"],
            "trace_id": trace_id,
            "messages": messages,
        }
        sqs_response = sqs_queue_evaluate.send_message(
            MessageBody=json.dumps(evaluation_data),
            MessageGroupId=trace_id,  # Required for FIFO queues
        )
        LOGGER.info(f"sqs response: {sqs_response}")

    if query.queriedAt is None:
        queriedAt = now.isoformat()
    else:
        queriedAt = query.queriedAt

    createdAt = now.isoformat()
    createdAtDate = createdAt[:10]
    bodyToReturn = {
        "id": trace_id,
        "sessionId": session["id"],
        "question": query.question,
        "answer": answer,
        "createdAt": createdAt,
        "createdAtDate": createdAtDate,
        "queriedAt": queriedAt,
        "badAnswer": False,
    }

    bodyToSave = bodyToReturn.copy()
    bodyToSave["question"] = chatbot_mask_pii(query.question)
    bodyToSave["answer"] = chatbot_mask_pii(answer)
    bodyToSave["topics"] = answer_json.get("products", [])
    try:
        tables["queries"].put_item(Item=bodyToSave)
    except (BotoCoreError, ClientError) as e:
        raise HTTPException(status_code=422, detail=f"[POST /queries] error: {e}")
    return bodyToReturn


@router.get("/queries")
async def queries_fetching(
    sessionId: str | None = None,
    page: int | None = 1,
    pageSize: int | None = 10,
    authorization: Annotated[str | None, Header()] = None,
):
    userId = current_user_id(authorization)

    if sessionId is None:
        sessionId = last_session_id(userId)
    else:
        session = get_user_session(userId, sessionId)
        sessionId = session.get("id", None)

    if sessionId is None:
        result = []
    else:
        try:
            dbResponse = tables["queries"].query(
                KeyConditionExpression=Key("sessionId").eq(sessionId),
                IndexName="QueriesByCreatedAtIndex",
                ScanIndexForward=True,
            )
        except (BotoCoreError, ClientError) as e:
            raise HTTPException(
                status_code=422,
                detail=f"[queries_fetching] sessionId: {sessionId}, error: {e}",
            )
        result = dbResponse.get("Items", [])

    return result


def can_evaluate() -> bool:
    """
    Decide whether to evaluate the query or not.
    This is based on the amount of daily query
    """
    return count_queries_created_today() < SETTINGS.max_daily_evaluations


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
    response = tables["queries"].scan()
    items = response.get("Items", [])

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
