import boto3
import os
import logging

from llama_index.core.instrumentation import get_dispatcher
from llama_index.core.instrumentation.event_handlers import BaseEventHandler
from llama_index.core.instrumentation.events.llm import LLMCompletionEndEvent, LLMChatEndEvent

from llama_index.llms.bedrock_converse import BedrockConverse
from llama_index.embeddings.bedrock import BedrockEmbedding

from llama_index.llms.gemini import Gemini
from llama_index.embeddings.gemini import GeminiEmbedding
from google.generativeai.types import HarmCategory, HarmBlockThreshold

from dotenv import load_dotenv

from src.modules.utils import get_ssm_parameter

load_dotenv()

PROVIDER = os.getenv("CHB_PROVIDER", "google")
assert PROVIDER in ["aws", "google"]


GOOGLE_API_KEY = get_ssm_parameter(name=os.getenv("CHB_GOOGLE_API_KEY"))
AWS_ACCESS_KEY_ID = os.getenv("CHB_AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("CHB_AWS_SECRET_ACCESS_KEY")
AWS_BEDROCK_REGION = os.getenv("CHB_AWS_BEDROCK_REGION")
AWS_GUARDRAIL_ID = os.getenv("CHB_AWS_GUARDRAIL_ID")
AWS_GUARDRAIL_VERSION = os.getenv("CHB_AWS_GUARDRAIL_VERSION")

MODEL_ID = os.getenv("CHB_MODEL_ID")
MODEL_TEMPERATURE = os.getenv("CHB_MODEL_TEMPERATURE", "0.3")
MODEL_MAXTOKENS = os.getenv("CHB_MODEL_MAXTOKENS", "768")
EMBED_MODEL_ID = os.getenv("CHB_EMBED_MODEL_ID")

CROSS_ACCOUNT_ROLE_ARN = os.getenv("CHB_CROSS_ACCOUNT_ROLE_ARN")

def get_llm():

    if PROVIDER == "aws":
        class ModelEventHandler(BaseEventHandler):
            @classmethod
            def class_name(cls) -> str:
                """Class name."""
                return "ModelEventHandler"

            def handle(self, event) -> None:
                """Logic for handling event."""
                if isinstance(event, (LLMCompletionEndEvent, LLMChatEndEvent)):
                    logging.info(f"[{MODEL_ID}] Bedrock request id: {event.response.raw["ResponseMetadata"]["RequestId"]}")
                    logging.info(f"[{MODEL_ID}] Stop Reason: {event.response.raw["stopReason"]}")
                    logging.info(f"[{MODEL_ID}] Input Tokens: {event.response.raw["usage"]["inputTokens"]}")
                    logging.info(f"[{MODEL_ID}] Output Tokens: {event.response.raw["usage"]["outputTokens"]}")
                    logging.info(f"[{MODEL_ID}] Latency (ms): {event.response.raw["metrics"]["latencyMs"]}")

        root_dispatcher = get_dispatcher()
        root_dispatcher.add_event_handler(ModelEventHandler())
        if CROSS_ACCOUNT_ROLE_ARN:
            # Create an STS client
            sts_client = boto3.client('sts')

            # Assume the role
            assumed_role_object = sts_client.assume_role(
                RoleArn=CROSS_ACCOUNT_ROLE_ARN,
                RoleSessionName="chatbot-cross-account-generation"
            )

            # Retrieve the temporary credentials
            credentials = assumed_role_object['Credentials']

            llm = BedrockConverse(
                model=MODEL_ID,
                temperature=float(MODEL_TEMPERATURE),
                max_tokens=int(MODEL_MAXTOKENS),
                aws_access_key_id=credentials['AccessKeyId'],
                aws_secret_access_key=credentials['SecretAccessKey'],
                aws_session_token=credentials['SessionToken'],
                region_name=AWS_BEDROCK_REGION
            )
        else:
            llm = BedrockConverse(
                model=MODEL_ID,
                temperature=float(MODEL_TEMPERATURE),
                max_tokens=int(MODEL_MAXTOKENS),
                aws_access_key_id=AWS_ACCESS_KEY_ID,
                aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                region_name=AWS_BEDROCK_REGION
            )

    else:
        llm = Gemini(
            model=MODEL_ID,
            temperature=float(MODEL_TEMPERATURE),
            max_tokens=int(MODEL_MAXTOKENS),
            safety_settings={
                HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
            },
            api_key=GOOGLE_API_KEY,
        )

    logging.info(f"[models.py - get_llm] {MODEL_ID} LLM loaded successfully!")

    return llm


def get_embed_model():
    if PROVIDER == "aws":
        if CROSS_ACCOUNT_ROLE_ARN:
            # Create an STS client
            sts_client = boto3.client('sts')

            # Assume the role
            assumed_role_object = sts_client.assume_role(
                RoleArn=CROSS_ACCOUNT_ROLE_ARN,
                RoleSessionName="chatbot-cross-account-generation"
            )

            # Retrieve the temporary credentials
            credentials = assumed_role_object['Credentials']

            embed_model = BedrockEmbedding(
                model_name = EMBED_MODEL_ID,
                aws_access_key_id=credentials['AccessKeyId'],
                aws_secret_access_key=credentials['SecretAccessKey'],
                aws_session_token=credentials['SessionToken'],
                region_name=AWS_BEDROCK_REGION
            )
        else:
            embed_model = BedrockEmbedding(
                model_name = EMBED_MODEL_ID,
                aws_access_key_id=AWS_ACCESS_KEY_ID,
                aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                region_name=AWS_BEDROCK_REGION
            )
    else:
        embed_model = GeminiEmbedding(
            api_key=GOOGLE_API_KEY,
            model_name=EMBED_MODEL_ID,
        )
    logging.info(f"[models.py - get_embed_model] {EMBED_MODEL_ID} embegging model loaded successfully!")

    return embed_model
