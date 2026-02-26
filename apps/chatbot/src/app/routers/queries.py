import datetime
import nh3
import json
import secrets

from botocore.exceptions import BotoCoreError, ClientError
from boto3.dynamodb.conditions import Key
from fastapi import APIRouter, Header, HTTPException
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
from src.app.query_utilities import (
    get_final_response,
    can_evaluate,
    prepare_body_to_return,
    prepare_body_to_save,
    create_monitor_trace,
)
from src.app.chatbot_init import chatbot

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS
from src.modules.codec import compress_payload

LOGGER = get_logger(__name__, level=SETTINGS.log_level)
router = APIRouter()


@router.post("/queries")
async def query_creation(
    query: Query,
    authorization: Annotated[str | None, Header()] = None,
):

    now = datetime.datetime.now(datetime.UTC)
    trace_id = secrets.token_hex(16)
    userId = current_user_id(authorization)
    session = find_or_create_session(userId, now=now)
    salt = session_salt(session["id"])
    query_str = nh3.clean(query.question)
    user_id = hash_func(userId, salt)
    messages = [item.model_dump() for item in query.history] if query.history else None

    answer_json = await chatbot.chat_generate(
        query_str=query_str,
        messages=messages,
    )
    answer = get_final_response(
        response_str=answer_json["response"],
        references=answer_json["references"],
    )

    bodyToReturn = prepare_body_to_return(
        query=query,
        session=session,
        answer=answer,
        trace_id=trace_id,
        now=now,
    )

    bodyToSave = prepare_body_to_save(
        bodyToReturn=bodyToReturn,
        query=query,
        answer_json=answer_json,
        now=now,
    )

    trace_data = {
        "trace_id": trace_id,
        "user_id": user_id,
        "session_id": session["id"],
        "query": query.question,
        "messages": messages if messages else [],
        "response": answer,
        "contexts": answer_json.get("contexts", []),
        "tags": answer_json.get("products", []),
        "traceSpans": answer_json.get("spans", []),
        "query_for_database": bodyToSave,
    }
    # Send to monitor queue with evaluation flag
    # Monitor will create trace, then enqueue evaluation if needed
    create_monitor_trace(trace_data, should_evaluate=can_evaluate())

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
