import boto3
import requests

from logging import getLogger

from src.modules.settings import SETTINGS

logger = getLogger(__name__)
lambda_client = boto3.client("lambda", region_name=SETTINGS.aws_default_region)


def chatbot_generate(payload: dict) -> dict:
    lambda_event = {
        "operation": "chat_generate",
        "payload": payload,
    }
    if SETTINGS.chatbot_generate_lambda_name == "local":
        response = requests.post(
            "http://core:8080/2015-03-31/functions/function/invocations",
            json=lambda_event,
        )
        logger.info(f"[calls] lambda generate response={response}")
        response_json = response.json()
        response = response_json["result"]
    else:
        response = lambda_client.invoke(
            FunctionName=SETTINGS.chatbot_generate_lambda_name,
            InvocationType="Event",
            Payload=bytes(str(lambda_event), encoding="utf-8"),
        )

    return response


def chatbot_mask_pii(string: str) -> str:
    lambda_event = {
        "operation": "mask_pii",
        "payload": {
            "string": string,
        },
    }
    if SETTINGS.chatbot_mask_pii_lambda_name == "local":
        response = requests.post(
            "http://core:8080/2015-03-31/functions/function/invocations",
            json=lambda_event,
        )
        logger.info(f"[calls] lambda mask_pii response={response.json()}")
        response_json = response.json()
        response = response_json["result"]
    else:
        response = lambda_client.invoke(
            FunctionName=SETTINGS.chatbot_mask_pii_lambda_name,
            InvocationType="Event",
            Payload=bytes(str(lambda_event), encoding="utf-8"),
        )

    return response
