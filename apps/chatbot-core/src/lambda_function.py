from src.modules.chatbot import Chatbot
from src.modules.logger import get_logger

LOGGER = get_logger(__name__)

chatbot = Chatbot()


def lambda_handler(event, context):

    operation_name = event.get("operation")
    # TODO: validate payload
    payload = event.get("payload")

    match operation_name:
        case "chat_generate":
            # response_json = {
            #     "response": "Scusa, non posso elaborare la tua richiesta.\n"
            #     + "Prova a formulare una nuova domanda.",
            #     "products": ["none"],
            #     "references": [],
            #     "contexts": [],
            # }
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
