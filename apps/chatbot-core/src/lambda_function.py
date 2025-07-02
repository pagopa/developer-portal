from src.modules.logger import get_logger
from src.chatbot_init import chatbot

LOGGER = get_logger(__name__)


def ping(payload):
    return {"statusCode": 200, "result": "pong"}


def lambda_handler(event, context):
    operations = {
        "ping": ping,
        "chat_generate": chatbot.chat_generate,
        "get_final_response": chatbot.get_final_response,
    }
    LOGGER.debug(f"- - - - - - - - event: {event}")

    operation_name = event.get("operation")
    payload = event.get("payload")

    LOGGER.debug(
        f"- - - - - - - - Received operation: {operation_name} with payload: {payload}"
    )
    print(
        f"- - - - - - - - Received operation: {operation_name} with payload: {payload}"
    )

    match operation_name:
        case "ping":
            result = ping(payload)
        case "chat_generate":
            # TODO: validate payload
            result = chatbot.chat_generate(
                query_str=payload.get("query_str", ""),
                trace_id=payload.get("trace_id", ""),
                session_id=payload.get("session_id", None),
                user_id=payload.get("user_id", None),
                messages=payload.get("messages", None),
            )
        case "get_final_response":
            result = chatbot.get_final_response(
                trace_id=payload.get("trace_id", ""),
                session_id=payload.get("session_id", None),
                user_id=payload.get("user_id", None),
            )
        case _:
            return {"statusCode": 400, "error": "Invalid operation"}

    return {"statusCode": 200, "result": result}
