from botocore.exceptions import BotoCoreError, ClientError
from boto3.dynamodb.conditions import Key
from decimal import Decimal
from fastapi import APIRouter, Header, HTTPException
from typing import Annotated
from src.app.models import QueryFeedback, tables
from src.app.chatbot_init import chatbot
from src.app.sessions import current_user_id, add_langfuse_score_query

router = APIRouter()


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

    try:
        if query.feedback:
            add_langfuse_score_query(query_id=id, query_feedback=query)

            if query.feedback.user_response_relevancy is None:
                query.feedback.user_response_relevancy = 0

            query.feedback.user_response_relevancy = Decimal(
                str(query.feedback.user_response_relevancy)
            )

            if query.feedback.user_faithfullness is None:
                query.feedback.user_faithfullness = 0

            query.feedback.user_faithfullness = Decimal(
                str(query.feedback.user_faithfullness)
            )

            feedback = query.feedback.model_dump()
            feedback["user_comment"] = chatbot.mask_pii(feedback["user_comment"])

            dbResponse = tables["queries"].update_item(
                Key={"sessionId": sessionId, "id": id},
                UpdateExpression="SET #badAnswer = :badAnswer, #feedback = :feedback",
                ExpressionAttributeNames={
                    "#badAnswer": "badAnswer",
                    "#feedback": "feedback",
                },
                ExpressionAttributeValues={
                    ":badAnswer": query.badAnswer,
                    ":feedback": feedback,
                },
                ReturnValues="ALL_NEW",
            )

        else:
            dbResponse = tables["queries"].update_item(
                Key={"sessionId": sessionId, "id": id},
                UpdateExpression="SET #badAnswer = :badAnswer",
                ExpressionAttributeNames={"#badAnswer": "badAnswer"},
                ExpressionAttributeValues={":badAnswer": query.badAnswer},
                ReturnValues="ALL_NEW",
            )

    except (BotoCoreError, ClientError) as e:
        raise HTTPException(
            status_code=422,
            detail=(f"[query_feedback] id: {id} sessionId: {sessionId}, error: {e}"),
        )

    if "Attributes" in dbResponse:
        return dbResponse.get("Attributes")
    else:
        raise HTTPException(status_code=404, detail="Record not found")
