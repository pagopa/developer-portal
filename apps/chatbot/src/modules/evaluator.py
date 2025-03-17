import os
import json
from logging import getLogger
from dotenv import load_dotenv
from typing import List

from google.oauth2 import service_account

from llama_index.core.async_utils import asyncio_run

from langchain_core.outputs import LLMResult, ChatGeneration
from langchain_aws import ChatBedrockConverse
from langchain_aws import BedrockEmbeddings
from langchain_google_vertexai import ChatVertexAI, VertexAIEmbeddings

from ragas import SingleTurnSample
from ragas.llms import LangchainLLMWrapper, BaseRagasLLM
from ragas.embeddings.base import LangchainEmbeddingsWrapper, BaseRagasEmbeddings
from ragas.metrics import (
    Faithfulness,
    ResponseRelevancy,
    LLMContextPrecisionWithoutReference,
)

from src.modules.utils import get_ssm_parameter


load_dotenv()
logger = getLogger(__name__)

PROVIDER = os.getenv("CHB_PROVIDER", "google")
assert PROVIDER in ["aws", "google"]


GOOGLE_CREDENTIALS_PARAMS = get_ssm_parameter(
    name=os.getenv("CHB_GOOGLE_CREDENTIALS_PARAMS")
)
AWS_ACCESS_KEY_ID = os.getenv("CHB_AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("CHB_AWS_SECRET_ACCESS_KEY")
AWS_BEDROCK_LLM_REGION = os.getenv("CHB_AWS_BEDROCK_LLM_REGION")
AWS_BEDROCK_EMBED_REGION = os.getenv("CHB_AWS_BEDROCK_EMBED_REGION")

MODEL_ID = os.getenv("CHB_MODEL_ID")
MODEL_TEMPERATURE = 0.0
MODEL_MAXTOKENS = 256
EMBED_MODEL_ID = os.getenv("CHB_EMBED_MODEL_ID")

if PROVIDER == "aws":
    LLM = LangchainLLMWrapper(
        ChatBedrockConverse(
            model=MODEL_ID,
            temperature=MODEL_TEMPERATURE,
            max_tokens=MODEL_MAXTOKENS,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_BEDROCK_LLM_REGION,
        )
    )
    EMBEDDER = LangchainEmbeddingsWrapper(
        BedrockEmbeddings(
            model_id=EMBED_MODEL_ID,
            credentials_profile_name="default",
            region_name=AWS_BEDROCK_EMBED_REGION,
        )
    )

else:

    def gemini_is_finished_parser(response: LLMResult) -> bool:
        is_finished_list = []
        for g in response.flatten():
            resp = g.generations[0][0]

            # Check generation_info first
            if resp.generation_info is not None:
                finish_reason = resp.generation_info.get("finish_reason")
                if finish_reason is not None:
                    is_finished_list.append(finish_reason in ["STOP", "MAX_TOKENS"])
                    continue

            # Check response_metadata as fallback
            if isinstance(resp, ChatGeneration) and resp.message is not None:
                metadata = resp.message.response_metadata
                if metadata.get("finish_reason"):
                    is_finished_list.append(
                        metadata["finish_reason"] in ["STOP", "MAX_TOKENS"]
                    )
                elif metadata.get("stop_reason"):
                    is_finished_list.append(
                        metadata["stop_reason"] in ["STOP", "MAX_TOKENS"]
                    )

            # If no finish reason found, default to True
            if not is_finished_list:
                is_finished_list.append(True)

        return all(is_finished_list)

    gcp_param = json.loads(GOOGLE_CREDENTIALS_PARAMS)
    credentials = service_account.Credentials.from_service_account_info(gcp_param)

    LLM = LangchainLLMWrapper(
        ChatVertexAI(
            credentials=credentials,
            model_name=MODEL_ID,
            temperature=MODEL_TEMPERATURE,
            max_tokens=MODEL_MAXTOKENS,
        ),
        is_finished_parser=gemini_is_finished_parser,
    )
    EMBEDDER = LangchainEmbeddingsWrapper(
        VertexAIEmbeddings(credentials=credentials, model_name=EMBED_MODEL_ID)
    )

logger.info(f"Loaded {MODEL_ID} as judge LLM successfully!")
logger.info(f"Loaded {EMBED_MODEL_ID} as judge embedder successfully!")


class Evaluator:

    def __init__(
        self,
        llm: BaseRagasLLM | None = None,
        embedder: BaseRagasEmbeddings | None = None,
    ):

        self.llm = llm if llm else LLM
        self.embedder = embedder if embedder else EMBEDDER

        self.response_relevancy = ResponseRelevancy(
            llm=self.llm, embeddings=self.embedder
        )
        self.context_precision = LLMContextPrecisionWithoutReference(llm=self.llm)
        self.faithfulness = Faithfulness(llm=self.llm)

    def evaluate(
        self, query_str: str, response_str: str, retrieved_contexts: List[str]
    ) -> dict:

        sample = SingleTurnSample(
            user_input=query_str,
            response=response_str,
            retrieved_contexts=retrieved_contexts,
        )

        try:
            faithfulness_score = asyncio_run(self.faithfulness.single_turn_ascore(sample))
        except Exception as e:
            faithfulness_score: None
            logger.info(e)
        
        try:
            response_relevancy_score = asyncio_run(self.faithfulness.single_turn_ascore(sample))
        except Exception as e:
            response_relevancy_score: None
            logger.info(e)
        
        try:
            context_precision_score = asyncio_run(self.faithfulness.single_turn_ascore(sample))
        except Exception as e:
            context_precision_score = None
            logger.info(e)

        return {
            "faithfulness": faithfulness_score,
            "response_relevancy": response_relevancy_score,
            "context_precision": context_precision_score,
        }
