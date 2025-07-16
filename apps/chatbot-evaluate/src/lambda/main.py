from src.modules.evaluate import evaluate
from src.modules.logger import get_logger

LOGGER = get_logger(__name__)


def ping(payload):
    return {"statusCode": 200, "result": "pong"}


def lambda_handler(event, context):
    LOGGER.debug(f"- - - - - - - - event: {event}")

    result = evaluate(
        query_str=event.get("query_str", ""),
        response_str=event.get("response_str", ""),
        retrieved_context=event.get("retrieved_context", []),
        trace_id=event.get("trace_id", ""),
        messages=event.get("messages", None),
    )

    return {"statusCode": 200, "result": result}
