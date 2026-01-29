from botocore.exceptions import BotoCoreError, ClientError
from boto3.dynamodb.conditions import Key
from decimal import Decimal
from fastapi import APIRouter, Header, HTTPException
from typing import Annotated

from src.app.models import QueryFeedback, tables
from src.app.sessions import current_user_id, add_langfuse_score_query

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS

router = APIRouter()

LOGGER = get_logger(__name__, level=SETTINGS.log_level)


# retrieve sessions of current user
@router.get("/sessions")
async def sessions_fetching(
    page: int = 1,
    pageSize: int = 10,
    authorization: Annotated[str | None, Header()] = None,
):
    userId = current_user_id(authorization)

    try:
        dbResponse = tables["sessions"].query(
            KeyConditionExpression=Key("userId").eq(userId),
            IndexName="SessionsByCreatedAtIndex",
            ScanIndexForward=False,
        )
    except (BotoCoreError, ClientError) as e:
        raise HTTPException(
            status_code=422, detail=f"[sessions_fetching] userId: {userId}, error: {e}"
        )

    # TODO: pagination
    items = dbResponse.get("Items", [])
    result = {
        "items": items,
        "page": 1,
        "pages": 1,
        "size": len(items),
        "total": len(items),
    }
    return result


@router.delete("/sessions/{id}")
async def session_delete(
    id: str, authorization: Annotated[str | None, Header()] = None
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
        for query in dbResponse_queries["Items"]:
            tables["queries"].delete_item(Key={"id": query["id"], "sessionId": id})

        tables["sessions"].delete_item(
            Key={
                "id": id,
                "userId": userId,
            }
        )

    except (BotoCoreError, ClientError) as e:
        raise HTTPException(
            status_code=422, detail=f"[sessions_delete] userId: {userId}, error: {e}"
        )

    return body


@router.patch("/sessions/{sessionId}/queries/{id}")
async def query_feedback(
    id: str,
    sessionId: str,
    query: QueryFeedback,
    authorization: Annotated[str | None, Header()] = None,
):

    feedback = None
    if query.feedback:
        if query.feedback.user_response_relevancy is None:
            query.feedback.user_response_relevancy = Decimal("0")

        query.feedback.user_response_relevancy = Decimal(
            str(query.feedback.user_response_relevancy)
        )

        if query.feedback.user_faithfullness is None:
            query.feedback.user_faithfullness = Decimal("0")

        query.feedback.user_faithfullness = Decimal(
            str(query.feedback.user_faithfullness)
        )

        feedback = query.feedback.model_dump()

        # Convert Decimal values to float for JSON serialization
        if (
            "user_response_relevancy" in feedback
            and feedback["user_response_relevancy"] is not None
        ):
            feedback["user_response_relevancy"] = float(
                feedback["user_response_relevancy"]
            )
        if (
            "user_faithfullness" in feedback
            and feedback["user_faithfullness"] is not None
        ):
            feedback["user_faithfullness"] = float(feedback["user_faithfullness"])

    query_for_database = {
        "id": id,
        "sessionId": sessionId,
        "badAnswer": query.badAnswer,
        "feedback": feedback,
    }
    add_langfuse_score_query(
        query_id=id, query_feedback=query, query_for_database=query_for_database
    )

    return {
        "id": id,
        "sessionId": sessionId,
        "badAnswer": query.badAnswer,
        "feedback": feedback,
    }
