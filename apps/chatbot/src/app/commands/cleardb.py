from logging import getLogger
from boto3.dynamodb.conditions import Key

logger = getLogger(__name__)


def clear_empty_sessions() -> None:
    """
    Clear all empty sessions from the database.
    An empty session is defined as one that has no queries associated with it.
    """
    from src.app.models import tables

    response = tables["sessions"].scan()
    items = response.get("Items", [])

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