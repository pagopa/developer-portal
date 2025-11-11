import datetime
import nh3
import json
import uuid
from botocore.exceptions import BotoCoreError, ClientError
from boto3.dynamodb.conditions import Key
from fastapi import APIRouter, Header, HTTPException
from typing import List, Annotated
from src.app.sqs_init import sqs_queue_evaluate
from src.app.models import Query, tables
from src.modules.logger import get_logger
from src.app.sessions import (
    current_user_id,
    find_or_create_session,
    session_salt,
    hash_func,
    last_session_id,
    get_user_session,
)
from src.app.chatbot_init import chatbot
from src.modules.settings import SETTINGS

LOGGER = get_logger(__name__)
router = APIRouter()


def can_evaluate() -> bool:
    """
    Decide whether to evaluate the query or not.
    This is based on the amount of daily query
    """
    max_daily_evaluations = SETTINGS.max_daily_evaluations
    result = count_queries_created_today() < max_daily_evaluations
    return result


def count_queries_created_today() -> int:
    today = datetime.datetime.now(datetime.timezone.utc).date().isoformat()

    response = tables["queries"].query(
        IndexName="QueriesByCreatedAtDateIndex",
        KeyConditionExpression=Key("createdAtDate").eq(today),
        Select="COUNT",
    )

    return response["Count"]


def backfill_created_at_date() -> None:
    """
    Backfill the `createdAtDate` field for all existing items in the table.
    """

    items = []
    last_evaluated_key = None
    page_size = 200
    while True:
        if last_evaluated_key:
            response = tables["queries"].scan(
                ExclusiveStartKey=last_evaluated_key, Limit=page_size
            )
        else:
            response = tables["queries"].scan(Limit=page_size)
        items.extend(response.get("Items", []))
        last_evaluated_key = response.get("LastEvaluatedKey")

        if not last_evaluated_key:
            break

    for item in items:
        created_at_date = item["createdAt"][:10]
        item["createdAtDate"] = created_at_date

        tables["queries"].put_item(Item=item)

    LOGGER.info(f"Backfilled {len(items)} items with `createdAtDate`.")


def fix_unbalanced_code_blocks(text: str) -> str:
    """
    Ensures code blocks delimited by \n``` are balanced.
    If unbalanced, removes the last dangling delimiter.
    """
    count = text.count("\n```")
    if count % 2 == 1:  # unbalanced
        last_index = text.rfind("\n```")
        if last_index != -1:
            text = text[:last_index] + text[last_index + 4 :]
    return text


def get_final_response(response_str: str, references: List[str]) -> str:

    response_str = fix_unbalanced_code_blocks(response_str)
    unique_references = list(dict.fromkeys(references))

    if len(unique_references) > 0:
        response_str += "\n\nRif:"
        for ref in unique_references:
            response_str += "\n" + ref

    return response_str


def prepare_body_to_save(
    bodyToReturn: dict,
    query: Query,
    answer_json: dict,
    now: datetime,
) -> dict:

    days = SETTINGS.expire_days
    expires_at = int((now + datetime.timedelta(days=days)).timestamp())

    bodyToSave = bodyToReturn.copy()
    bodyToSave["question"] = chatbot.mask_pii(query.question)
    bodyToSave["answer"] = get_final_response(
        response_str=chatbot.mask_pii(answer_json["response"]),
        references=answer_json["references"],
    )
    bodyToSave["topics"] = answer_json.get("products", [])
    bodyToSave["expiresAt"] = expires_at

    return bodyToSave


def prepare_body_to_return(
    query: Query, 
    session: dict | None,
    answer: str, 
    trace_id: str, 
    now: datetime
) -> dict:

    if query.queriedAt is None:
        queriedAt = now.isoformat()
    else:
        queriedAt = query.queriedAt

    createdAt = now.isoformat()
    createdAtDate = createdAt[:10]
    bodyToReturn = {
        "id": trace_id,
        "sessionId": session["id"],
        "question": query.question,
        "answer": answer,
        "createdAt": createdAt,
        "createdAtDate": createdAtDate,
        "queriedAt": queriedAt,
        "badAnswer": False,
    }

    return bodyToReturn


def evaluate_query(
    query_str: str,
    answer: str,
    answer_json: dict,
    trace_id: str,
    messages: List[dict],
) -> None:
    if can_evaluate():
        evaluation_data = {
            "query_str": query_str,
            "response_str": answer,
            "retrieved_contexts": answer_json["contexts"],
            "trace_id": trace_id,
            "messages": messages,
        }
        if sqs_queue_evaluate is None:
            LOGGER.warning(
                f"sqs_queue_evaluate is None, cannot send message {evaluation_data}"
            )
        else:
            sqs_response = sqs_queue_evaluate.send_message(
                MessageBody=json.dumps(evaluation_data),
                MessageGroupId=trace_id,  # Required for FIFO queues
            )
            LOGGER.info(f"sqs response: {sqs_response}")
    else:
        LOGGER.info(f"Skipping evaluation due to daily limit reached ({SETTINGS.max_daily_evaluations})")


def save_query(bodyToSave: dict) -> None:
    tables["queries"].put_item(Item=bodyToSave)


@router.post("/queries")
async def query_creation(
    query: Query,
    authorization: Annotated[str | None, Header()] = None,
):

    now = datetime.datetime.now(datetime.UTC)
    trace_id = str(uuid.uuid4())
    userId = current_user_id(authorization)
    session = find_or_create_session(userId, now=now)
    salt = session_salt(session["id"])
    query_str = nh3.clean(query.question)
    user_id = hash_func(userId, salt)
    messages = [item.model_dump() for item in query.history] if query.history else None

    answer_json = await chatbot.chat_generate(
        query_str=query_str,
        trace_id=trace_id,
        session_id=session["id"],
        user_id=user_id,
        messages=messages,
    )
    answer = get_final_response(
        response_str=answer_json["response"],
        references=answer_json["references"],
    )
    
    evaluate_query(
        query_str=query_str,
        answer=answer,
        answer_json=answer_json,
        trace_id=trace_id,
        messages=messages,
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
    
    try:
        save_query(bodyToSave=bodyToSave)
    except (BotoCoreError, ClientError) as e:
        raise HTTPException(status_code=422, detail=f"[POST /queries] error: {e}")
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

