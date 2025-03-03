import os
from logging import getLogger
from dotenv import load_dotenv
from typing import List

from llama_index.core.async_utils import asyncio_run

from langchain_aws import ChatBedrockConverse
from langchain_aws import BedrockEmbeddings

from ragas import SingleTurnSample
from ragas.llms import LangchainLLMWrapper, BaseRagasLLM
from ragas.embeddings.base import LangchainEmbeddingsWrapper, BaseRagasEmbeddings
from ragas.metrics import (
    Faithfulness,
    ResponseRelevancy,
    LLMContextPrecisionWithoutReference
)

from src.modules.utils import get_ssm_parameter


load_dotenv()
logger = getLogger(__name__)

PROVIDER = os.getenv("CHB_PROVIDER", "google")
assert PROVIDER in ["aws", "google"]

GOOGLE_API_KEY = get_ssm_parameter(name=os.getenv("CHB_GOOGLE_API_KEY"))
AWS_ACCESS_KEY_ID = os.getenv("CHB_AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("CHB_AWS_SECRET_ACCESS_KEY")
AWS_BEDROCK_LLM_REGION = os.getenv("CHB_AWS_BEDROCK_LLM_REGION")
AWS_BEDROCK_EMBED_REGION = os.getenv("CHB_AWS_BEDROCK_EMBED_REGION")
AWS_GUARDRAIL_ID = os.getenv("CHB_AWS_GUARDRAIL_ID")
AWS_GUARDRAIL_VERSION = os.getenv("CHB_AWS_GUARDRAIL_VERSION")

MODEL_ID = os.getenv("CHB_MODEL_ID")
MODEL_TEMPERATURE = os.getenv("CHB_MODEL_TEMPERATURE", "0.3")
MODEL_MAXTOKENS = os.getenv("CHB_MODEL_MAXTOKENS", "768")
EMBED_MODEL_ID = os.getenv("CHB_EMBED_MODEL_ID")

if PROVIDER == "aws":
    LLM = LangchainLLMWrapper(
            ChatBedrockConverse(
            model=MODEL_ID,
            temperature=float(MODEL_TEMPERATURE),
            max_tokens=int(MODEL_MAXTOKENS)
        )
    )
    EMBEDDER = LangchainEmbeddingsWrapper(
        BedrockEmbeddings(
            model_id = EMBED_MODEL_ID
        )
    )
    logger.info("Loaded evaluation model successfully!")
else:
    raise NotImplementedError()


class Evaluator():


    def __init__(self, llm: BaseRagasLLM | None = None, embedder: BaseRagasEmbeddings | None = None):

        self.llm = llm if llm else LLM
        self.embedder = embedder if embedder else EMBEDDER

        self.response_relevancy = ResponseRelevancy(llm=self.llm, embeddings=self.embedder)
        self.context_precision = LLMContextPrecisionWithoutReference(llm=self.llm)
        self.faithfulness = Faithfulness(llm=self.llm)


    def evaluate(self, query_str: str, response_str: str, retrieved_contexts: List[str]) -> dict:

        sample = SingleTurnSample(
            user_input = query_str,
            response = response_str,
            retrieved_contexts = retrieved_contexts
        )

        return {
            "response_relevancy": asyncio_run(self.response_relevancy.single_turn_ascore(sample)),
            "context_precision": asyncio_run(self.context_precision.single_turn_ascore(sample)),
            "faithfulness": asyncio_run(self.faithfulness.single_turn_ascore(sample)),
        }
