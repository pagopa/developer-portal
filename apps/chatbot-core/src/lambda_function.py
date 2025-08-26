from src.modules.chatbot import Chatbot
from src.modules.logger import get_logger

LOGGER = get_logger(__name__)

chatbot = Chatbot()


def lambda_handler(event, context):
    LOGGER.debug(f"event: {event}")

    operation_name = event.get("operation")
    payload = event.get("payload")

    match operation_name:
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
        case _:
            return {"statusCode": 400, "error": "Invalid operation"}

    return {"statusCode": 200, "result": result, "event": event}
