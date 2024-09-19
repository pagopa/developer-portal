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
chatbot = Chatbot(params, prompts)

AWS_DEFAULT_REGION = os.getenv('CHB_AWS_DEFAULT_REGION', os.getenv('AWS_DEFAULT_REGION', None))

class Query(BaseModel):
  question: str
  queriedAt: str | None = None

if (os.getenv('environment', 'dev') == 'local'):
  profile_name='dummy'
  endpoint_url='http://localhost:8000'
  region_name = AWS_DEFAULT_REGION

boto3_session = boto3.session.Session(
  profile_name = locals().get('profile_name', None),
  region_name=locals().get('region_name', None)
)

dynamodb = boto3_session.resource(    
  'dynamodb',
  endpoint_url=locals().get('endpoint_url', None),
  region_name=locals().get('region_name', None),
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
  authorizationHeader: Annotated[str | None, Header()] = None
):
  userId = current_user_id(authorizationHeader)
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


def current_user_id(authorizationHeader: str):
  if authorizationHeader is None:
    # TODO remove fake user and return None
    # return None
    return '-'
  else:
    token = authorizationHeader.split(' ')[1]
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
  authorizationHeader: Annotated[str | None, Header()] = None
):
  userId = current_user_id(authorizationHeader)

  try:
    db_response = table_sessions.query(
      KeyConditionExpression=Key("userId").eq(userId)
    )
  except (BotoCoreError, ClientError) as e:
    raise HTTPException(status_code=422, detail=f"[sessions_fetching] userId: {userId}, error: {e}")
  return db_response['Items']

@app.get("/queries")
async def queries_fetching(
  sessionId: str | None = None,
  authorizationHeader: Annotated[str | None, Header()] = None
):
  userId = current_user_id(authorizationHeader)
  if sessionId is None:
    sessionId = last_session_id(userId)

  try:
    # TODO: add userId filter
    db_response = table_queries.query(
      KeyConditionExpression=Key("sessionId").eq(sessionId)
    )
  except (BotoCoreError, ClientError) as e:
    raise HTTPException(status_code=422, detail=f"[queries_fetching] sessionId: {sessionId}, error: {e}")
  return db_response['Items']


def last_session_id(userId: str):
  # TODO: retrieve last user session
  return '1'


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
