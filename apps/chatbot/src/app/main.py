import yaml
import mangum
import uvicorn
import json
import os
import uuid
import boto3
import datetime
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
  userId = current_user_id(authorization)
  session = find_or_create_session(userId)
  answer = chatbot.generate(query.question)

  now = datetime.datetime.now(datetime.timezone.utc).isoformat()
  if query.queriedAt is None:
    queriedAt = now
  else:
    queriedAt = query.queriedAt

  body = {
    "id": f'{uuid.uuid4()}',
    "sessionId": session['id'],
    "question": query.question,
    "answer": answer,
    "createdAt": now,
    "queriedAt": queriedAt
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


def find_or_create_session(userId: str):
  # TODO: return if userId is None
  if userId is None:
    userId = '-'
  now = datetime.datetime.now(datetime.timezone.utc).isoformat()
  # TODO: calculate title
  # TODO: find last session based on SESSION_MAX_DURATION_MINUTES
  # TODO: if it's None, create it.
  body = {
    "id": '1',#f'{uuid.uuid4()}',
    "title": "last session",
    "userId": userId,
    "createdAt": now
  }
  try:
    table_sessions.put_item(Item = body)
  except (BotoCoreError, ClientError) as e:
    raise HTTPException(status_code=422, detail=f"[find_or_create_session] body: {body}, error: {e}")

  return body


@app.get("/queries/{id}")
async def query_fetching(id: str):
  # TODO: dynamoDB integration
  body = {
    "id": id,
    "sessionId": "",
    "question": "",
    "answer": "",
    "createdAt": "",
    "queriedAt": ""
  }
  return body


# retrieve sessions of current user
@app.get("/sessions")
async def sessions_fetching(
  authorization: Annotated[str | None, Header()] = None
):
  userId = current_user_id(authorization)

  try:
    db_response = table_sessions.query(
      KeyConditionExpression=Key("userId").eq(userId)
    )
  except (BotoCoreError, ClientError) as e:
    raise HTTPException(status_code=422, detail=f"[sessions_fetching] userId: {userId}, error: {e}")
  
  # TODO: pagination
  items = db_response.get('Items', [])
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
    db_response_queries = table_queries.query(
      KeyConditionExpression=Key("sessionId").eq(id)
    )
    # TODO: use batch writer
#    with table_sessions.batch_writer() as batch:
    for query in db_response_queries['Items']:
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

@app.get("/queries")
async def queries_fetching(
  sessionId: str | None = None,
  authorization: Annotated[str | None, Header()] = None
):
  userId = current_user_id(authorization)
  if sessionId is None:
    sessionId = last_session_id(userId)

  try:
    db_response = table_queries.query(
      KeyConditionExpression=Key("sessionId").eq(sessionId) &
        Key("id").eq(userId)
    )
  except (BotoCoreError, ClientError) as e:
    raise HTTPException(status_code=422, detail=f"[queries_fetching] sessionId: {sessionId}, error: {e}")

  result = db_response.get('Items', [])
  return result


def last_session_id(userId: str):
  db_response = table_sessions.query(
    IndexName='SessionsByCreatedAtIndex',
    KeyConditionExpression=Key('userId').eq(userId),
    ScanIndexForward=False,
    Limit=1
  )
  items = db_response.get('Items', [])
  return items[0] if items else None

@app.patch("/queries/{id}")
async def query_feedback (badAnswer: bool):
  # TODO: dynamoDB integration
  body = {
    "id": "",
    "sessionId": "",
    "question": "",
    "answer": "",
    "badAnswer": badAnswer,
    "createdAt": "",
    "queriedAt": ""
  }
  return body

handler = mangum.Mangum(app, lifespan="off")

if __name__ == "__main__":
  uvicorn.run(
    "main:app",
    host="0.0.0.0",
    port=8080,
    log_level=os.getenv("LOG_LEVEL", "info")
  )
