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


GOOGLE_PARAM_NAME = os.getenv("CHB_GOOGLE_API_KEY")
GOOGLE_API_KEY = get_ssm_parameter(name=GOOGLE_PARAM_NAME)
AWS_ACCESS_KEY_ID = os.getenv("CHB_AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("CHB_AWS_SECRET_ACCESS_KEY")
CHB_AWS_DEFAULT_REGION = os.getenv("CHB_AWS_DEFAULT_REGION")
AWS_GUARDRAIL_ID = os.getenv("CHB_AWS_GUARDRAIL_ID")
AWS_GUARDRAIL_VERSION = os.getenv("CHB_AWS_GUARDRAIL_VERSION")

MODEL_ID = os.getenv("CHB_MODEL_ID", "models/gemini-1.5-flash")
MODEL_TEMPERATURE = os.getenv("CHB_MODEL_TEMPERATURE", "0.5")
MODEL_MAXTOKENS = os.getenv("CHB_MODEL_MAXTOKENS", "512")
EMBED_MODEL_ID = os.getenv("CHB_EMBED_MODEL_ID", "models/text-embedding-004")


def get_llm():

    if PROVIDER == "aws":

        class ModelEventHandler(BaseEventHandler):
            @classmethod
            def class_name(cls) -> str:
                """Class name."""
                return "ModelEventHandler"

            def handle(self, event) -> None:
                """Logic for handling event."""
                if isinstance(event, (LLMCompletionEndEvent, LLMChatEndEvent,)):
                    logging.info(f"RequestID: {event.response.raw["ResponseMetadata"]["RequestId"]}")
                    logging.info(f"Stop Reason: {event.response.raw["stopReason"]}")
                    logging.info(f"Input Tokens: {event.response.raw["usage"]["inputTokens"]}")
                    logging.info(f"Output Tokens: {event.response.raw["usage"]["outputTokens"]}")
                    logging.info(f"Latency (ms): {event.response.raw["metrics"]["latencyMs"]}")

        root_dispatcher = get_dispatcher()
        root_dispatcher.add_event_handler(ModelEventHandler())
        
        llm = BedrockConverse(
            model=MODEL_ID,
            temperature=float(MODEL_TEMPERATURE),
            max_tokens=int(MODEL_MAXTOKENS),
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=CHB_AWS_DEFAULT_REGION
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

    logging.info(f"{MODEL_ID} LLM loaded successfully!")

    return llm


def get_embed_model():

    if PROVIDER == "aws":
        embed_model = BedrockEmbedding(
            model_name = EMBED_MODEL_ID,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=CHB_AWS_DEFAULT_REGION
        )
    else:
        embed_model = GeminiEmbedding(
            api_key=GOOGLE_API_KEY,
            model_name=EMBED_MODEL_ID,
        )
    logging.info(f"{EMBED_MODEL_ID} embegging model loaded successfully!")

    return embed_model
