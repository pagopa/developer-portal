import os
import logging

from llama_index.core.instrumentation import get_dispatcher
from llama_index.core.instrumentation.event_handlers import BaseEventHandler
from llama_index.core.instrumentation.events.llm import LLMCompletionEndEvent, LLMChatEndEvent

from llama_index.llms.bedrock_converse import BedrockConverse
from llama_index.embeddings.bedrock import BedrockEmbedding
from llama_index.llms.gemini import Gemini
from llama_index.embeddings.gemini import GeminiEmbedding

from dotenv import load_dotenv

load_dotenv()


GOOGLE_API_KEY = os.getenv('CHB_GOOGLE_API_KEY')
AWS_ACCESS_KEY_ID = os.getenv('CHB_AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('CHB_AWS_SECRET_ACCESS_KEY')
AWS_DEFAULT_REGION = os.getenv('CHB_AWS_DEFAULT_REGION')
AWS_GUARDRAIL_ID = os.getenv("CHB_AWS_GUARDRAIL_ID")
AWS_GUARDRAIL_VERSION = os.getenv("CHB_AWS_GUARDRAIL_VERSION")

CHB_MODEL_PROVIDER = os.getenv('CHB_MODEL_PROVIDER')
CHB_MODEL_NAME = os.getenv('CHB_MODEL_NAME')
CHB_MODEL_TEMPERATURE = os.getenv('CHB_MODEL_TEMPERATURE')
CHB_MODEL_MAXTOKENS = os.getenv("CHB_MODEL_MAXTOKENS")
CHB_EMBED_MODEL_ID = os.getenv("CHB_EMBED_MODEL_ID")


class ModelEventHandler(BaseEventHandler):
    @classmethod
    def class_name(cls) -> str:
        """Class name."""
        return "ModelEventHandler"

    def handle(self, event) -> None:
        """Logic for handling event."""
        if isinstance(event, (LLMCompletionEndEvent, LLMChatEndEvent,)):
            logging.info(f"Bedrock - RequestID: {event.response.raw["ResponseMetadata"]["RequestId"]}")
            logging.info(f"Bedrock - Stop Reason: {event.response.raw["stopReason"]}")
            logging.info(f"Bedrock - Input Tokens: {event.response.raw["usage"]["inputTokens"]}")
            logging.info(f"Bedrock - Output Tokens: {event.response.raw["usage"]["outputTokens"]}")
            logging.info(f"Bedrock - Latency (ms): {event.response.raw["metrics"]["latencyMs"]}")


def get_llm(add_event_handler: bool = True):

    if CHB_MODEL_PROVIDER == "aws":
        if add_event_handler:
            root_dispatcher = get_dispatcher()
            root_dispatcher.add_event_handler(ModelEventHandler())
        
        llm = BedrockConverse(
            model=CHB_MODEL_NAME,
            temperature=CHB_MODEL_TEMPERATURE,
            max_tokens=CHB_MODEL_MAXTOKENS,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_DEFAULT_REGION
        )

    else:
        llm = Gemini(
            model=CHB_MODEL_NAME,
            temperature=CHB_MODEL_TEMPERATURE,
            max_tokens=CHB_MODEL_MAXTOKENS,
            api_key=GOOGLE_API_KEY,
        )

    logging.info(f"{CHB_MODEL_NAME} LLM loaded successfully!")

    return llm


def get_embed_model():

    if CHB_MODEL_PROVIDER == "aws":
        embed_model = BedrockEmbedding(
            model_name = CHB_EMBED_MODEL_ID,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_DEFAULT_REGION
        )
    else:
        embed_model = GeminiEmbedding(
            api_key=GOOGLE_API_KEY,
            model_name=CHB_EMBED_MODEL_ID,
        )
    logging.info(f"{CHB_EMBED_MODEL_ID} embegging model loaded successfully!")

    return embed_model
