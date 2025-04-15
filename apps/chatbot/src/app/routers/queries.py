import datetime
import nh3
import os
import uuid
import yaml
from botocore.exceptions import BotoCoreError, ClientError
from boto3.dynamodb.conditions import Key
from fastapi import APIRouter, BackgroundTasks, Header, HTTPException
from logging import getLogger
from typing import Annotated
from src.app.models import Query, tables
from src.app.sessions import (
    current_user_id,
    find_or_create_session,
    session_salt,
    hash_func,
    last_session_id,
    get_user_session,
)
from src.modules.chatbot import Chatbot

logger = getLogger(__name__)

router = APIRouter()
params = yaml.safe_load(open("config/params.yaml", "r"))
prompts = yaml.safe_load(open("config/prompts.yaml", "r"))
chatbot = Chatbot(params, prompts)


def can_evaluate() -> bool:
    """
    Decide whether to evaluate the query or not.
    This is based on the amount of daily query
    """
    max_daily_evaluations = os.getenv("CHB_MAX_DAILY_EVALUATIONS", "200")
    return count_queries_created_today() < max_daily_evaluations


def count_queries_created_today() -> int:
    today = datetime.datetime.utcnow().date().isoformat()

    response = tables["queries"].query(
        IndexName="QueriesByCreatedAtDateIndex",
        KeyConditionExpression=Key("createdAtDate").eq(today),
        Select="COUNT"
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

    logger.info(f"Backfilled {len(items)} items with `createdAtDate`.")


async def evaluate(evaluation_data: dict) -> dict:
    if os.getenv("environment", "development") != "test":
        evaluation_result = chatbot.evaluate(**evaluation_data)
        logger.info(f"[queries] evaluation_result={evaluation_result})")
    else:
        evaluation_result = {}
    return evaluation_result


@router.post("/queries")
async def query_creation(
    background_tasks: BackgroundTasks,
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
    messages = (
        [item.model_dump() for item in query.history] if query.history else None
    )

    answer_json = chatbot.chat_generate(
        query_str=query_str,
        trace_id=trace_id,
        session_id=session["id"],
        user_id=user_id,
        messages=messages,
    )
    answer = chatbot.get_final_response(answer_json)

    if can_evaluate():
        evaluation_data = {
            "query_str": query_str,
            "response_str": answer,
            "retrieved_contexts": answer_json["contexts"],
            "trace_id": trace_id,
            "session_id": session["id"],
            "user_id": user_id,
            "messages": messages,
        }
        background_tasks.add_task(
            evaluate,
            evaluation_data=evaluation_data
        )

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
    bodyToSave["question"] = chatbot.mask_pii(query.question)
    bodyToSave["answer"] = chatbot.mask_pii(answer)
    bodyToSave["topics"] = answer_json.get("topics", [])
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
