from src.chatbot_init import chatbot
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
        case "chat_generate":
            # TODO: validate payload
            result = chatbot.chat_generate_with_final_response(
                query_str=payload.get("query_str", ""),
                trace_id=payload.get("trace_id", ""),
                session_id=payload.get("session_id", None),
                user_id=payload.get("user_id", None),
                messages=payload.get("messages", None),
            )
        case "mask_pii":
            result = chatbot.mask_pii(payload.get("string", ""))
        case "evaluate":
            result = chatbot.evaluate(
                evaluation_data=payload.get("evaluation_data", {})
            )
        case _:
            return {"statusCode": 400, "error": "Invalid operation"}

    return {"statusCode": 200, "result": result}
