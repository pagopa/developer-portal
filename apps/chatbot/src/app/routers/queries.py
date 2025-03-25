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
    get_user_session
)
from src.modules.chatbot import Chatbot

EVALUATION_API_URL = os.getenv("CHB_EVALUATION_API_URL", "http://api:8080/evaluations")

logger = getLogger(__name__)
router = APIRouter()
params = yaml.safe_load(open("config/params.yaml", "r"))
prompts = yaml.safe_load(open("config/prompts.yaml", "r"))
chatbot = Chatbot(params, prompts)


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
    authorization: Annotated[str | None, Header()] = None
):
    now = datetime.datetime.now(datetime.UTC)
    trace_id = str(uuid.uuid4())
    userId = current_user_id(authorization)
    session = find_or_create_session(userId, now=now)
    salt = session_salt(session['id'])
    query_str = nh3.clean(query.question)
    user_id = hash_func(userId, salt)
    messages = (
        [item.dict() for item in query.history] if query.history else None
    )

    answer, retrieved_contexts = chatbot.chat_generate(
        query_str=query_str,
        trace_id=trace_id,
        session_id=session["id"],
        user_id=user_id,
        messages=messages,
    )

    evaluation_data = {
        "query_str": query_str,
        "response_str": answer,
        "retrieved_contexts": retrieved_contexts,
        "trace_id": trace_id,
        "session_id": session["id"],
        "user_id": user_id,
        "messages": messages
    }
    background_tasks.add_task(
        evaluate,
        evaluation_data=evaluation_data
    )

    if query.queriedAt is None:
        queriedAt = now.isoformat()
    else:
        queriedAt = query.queriedAt

    bodyToReturn = {
        "id": trace_id,
        "sessionId": session['id'],
        "question": query.question,
        "answer": answer,
        "createdAt": now.isoformat(),
        "queriedAt": queriedAt,
        "badAnswer": False
    }

    bodyToSave = bodyToReturn.copy()
    bodyToSave["question"] = chatbot.mask_pii(query.question)
    bodyToSave["answer"] = chatbot.mask_pii(answer)
    try:
        tables["queries"].put_item(Item=bodyToSave)
    except (BotoCoreError, ClientError) as e:
        raise HTTPException(
            status_code=422,
            detail=f"[POST /queries] error: {e}"
        )
    return bodyToReturn


@router.get("/queries")
async def queries_fetching(
    sessionId: str | None = None,
    page: int | None = 1,
    pageSize: int | None = 10,
    authorization: Annotated[str | None, Header()] = None
):
    userId = current_user_id(authorization)

    if sessionId is None:
        sessionId = last_session_id(userId)
    else:
        session = get_user_session(userId, sessionId)
        sessionId = session.get('id', None)

    if sessionId is None:
        result = []
    else:
        try:
            dbResponse = tables["queries"].query(
                KeyConditionExpression=Key('sessionId').eq(sessionId),
                IndexName='QueriesByCreatedAtIndex',
                ScanIndexForward=True
            )
        except (BotoCoreError, ClientError) as e:
            raise HTTPException(
                status_code=422,
                detail=f"[queries_fetching] sessionId: {sessionId}, error: {e}"
            )
        result = dbResponse.get('Items', [])

    return result
