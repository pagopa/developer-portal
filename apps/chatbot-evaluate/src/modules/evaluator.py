from typing import List
import numpy as np
import logging

from llama_index.core.llms.llm import BaseLLM
from llama_index.core.embeddings import BaseEmbedding

from ragas import SingleTurnSample, EvaluationDataset, evaluate
from ragas.llms import LlamaIndexLLMWrapper
from ragas.embeddings.base import LlamaIndexEmbeddingsWrapper
from ragas.metrics import (
    Faithfulness,
    ResponseRelevancy,
    LLMContextPrecisionWithoutReference,
)

from src.modules.settings import SETTINGS


logging.getLogger("ragas").setLevel(logging.ERROR)


class Evaluator:

    def __init__(
        self,
        llm: BaseLLM,
        embedder: BaseEmbedding,
    ):

        self.llm = LlamaIndexLLMWrapper(llm=llm)
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

        if SETTINGS.provider == "mock":
            scores = {
                "answer_relevancy_mock": 0.0,
                "context_precision_mock": 0.0,
                "faithfulness_mock": 0.0,
            }

        else:

            result = evaluate(
                dataset=dataset,
                metrics=[
                    self.response_relevancy,
                    self.context_precision,
                    self.faithfulness,
                ],
                show_progress=False,
            )
            scores = result.scores[0]
            scores["context_precision"] = scores.pop(
                "llm_context_precision_without_reference"
            )

            for k, v in scores.items():
                if v is None or np.isnan(v):
                    scores[k] = 0.0
                else:
                    scores[k] = float(v)

        return scores
