from src.modules.create_vector_index import create_vector_index
from src.modules.logger import get_logger

LOGGER = get_logger(__name__)


def ping(payload):
    return {"statusCode": 200, "result": "pong"}


def lambda_handler(event, context):
    LOGGER.debug(f"- - - - - - - - event: {event}")

    operation_name = event.get("operation")
    payload = event.get("payload")

    LOGGER.debug(
        f"- - - - - - - - Received operation: {operation_name} with payload: {payload}"
    )

    match operation_name:
        case "ping":
            result = ping(payload)
        case "create_vector_index":
            result = create_vector_index()
        case _:
            return {"statusCode": 400, "error": "Invalid operation"}

    return {"statusCode": 200, "result": result}
