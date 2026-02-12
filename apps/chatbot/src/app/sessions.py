import datetime
import hashlib
import uuid
import json

from boto3.dynamodb.conditions import Key
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import HTTPException

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS
from src.modules.codec import compress_payload
from src.app.sqs_init import sqs_queue_monitor
from src.app.models import QueryFeedback, tables
from src.app.jwt_check import verify_jwt


LOGGER = get_logger(__name__, level=SETTINGS.log_level)


def current_user_id(authorization: str | None = None) -> str:
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


def find_or_create_session(userId: str, now: datetime.datetime) -> dict | None:
    if userId is None:
        return None

    datetimeLimit = now - datetime.timedelta(SETTINGS.session_max_duration_days - 1)
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
        days = SETTINGS.expire_days
        expires_at = int((now + datetime.timedelta(days=days)).timestamp())

        body = {
            "id": f"{uuid.uuid4()}",
            "title": now.strftime("%Y-%m-%d"),
            "userId": userId,
            "createdAt": now.isoformat(),
            "expiresAt": expires_at,
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


def create_session_record(body: dict) -> None:
    saltValue = str(uuid.uuid4())
    saltBody = {
        "sessionId": body["id"],
        "value": saltValue,
        "expiresAt": body["expiresAt"],
    }
    # TODO: transaction https://github.com/boto/boto3/pull/4010
    tables["sessions"].put_item(Item=body)
    tables["salts"].put_item(Item=saltBody)


def session_salt(sessionId: str) -> str | None:
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


def last_session_id(userId: str) -> str | None:
    dbResponse = tables["sessions"].query(
        IndexName="SessionsByCreatedAtIndex",
        KeyConditionExpression=Key("userId").eq(userId),
        ScanIndexForward=False,
        Limit=1,
    )
    items = dbResponse.get("Items", [])
    return items[0].get("id", None) if items else None


def get_user_session(userId: str, sessionId: str) -> dict | None:
    dbResponse = tables["sessions"].get_item(Key={"userId": userId, "id": sessionId})
    item = dbResponse.get("Item")
    return item if item else None


def add_langfuse_score_query(
    query_id: str, query_feedback: QueryFeedback, query_for_database: dict
) -> None:

    if query_feedback.badAnswer is not None:
        bad_answer = -1 if query_feedback.badAnswer else 0
        comment = (
            query_feedback.feedback.user_comment if query_feedback.feedback else None
        )
        payload = {
            "operation": "add_scores",
            "data": compress_payload(
                {
                    "trace_id": query_id,
                    "name": "user-feedback",
                    "score": bad_answer,
                    "comment": comment,
                    "data_type": "NUMERIC",
                    "query_for_database": query_for_database,
                }
            ),
        }
        sqs_response = sqs_queue_monitor.send_message(
            MessageBody=json.dumps(payload),
            MessageGroupId=query_id,
        )
        LOGGER.info(
            f"sqs response query_feedback.feedback.user_comment: {sqs_response[:100]}..."
        )

    if (
        query_feedback.feedback
        and query_feedback.feedback.user_response_relevancy is not None
    ):

        payload = {
            "operation": "add_scores",
            "data": compress_payload(
                {
                    "trace_id": query_id,
                    "name": "user-response-relevancy",
                    "score": float(query_feedback.feedback.user_response_relevancy),
                    "comment": None,
                    "data_type": "NUMERIC",
                    "query_for_database": query_for_database,
                }
            ),
        }
        sqs_response = sqs_queue_monitor.send_message(
            MessageBody=json.dumps(payload),
            MessageGroupId=query_id,
        )
        LOGGER.info(
            f"sqs response query_feedback.feedback.user_response_relevancy: {sqs_response[:100]}..."
        )

    if (
        query_feedback.feedback
        and query_feedback.feedback.user_faithfullness is not None
    ):

        payload = {
            "operation": "add_scores",
            "data": compress_payload(
                {
                    "trace_id": query_id,
                    "name": "user-faithfullness",
                    "score": float(query_feedback.feedback.user_faithfullness),
                    "comment": None,
                    "data_type": "NUMERIC",
                    "query_for_database": query_for_database,
                }
            ),
        }
        sqs_response = sqs_queue_monitor.send_message(
            MessageBody=json.dumps(payload),
            MessageGroupId=query_id,
        )
        LOGGER.info(
            f"sqs response query_feedback.feedback.user_faithfullness: {sqs_response[:100]}..."
        )
