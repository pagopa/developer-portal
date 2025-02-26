import os
import yaml
import mangum
import uvicorn
import logging
import json
import hashlib
import uuid
import boto3
import datetime
import nh3
import time
from jose import jwk, jwt
from jose.utils import base64url_decode
from typing import Annotated, List
from boto3.dynamodb.conditions import Key
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import FastAPI, HTTPException, Header
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from urllib.request import Request, urlopen

from src.modules.chatbot import Chatbot

logging.basicConfig(level=logging.INFO)
params = yaml.safe_load(open("config/params.yaml", "r"))
prompts = yaml.safe_load(open("config/prompts.yaml", "r"))
AWS_DEFAULT_REGION = os.getenv('CHB_AWS_DEFAULT_REGION', os.getenv('AWS_DEFAULT_REGION', None))
ENVIRONMENT = os.getenv('environment', 'dev')
AUTH_COGNITO_USERPOOL_ID = os.getenv('AUTH_COGNITO_USERPOOL_ID')
AUTH_COGNITO_CLIENT_ID = os.getenv('AUTH_COGNITO_CLIENT_ID')

chatbot = Chatbot(params, prompts)


class QueryFromThePast(BaseModel):
  id: str | None = None
  question: str = Field(max_length=800)
  answer: str | None = None

class Query(BaseModel):
  question: str = Field(max_length=800)
  queriedAt: str | None = None
  history: List[QueryFromThePast] | None = None

class QueryFeedback(BaseModel):
  badAnswer: bool

boto3_session = boto3.session.Session(
  region_name=AWS_DEFAULT_REGION
)

# endpoint_url is set by AWS_ENDPOINT_URL_DYNAMODB
if (ENVIRONMENT in ['local', 'test']):
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
table_salts = dynamodb.Table(
  f"{os.getenv('CHB_QUERY_TABLE_PREFIX', 'chatbot')}-salts"
)

app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=json.loads(os.getenv("CORS_DOMAINS", "[\"*\"]")),
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

def hash_func(user_id: str, salt: str) -> str:
  salted_user_id = user_id + salt
  return hashlib.sha256(salted_user_id.encode()).hexdigest()

@app.get("/healthz")
async def healthz ():
  return {"message": "OK"}

@app.post("/queries")
async def query_creation (
  query: Query, 
  authorization: Annotated[str | None, Header()] = None
):
  now = datetime.datetime.now(datetime.UTC)
  trace_id = str(uuid.uuid4())
  userId = current_user_id(authorization)
  session = find_or_create_session(userId, now=now)
  salt = session_salt(session['id'])

  answer = chatbot.chat_generate(
    query_str = nh3.clean(query.question),
    messages = [item.dict() for item in query.history] if query.history else None,
    trace_id = trace_id,
    user_id = hash_func(userId, salt),
    session_id = session["id"]
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
    table_queries.put_item(Item = bodyToSave)
  except (BotoCoreError, ClientError) as e:
    raise HTTPException(status_code=422, detail=f"[POST /queries] error: {e}")
  return bodyToReturn

def get_token_public_key(token: str):
  if ENVIRONMENT == 'test':
    KEYS_URL = f"http://motoserver:3001/userpoolid/.well-known/jwks.json"
    req = Request(KEYS_URL)
    # https://github.com/getmoto/moto/issues/5225
    req.add_header('Authorization', 'AWS4-HMAC-SHA256 Credential=mock_access_key/20220524/us-east-1/cognito-idp/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-date, Signature=asdf')
    # response: 
    # {"keys": [{"alg": "RS256", "e": "AQAB", "kid": "dummy", "kty": "RSA", "n": "j1pT3xKbswmMySvCefmiD3mfDaRFpZ9Y3Jl4fF0hMaCRVAt_e0yR7BeueDfqmj_NhVSO0WB5ao5e8V-9RFQOtK8SrqKl3i01-CyWYPICwybaGKhbJJR0S_6cZ8n5kscF1MjpIlsJcCzm-yKgTc3Mxk6KtrLoNgRvMwGLeHUXPkhS9YHfDKRe864iMFOK4df69brIYEICG2VLduh0hXYa0i-J3drwm7vxNdX7pVpCDu34qJtYoWq6CXt3Tzfi3YfWp8cFjGNbaDa3WnCd2IXpp0TFsFS-cEsw5rJjSl5OllJGeZKBtLeyVTy9PYwnk7MW43WSYeYstbk9NluX4H8Iuw", "use": "sig"}]}
    response = urlopen(req).read()
  else:
    KEYS_URL = f"https://cognito-idp.{AWS_DEFAULT_REGION}.amazonaws.com/{AWS_DEFAULT_REGION}_{AUTH_COGNITO_USERPOOL_ID}/.well-known/jwks.json"
    req = Request(KEYS_URL)
    response = urlopen(req).read()
  
  keys = json.loads(response.decode('utf-8'))['keys']
  headers = jwt.get_unverified_headers(token)
  kid = headers['kid']
  # search for the kid in the downloaded public keys
  key_index = -1
  for i in range(len(keys)):
    if kid == keys[i]['kid']:
      key_index = i
      break
  if key_index == -1:
    # Public key not found in jwks.json
    return False

  # construct the public key
  public_key = jwk.construct(keys[key_index])

  return public_key

def decode_token(token: str):
  # https://github.com/awslabs/aws-support-tools/blob/master/Cognito/decode-verify-jwt/decode-verify-jwt.py
  public_key = get_token_public_key(token)
  if public_key is False:
    return False
  # get the last two sections of the token,
  # message and signature (encoded in base64)
  message, encoded_signature = str(token).rsplit('.', 1)
  # decode the signature
  decoded_signature = base64url_decode(encoded_signature.encode('utf-8'))
  # verify the signature
  if not public_key.verify(message.encode("utf8"), decoded_signature):
    # Signature verification failed
    return False
  # Signature successfully verified

  # since we passed the verification, we can now safely
  # use the unverified claims
  claims = jwt.get_unverified_claims(token)
  # additionally we can verify the token expiration
  if time.time() > claims['exp']:
    # Token is expired
    return False
  # now we can use the claims
  return claims

def current_user_id(authorization: str) -> str:
  if authorization is None:
    return None
  else:
    token = authorization.split(' ')[1]
#    decoded = jwt.decode(
#      token, 
#      algorithms=["RS256"], 
#      options={"verify_signature": False}
#    )
    decoded = decode_token(token)
    if decoded is False:
      return None
    else:
      if "cognito:username" in decoded:
        return decoded['cognito:username']
      else:
        return decoded['username']


def find_or_create_session(userId: str, now: datetime.datetime):
  if userId is None:
    return None
  
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
      create_session_record(body)
    except (BotoCoreError, ClientError) as e:
      raise HTTPException(status_code=422, detail=f"[find_or_create_session] body: {body}, error: {e}")

  else:
    body = items[0]

  return body

def create_session_record(body: dict):
  saltValue = str(uuid.uuid4())
  saltBody = {
    'sessionId': body['id'],
    'value': saltValue
  }
  # TODO: transaction https://github.com/boto/boto3/pull/4010
  table_sessions.put_item(Item = body)
  table_salts.put_item(Item = saltBody)

def session_salt(sessionId: str):
  try:
    dbResponse = table_salts.query(
      KeyConditionExpression=Key("sessionId").eq(sessionId)
    )
  except (BotoCoreError, ClientError) as e:
    raise HTTPException(status_code=422, detail=f"[salts_fetching] sessionId: {sessionId}, error: {e}")
  result = dbResponse.get('Items', [])
  if len(result) == 0:
    result = None
  else:
    result = result[0]
  return result.get('value', None)


@app.get("/queries")
async def queries_fetching(
  sessionId: str | None = None,
  page: int | None = 1,
  pageSize: int | None = 10,
  authorization: Annotated[str | None, Header()] = None
):
  userId = current_user_id(authorization)
  
  if userId is None:
    raise HTTPException(status_code=401, detail="Unauthorized")

  if sessionId is None:
    sessionId = last_session_id(userId)
  else:
    session = get_user_session(userId, sessionId)
    sessionId = session.get('id', None)

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
    # with table_sessions.batch_writer() as batch:
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

def get_user_session(userId: str, sessionId: str):
  dbResponse = table_sessions.get_item(
    Key={
     "userId": userId,
     "id": sessionId
    }
  )
  item = dbResponse.get('Item')
  return item if item else None

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
    
    chatbot.add_langfuse_score(
      trace_id = id,
      name = 'user-feedback',
      value = (-1 if query.badAnswer else 1),
      data_type = 'NUMERIC'
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
