import datetime
import hashlib
import os
import uuid
import yaml

from boto3.dynamodb.conditions import Key
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import HTTPException

from src.modules.logger import get_logger
from src.app.models import QueryFeedback, tables
from src.app.jwt_check import verify_jwt

# params = yaml.safe_load(open("config/params.yaml", "r"))
#  prompts = yaml.safe_load(open("config/prompts.yaml", "r"))
# chatbot = Chatbot(params, prompts)

LOGGER = get_logger(__name__)


def current_user_id(authorization: str | None) -> str:
    if authorization is None:
        LOGGER.error("[current_user_id] Authorization header is missing, exit with 401")
        raise HTTPException(status_code=401, detail="Unauthorized")
    else:
        token = authorization.split(" ")[1]
        decoded = verify_jwt(token)
        if decoded is False:
            LOGGER.error("[current_user_id] decoded is false, exit with 401")
            raise HTTPException(status_code=401, detail="Unauthorized")
        else:
            if "cognito:username" in decoded:
                return decoded["cognito:username"]
            else:
                return decoded["username"]


def find_or_create_session(userId: str, now: datetime.datetime):
    if userId is None:
        return None

    SESSION_MAX_DURATION_DAYS = float(os.getenv("CHB_SESSION_MAX_DURATION_DAYS", "1"))
    datetimeLimit = now - datetime.timedelta(SESSION_MAX_DURATION_DAYS - 1)
    startOfDay = datetime.datetime.combine(datetimeLimit, datetime.time.min)
    # trovare una sessione con createdAt > datetimeLimit
    try:
        dbResponse = tables["sessions"].query(
            KeyConditionExpression=Key("userId").eq(userId)
            & Key("createdAt").gt(startOfDay.isoformat()),
            IndexName="SessionsByCreatedAtIndex",
            ScanIndexForward=False,
            Limit=1,
        )
    except (BotoCoreError, ClientError) as e:
        raise HTTPException(
            status_code=422,
            detail=f"[find_or_create_session] userId: {userId}, error: {e}",
        )

    items = dbResponse.get("Items", [])
    if len(items) == 0:
        body = {
            "id": f"{uuid.uuid4()}",
            "title": now.strftime("%Y-%m-%d"),
            "userId": userId,
            "createdAt": now.isoformat(),
        }
        try:
            create_session_record(body)
        except (BotoCoreError, ClientError) as e:
            raise HTTPException(
                status_code=422,
                detail=f"[find_or_create_session] body: {body}, error: {e}",
            )

    else:
        body = items[0]

    return body


def create_session_record(body: dict):
    saltValue = str(uuid.uuid4())
    saltBody = {"sessionId": body["id"], "value": saltValue}
    # TODO: transaction https://github.com/boto/boto3/pull/4010
    tables["sessions"].put_item(Item=body)
    tables["salts"].put_item(Item=saltBody)


def session_salt(sessionId: str):
    try:
        dbResponse = tables["salts"].query(
            KeyConditionExpression=Key("sessionId").eq(sessionId)
        )
    except (BotoCoreError, ClientError) as e:
        raise HTTPException(
            status_code=422,
            detail=f"[salts_fetching] sessionId: {sessionId}, error: {e}",
        )
    result = dbResponse.get("Items", [])
    if len(result) == 0:
        result = None
    else:
        result = result[0]
    return result.get("value", None)


def hash_func(user_id: str, salt: str) -> str:
    salted_user_id = user_id + salt
    return hashlib.sha256(salted_user_id.encode()).hexdigest()


def last_session_id(userId: str):
    dbResponse = tables["sessions"].query(
        IndexName="SessionsByCreatedAtIndex",
        KeyConditionExpression=Key("userId").eq(userId),
        ScanIndexForward=False,
        Limit=1,
    )
    items = dbResponse.get("Items", [])
    return items[0].get("id", None) if items else None


def get_user_session(userId: str, sessionId: str):
    dbResponse = tables["sessions"].get_item(Key={"userId": userId, "id": sessionId})
    item = dbResponse.get("Item")
    return item if item else None


def add_langfuse_score_query(query_id: str, query_feedback: QueryFeedback):
    if query_feedback.badAnswer is not None:
        bad_answer = -1 if query_feedback.badAnswer else 0
        add_langfuse_score(
            trace_id=query_id,
            name="user-feedback",
            value=bad_answer,
            comment=query_feedback.feedback.user_comment,
            data_type="NUMERIC",
        )

    if query_feedback.feedback.user_response_relevancy is not None:
        add_langfuse_score(
            trace_id=query_id,
            name="user-response-relevancy",
            value=float(query_feedback.feedback.user_response_relevancy),
            data_type="NUMERIC",
        )

    if query_feedback.feedback.user_faithfullness is not None:
        add_langfuse_score(
            trace_id=query_id,
            name="user-faithfullness",
            value=float(query_feedback.feedback.user_faithfullness),
            data_type="NUMERIC",
        )
