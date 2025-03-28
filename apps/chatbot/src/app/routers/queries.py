import datetime
import nh3
import uuid
import yaml
from botocore.exceptions import BotoCoreError, ClientError
from boto3.dynamodb.conditions import Key
from fastapi import APIRouter, Header
from typing import Annotated
from src.app.models import Query, QueryFeedback, tables
from src.app.sessions import (
    current_user_id,
    find_or_create_session,
    session_salt,
    hash_func,
    last_session_id,
    get_user_session
)
from src.modules.chatbot import Chatbot

router = APIRouter()
params = yaml.safe_load(open("config/params.yaml", "r"))
prompts = yaml.safe_load(open("config/prompts.yaml", "r"))
chatbot = Chatbot(params, prompts)


@router.post("/queries")
async def query_creation(
    query: Query,
    authorization: Annotated[str | None, Header()] = None
):
    now = datetime.datetime.now(datetime.UTC)
    trace_id = str(uuid.uuid4())
    userId = current_user_id(authorization)
    session = find_or_create_session(userId, now=now)
    salt = session_salt(session['id'])

    answer = chatbot.chat_generate(
        query_str=nh3.clean(query.question),
        messages=(
            [item.dict() for item in query.history] if query.history else None
        ),
        trace_id=trace_id,
        user_id=hash_func(userId, salt),
        session_id=session["id"]
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

