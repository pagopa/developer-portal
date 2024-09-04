import os
import boto3
import logging
from typing import Any, Mapping
from langchain_aws import BedrockLLM
from langchain_core.callbacks import AsyncCallbackHandler
from llama_index.llms.langchain import LangChainLLM
from llama_index.embeddings.langchain import LangchainEmbedding
from langchain_aws.embeddings import BedrockEmbeddings
from dotenv import load_dotenv

load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv('CHB_AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('CHB_AWS_SECRET_ACCESS_KEY')
AWS_DEFAULT_REGION = os.getenv('CHB_AWS_DEFAULT_REGION')
AWS_GUARDRAIL_ID = os.getenv("CHB_AWS_GUARDRAIL_ID")
AWS_GUARDRAIL_VERSION = os.getenv("CHB_AWS_GUARDRAIL_VERSION")
BEDROCK_CLIENT = boto3.client(
    service_name="bedrock-runtime",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_DEFAULT_REGION
)


class BedrockAsyncCallbackHandler(AsyncCallbackHandler):
    # Async callback handler that can be used to handle callbacks from langchain.

    async def on_llm_error(self, error: BaseException, **kwargs: Any) -> Any:
        reason = kwargs.get("reason")
        if reason == "GUARDRAIL_INTERVENED":
            logging.info(f"Guardrails: {kwargs}")


def get_llm(
        params: dict, 
        guardrails: Mapping[str, Any] | None = {
            "guardrailIdentifier": AWS_GUARDRAIL_ID, 
            "guardrailVersion": AWS_GUARDRAIL_VERSION, 
            "trace": True
        }
    ):

    if guardrails is None:
        guardrails = {
            "guardrailIdentifier": None,
            "guardrailVersion": None,
            "trace": None
        }

    # Guardrails for Amazon Bedrock with trace
    llm = LangChainLLM(
        BedrockLLM(
            model_id = params["models"]["model_id"],
            model_kwargs={
                "temperature": params["models"]["temperature"],
                "topP": params["models"]["topP"]
            },
            guardrails=guardrails,
            callbacks = [BedrockAsyncCallbackHandler()],
            streaming = params["engine"]["streaming"],
            client = BEDROCK_CLIENT
        )
    )

    return llm


def get_embed_model(params):

    embed_model = LangchainEmbedding(
        BedrockEmbeddings(
            model_id=params["models"]["emded_model_id"],
            client = BEDROCK_CLIENT
        )
    )

    return embed_model
