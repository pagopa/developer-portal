import datetime
import nh3
import json
import os
import uuid
from botocore.exceptions import BotoCoreError, ClientError
from boto3.dynamodb.conditions import Key
from fastapi import APIRouter, Header, HTTPException
from typing import List, Annotated
from src.app.sqs_init import sqs_queue_evaluate
from src.app.models import Query, tables
from src.modules.logger import get_logger
from src.app.query_utilities import (
    can_evaluate,
    count_queries_created_today,
    backfill_created_at_date,
    fix_unbalanced_code_blocks,
    get_final_response,
)
from src.app.sessions import (
    current_user_id,
    find_or_create_session,
    session_salt,
    hash_func,
    last_session_id,
    get_user_session,
)
from src.app.chatbot_init import chatbot

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

    answer_json = await chatbot.chat_generate(
        query_str=query_str,
        trace_id=trace_id,
        session_id=session["id"],
        user_id=user_id,
        messages=messages,
    )
    answer = get_final_response(
        response_str=answer_json["response"],
        references=answer_json["references"],
    )

    if can_evaluate():
        evaluation_data = {
            "query_str": query_str,
            "response_str": answer,
            "retrieved_contexts": answer_json["contexts"],
            "trace_id": trace_id,
            "messages": messages,
        }
        if sqs_queue_evaluate is None:
            LOGGER.warning(
                f"sqs_queue_evaluate is None, cannot send message {evaluation_data}"
            )
        else:
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

    days = int(os.getenv("EXPIRE_DAYS", 90))
    expires_at = int((now + datetime.timedelta(days=days)).timestamp())

    bodyToSave = bodyToReturn.copy()
    bodyToSave["question"] = chatbot.mask_pii(query.question)
    bodyToSave["answer"] = get_final_response(
        response_str=chatbot.mask_pii(answer_json["response"]),
        references=answer_json["references"],
    )
    bodyToSave["topics"] = answer_json.get("products", [])
    bodyToSave["expiresAt"] = expires_at
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
        sessionId = session.get("id", None) if session else None

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
