import datetime
import json
import logging
import mangum
import nh3
import os
import uvicorn
import uuid
import yaml

from boto3.dynamodb.conditions import Key
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import FastAPI, HTTPException, Header

from starlette.middleware.cors import CORSMiddleware
from typing import Annotated

from src.modules.chatbot import Chatbot
from src.app.models import Query, QueryFeedback, tables
from src.app.sessions import (
    current_user_id,
    find_or_create_session,
    session_salt,
    hash_func
)

logging.basicConfig(level=logging.INFO)
params = yaml.safe_load(open("config/params.yaml", "r"))
prompts = yaml.safe_load(open("config/prompts.yaml", "r"))

AUTH_COGNITO_USERPOOL_ID = os.getenv('AUTH_COGNITO_USERPOOL_ID')
ENVIRONMENT = os.getenv('environment', 'dev')

chatbot = Chatbot(params, prompts)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=json.loads(os.getenv("CORS_DOMAINS", "[\"*\"]")),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthz")
async def healthz():
    return {"message": "OK"}


@app.post("/queries")
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


@app.get("/queries")
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


# retrieve sessions of current user
@app.get("/sessions")
async def sessions_fetching(
    page: int = 1,
    pageSize: int = 10,
    authorization: Annotated[str | None, Header()] = None
):
    userId = current_user_id(authorization)

    try:
        dbResponse = tables["sessions"].query(
            KeyConditionExpression=Key("userId").eq(userId),
            IndexName='SessionsByCreatedAtIndex',
            ScanIndexForward=False
        )
    except (BotoCoreError, ClientError) as e:
        raise HTTPException(
            status_code=422,
            detail=f"[sessions_fetching] userId: {userId}, error: {e}"
        )

    # TODO: pagination
    items = dbResponse.get('Items', [])
    result = {
        "items": items,
        "page": 1,
        "pages": 1,
        "size": len(items),
        "total": len(items),
    }
    return result


@app.delete("/sessions/{id}")
async def session_delete(
    id: str,
    authorization: Annotated[str | None, Header()] = None
):
    userId = current_user_id(authorization)
    body = {
        "id": id,
    }
    try:
        dbResponse_queries = tables["queries"].query(
            KeyConditionExpression=Key("sessionId").eq(id)
        )
        # TODO: use batch writer
        # with tables["sessions"].batch_writer() as batch:
        for query in dbResponse_queries['Items']:
            tables["queries"].delete_item(
                Key={
                    "id": query["id"],
                    "sessionId": id
                }
            )

        tables["sessions"].delete_item(
            Key={
                "id": id,
                "userId": userId,
            }
        )

    except (BotoCoreError, ClientError) as e:
        raise HTTPException(
            status_code=422,
            detail=f"[sessions_delete] userId: {userId}, error: {e}"
        )

    return body


def last_session_id(userId: str):
    dbResponse = tables["sessions"].query(
        IndexName='SessionsByCreatedAtIndex',
        KeyConditionExpression=Key('userId').eq(userId),
        ScanIndexForward=False,
        Limit=1
    )
    items = dbResponse.get('Items', [])
    return items[0].get('id', None) if items else None


def get_user_session(userId: str, sessionId: str):
    dbResponse = tables["sessions"].get_item(
        Key={
          "userId": userId,
          "id": sessionId
        }
    )
    item = dbResponse.get('Item')
    return item if item else None


@app.patch("/sessions/{sessionId}/queries/{id}")
async def query_feedback(
    id: str,
    sessionId: str,
    query: QueryFeedback,
    authorization: Annotated[str | None, Header()] = None
):

    try:
        dbResponse = tables["queries"].update_item(
            Key={
                'sessionId': sessionId,
                'id': id
            },
            UpdateExpression='SET #badAnswer = :badAnswer',
            ExpressionAttributeNames={
                '#badAnswer': 'badAnswer'
            },
            ExpressionAttributeValues={
                ':badAnswer': query.badAnswer
            },
            ReturnValues='ALL_NEW'
        )

        chatbot.add_langfuse_score(
            trace_id=id,
            name='user-feedback',
            value=(-1 if query.badAnswer else 1),
            data_type='NUMERIC'
        )

    except (BotoCoreError, ClientError) as e:
        raise HTTPException(
            status_code=422,
            detail=(
                f"[query_feedback] id: {id} sessionId: {sessionId}, error: {e}"
            )
        )

    if 'Attributes' in dbResponse:
        return dbResponse.get('Attributes')
    else:
        raise HTTPException(status_code=404, detail="Record not found")

handler = mangum.Mangum(app, lifespan="off")


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8080,
        log_level=os.getenv("LOG_LEVEL", "info")
    )
