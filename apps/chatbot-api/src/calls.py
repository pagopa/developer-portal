import boto3
import os
import requests

from logging import getLogger
from src.app.models import AWS_DEFAULT_REGION

logger = getLogger(__name__)
lambda_client = boto3.client("lambda", region_name=AWS_DEFAULT_REGION)


def chatbot_generate(lambda_event: dict) -> dict:
    if os.getenv("CHB_CHATBOT_GENERATE_LAMBDA_NAME") is None:
        response = requests.post(
            "http://core:8080/2015-03-31/functions/function/invocations",
            json=lambda_event,
        )
        logger.info(f"[calls] lambda generate response={response.json()}")
        response_json = response.json()
        response = response_json["result"]
    else:
        response = lambda_client.invoke(
            FunctionName=os.getenv("CHB_CHATBOT_GENERATE_LAMBDA_NAME"),
            InvocationType="Event",
            Payload=bytes(str(lambda_event), encoding="utf-8"),
        )

    return response


def chatbot_mask_pii(string: str) -> str:
    if os.getenv("CHB_CHATBOT_MASK_PII_LAMBDA_NAME") is None:
        lambda_event = {
            "operation": "mask_pii",
            "payload": {
                "string": string,
            },
        }
        response = requests.post(
            "http://core:8080/2015-03-31/functions/function/invocations",
            json=lambda_event,
        )
        logger.info(f"[calls] lambda mask_pii response={response.json()}")
        response_json = response.json()
        response = response_json["result"]
    else:
        response = lambda_client.invoke(
            FunctionName=os.getenv("CHB_CHATBOT_GENERATE_LAMBDA_NAME"),
            InvocationType="Event",
            Payload=bytes(str(lambda_event), encoding="utf-8"),
        )

    return response
