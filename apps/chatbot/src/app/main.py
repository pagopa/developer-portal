import yaml
import mangum
import uvicorn
import json
import os
import uuid
import boto3
import datetime
import time
import jwt
from typing import Annotated
from boto3.dynamodb.conditions import Key
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import FastAPI, HTTPException, Header
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.modules.chatbot import Chatbot

params = yaml.safe_load(open("config/params.yaml", "r"))
prompts = yaml.safe_load(open("config/prompts.yaml", "r"))
AWS_DEFAULT_REGION = os.getenv('CHB_AWS_DEFAULT_REGION', os.getenv('AWS_DEFAULT_REGION', None))

chatbot = Chatbot(params, prompts)


class Query(BaseModel):
  question: str
  queriedAt: str | None = None

class QueryFeedback(BaseModel):
  badAnswer: bool

boto3_session = boto3.session.Session(
  region_name=AWS_DEFAULT_REGION
)

if (os.getenv('environment', 'dev') == 'local'):
  dynamodb = boto3_session.resource(    
    'dynamodb',
    endpoint_url=os.getenv('CHB_DYNAMODB_URL', 'http://localhost:8000'),
    region_name=AWS_DEFAULT_REGION
  )
else:
  dynamodb = boto3_session.resource(    
    'dynamodb',
    region_name=AWS_DEFAULT_REGION
  )

table_queries = dynamodb.Table(
  f"{os.getenv('CHB_QUERY_TABLE_PREFIX', 'chatbot')}-queries"
)
table_sessions = dynamodb.Table(
  f"{os.getenv('CHB_QUERY_TABLE_PREFIX', 'chatbot')}-sessions"
)

app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=json.loads(os.getenv("CORS_DOMAINS", "[\"*\"]")),
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.get("/healthz")
async def healthz ():
  return {"message": "OK"}

@app.post("/queries")
async def query_creation (
  query: Query, 
  authorization: Annotated[str | None, Header()] = None
):
  now = datetime.datetime.now(datetime.UTC)
  userId = current_user_id(authorization)
  session = find_or_create_session(userId, now=now)
  answer = chatbot.generate(query.question)

  if query.queriedAt is None:
    queriedAt = now.isoformat()
  else:
    queriedAt = query.queriedAt

  body = {
    "id": f'{uuid.uuid4()}',
    "sessionId": session['id'],
    "question": query.question,
    "answer": answer,
    "createdAt": now.isoformat(),
    "queriedAt": queriedAt,
    "badAnswer": False
  }

  try:
    table_queries.put_item(Item = body)
  except (BotoCoreError, ClientError) as e:
    raise HTTPException(status_code=422, detail=f"[POST /queries] error: {e}")
  return body


def current_user_id(authorization: str):
  if authorization is None:
    # TODO remove fake user and return None
    # return None
    return '-'
  else:
    token = authorization.split(' ')[1]
    decoded = jwt.decode(
      token, 
      algorithms=["RS256"], 
      options={"verify_signature": False}
    )
    return decoded['cognito:username']


def find_or_create_session(userId: str, now: datetime.datetime):
  # TODO: return if userId is None
  if userId is None:
    userId = '-'
  
  SESSION_MAX_DURATION_DAYS = float(os.getenv('CHB_SESSION_MAX_DURATION_DAYS', '1'))
  datetimeLimit = now - datetime.timedelta(SESSION_MAX_DURATION_DAYS - 1)
  startOfDay = datetime.datetime.combine(datetimeLimit, datetime.time.min)
  # trovare una sessione con createdAt > datetimeLimit
  try:
    dbResponse = table_sessions.query(
      KeyConditionExpression=Key("userId").eq(userId) &
        Key('createdAt').gt(startOfDay.isoformat()),
      IndexName='SessionsByCreatedAtIndex',
      ScanIndexForward=False,
      Limit=1
    )
  except (BotoCoreError, ClientError) as e:
    raise HTTPException(status_code=422, detail=f"[find_or_create_session] userId: {userId}, error: {e}")
  
  items = dbResponse.get('Items', [])
  if len(items) == 0:
    body = {
      "id": f'{uuid.uuid4()}',
      "title": now.strftime("%Y-%m-%d"),
      "userId": userId,
      "createdAt": now.isoformat()
    }
    try:
      table_sessions.put_item(Item = body)
    except (BotoCoreError, ClientError) as e:
      raise HTTPException(status_code=422, detail=f"[find_or_create_session] body: {body}, error: {e}")

  else:
    body = items[0]

  return body


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

  if sessionId is None:
    result = []
  else:
    try:
      dbResponse = table_queries.query(
        KeyConditionExpression=Key('sessionId').eq(sessionId),
        IndexName='QueriesByCreatedAtIndex',
        ScanIndexForward=True
      )
    except (BotoCoreError, ClientError) as e:
      raise HTTPException(status_code=422, detail=f"[queries_fetching] sessionId: {sessionId}, error: {e}")
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
    dbResponse = table_sessions.query(
      KeyConditionExpression=Key("userId").eq(userId),
      IndexName='SessionsByCreatedAtIndex',
      ScanIndexForward=False
    )
  except (BotoCoreError, ClientError) as e:
    raise HTTPException(status_code=422, detail=f"[sessions_fetching] userId: {userId}, error: {e}")
  
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
    dbResponse_queries = table_queries.query(
      KeyConditionExpression=Key("sessionId").eq(id)
    )
    # TODO: use batch writer
#    with table_sessions.batch_writer() as batch:
    for query in dbResponse_queries['Items']:
      table_queries.delete_item(
        Key={
          "id": query["id"],
          "sessionId": id
        }
      )

    table_sessions.delete_item(
      Key={
        "id": id,
        "userId": userId,
      }
    )

  except (BotoCoreError, ClientError) as e:
    raise HTTPException(status_code=422, detail=f"[sessions_delete] userId: {userId}, error: {e}")
  
  return body


def last_session_id(userId: str):
  dbResponse = table_sessions.query(
    IndexName='SessionsByCreatedAtIndex',
    KeyConditionExpression=Key('userId').eq(userId),
    ScanIndexForward=False,
    Limit=1
  )
  items = dbResponse.get('Items', [])
  return items[0].get('id', None) if items else None

@app.patch("/sessions/{sessionId}/queries/{id}")
async def query_feedback (
  id: str,
  sessionId: str,
  query: QueryFeedback,
  authorization: Annotated[str | None, Header()] = None
):

  try:
    dbResponse = table_queries.update_item(
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
  except (BotoCoreError, ClientError) as e:
    raise HTTPException(status_code=422, detail=f"[query_feedback] id: {id}, sessionId: {sessionId}, error: {e}")

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
