from typing import List, Optional, Any

from llama_index.core.llms.llm import BaseLLM
from llama_index.core.embeddings import BaseEmbedding

from ragas import SingleTurnSample, EvaluationDataset, evaluate
from ragas.run_config import RunConfig
from ragas.llms import LlamaIndexLLMWrapper
from ragas.embeddings.base import LlamaIndexEmbeddingsWrapper
from ragas.metrics import (
    Faithfulness,
    ResponseRelevancy,
    LLMContextPrecisionWithoutReference,
)
from langchain_core.callbacks import Callbacks

from src.modules.logger import get_logger
from src.modules.models import get_llm, get_embed_model


LOGGER = get_logger(__name__)


class RagasWrapper(LlamaIndexLLMWrapper):
    def __init__(
        self,
        llm: BaseLLM,
        run_config: Optional[RunConfig] = None,
    ):
        self.llm = llm
        self._signature = type(self.llm).__name__.lower()
        if run_config is None:
            run_config = RunConfig()
        self.set_run_config(run_config)

    def check_args(
        self,
        n: int,
        temperature: float,
        stop: Optional[List[str]],
        callbacks: Callbacks,
    ) -> dict[str, Any]:
        if n != 1:
            LOGGER.warning("n values greater than 1 not support for LlamaIndex LLMs")
        if temperature != 1e-8:
            LOGGER.info("temperature kwarg passed to LlamaIndex LLM")
        if stop is not None:
            LOGGER.info("stop kwarg passed to LlamaIndex LLM")
        if self._signature in ["anthropic", "bedrock", "bedrockconverse"]:
            return {"temperature": temperature}
        else:
            return {
                "n": n,
                "temperature": temperature,
                "stop": stop,
            }


class Evaluator:

    def __init__(
        self,
        llm: BaseLLM | None = None,
        embedder: BaseEmbedding | None = None,
    ):

        llm = llm if llm else get_llm()
        llm.temperature = 0.0
        self.llm = RagasWrapper(llm=llm)
        embedder = embedder if embedder else get_embed_model()
        self.embedder = LlamaIndexEmbeddingsWrapper(embeddings=embedder)

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
        dataset = EvaluationDataset([sample])

        result = evaluate(
            dataset=dataset,
            metrics=[
                self.response_relevancy,
                self.context_precision,
                self.faithfulness,
            ],
            llm=self.llm,
            embeddings=self.embedder,
            show_progress=False,
        )
        scores = result.scores[0]
        scores["context_precision"] = scores.pop(
            "llm_context_precision_without_reference"
        )

        return scores
