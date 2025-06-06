from logging import getLogger
from boto3.dynamodb.conditions import Key

logger = getLogger(__name__)


def clear_empty_sessions() -> None:
    """
    Clear all sessions without queries from the database.
    """
    from src.app.models import tables

    items = []
    last_evaluated_key = None
    page_size = 200
    while True:
        if last_evaluated_key:
            response = tables["sessions"].scan(
                ExclusiveStartKey=last_evaluated_key,
                Limit=page_size
            )
        else:
            response = tables["sessions"].scan(
                Limit=page_size
            )
        items.extend(response.get("Items", []))
        last_evaluated_key = response.get("LastEvaluatedKey")

        if not last_evaluated_key:
            break

    for item in items:
        session_id = item["sessionId"]
        queries_response = tables["queries"].query(
            KeyConditionExpression=Key("sessionId").eq(session_id),
            Select="COUNT"
        )
        query_count = queries_response["Count"]

        if query_count == 0:
            logger.info(f"Deleting empty session: {session_id}")
            tables["sessions"].delete_item(Key={"sessionId": session_id})

    logger.info("Cleared all empty sessions.")


if __name__ == "__main__":
    clear_empty_sessions()