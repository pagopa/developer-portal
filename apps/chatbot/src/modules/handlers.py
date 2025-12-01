import os
import numpy as np
from typing import Optional, Any, Union, Mapping

from langfuse.client import (
    Langfuse,
    StatefulGenerationClient,
    StateType,
)
from langfuse.utils import _get_timestamp
from langfuse.model import ModelUsage
from langfuse.llama_index._context import InstrumentorContext
from uuid import uuid4 as create_uuid

try:
    from llama_index.core.base.llms.types import (
        ChatResponse,
        CompletionResponse,
    )
    from llama_index.core.instrumentation.events import BaseEvent
    from llama_index.core.instrumentation.events.embedding import (
        EmbeddingStartEvent,
        EmbeddingEndEvent,
    )
    from llama_index.core.instrumentation.event_handlers import BaseEventHandler
    from llama_index.core.instrumentation.events.llm import (
        LLMCompletionEndEvent,
        LLMCompletionStartEvent,
        LLMChatEndEvent,
        LLMChatStartEvent,
    )
    from llama_index.core.instrumentation.events.rerank import (
        ReRankEndEvent,
        ReRankStartEvent,
    )
    from llama_index.core.utilities.token_counting import TokenCounter

except ImportError:
    raise ModuleNotFoundError(
        "Please install llama-index to use the Langfuse llama-index integration: 'pip install llama-index'"
    )

from src.modules.settings import SETTINGS
from src.modules.logger import get_logger


LOGGER = get_logger(__name__, level=SETTINGS.log_level)
MODEL_ID = os.getenv("CHB_MODEL_ID")
EMBED_MODEL_ID = os.getenv("CHB_EMBED_MODEL_ID")
RERANKER_ID = os.getenv("CHB_RERANKER_ID")
LLMS_COST = {
    "gemini-2.5-flash": {
        "input_cost": 0.3 * 1.0e-6,
        "output_cost": 2.5 * 1.0e-6,
    },
    "gemini-2.5-flash-lite": {
        "input_cost": 0.1 * 1.0e-6,
        "output_cost": 0.4 * 1.0e-6,
    },
    "gemini-2.0-flash": {
        "input_cost": 0.1 * 1.0e-6,
        "output_cost": 0.4 * 1.0e-6,
    },
    "gemini-2.0-flash-lite": {
        "input_cost": 0.075 * 1.0e-6,
        "output_cost": 0.3 * 1.0e-6,
    },
}
EMBEDDERS_COST = {
    "gemini-embedding-001": 0.15 * 1.0e-6,
}
RERANK_COST = {
    "semantic-ranker-default-004": 0.001,
    "semantic-ranker-fast-004": 0.001,
    "semantic-ranker-512-003": 0.001,
}


class EventHandler(BaseEventHandler, extra="allow"):
    def __init__(self, *, langfuse_client: Langfuse):
        super().__init__()

        self._langfuse = langfuse_client
        self._token_counter = TokenCounter()
        self._context = InstrumentorContext()

    @classmethod
    def class_name(cls) -> str:
        """Class name."""
        return "EventHandler"

    def handle(self, event: BaseEvent) -> None:
        LOGGER.debug(f"Event {type(event).__name__} received: {event}")

        if isinstance(
            event,
            (
                LLMCompletionStartEvent,
                LLMChatStartEvent,
                EmbeddingStartEvent,
                ReRankStartEvent,
            ),
        ):
            self.update_generation_from_start_event(event)
        elif isinstance(
            event,
            (LLMCompletionEndEvent, LLMChatEndEvent, EmbeddingEndEvent, ReRankEndEvent),
        ):
            self.update_generation_from_end_event(event)

    def update_generation_from_start_event(
        self,
        event: Union[
            LLMCompletionStartEvent,
            LLMChatStartEvent,
            EmbeddingStartEvent,
            ReRankStartEvent,
        ],
    ) -> None:
        if event.span_id is None:
            LOGGER.warning("Span ID is not set")
            return

        model_data = event.model_dict
        model = model_data.pop("model", None) or model_data.pop("model_name", None)
        traced_model_data = {
            k: str(v)
            for k, v in model_data.items()
            if v is not None
            and k
            in [
                "max_tokens",
                "max_retries",
                "temperature",
                "timeout",
                "strict",
                "top_logprobs",
                "logprobs",
                "embed_batch_size",
            ]
        }

        self._get_generation_client(event.span_id).update(
            model=model, model_parameters=traced_model_data
        )

    def update_generation_from_end_event(
        self,
        event: Union[
            LLMCompletionEndEvent, LLMChatEndEvent, EmbeddingEndEvent, ReRankEndEvent
        ],
    ) -> None:
        if event.span_id is None:
            LOGGER.warning("Span ID is not set")
            return

        usage = None

        if isinstance(event, (LLMCompletionEndEvent, LLMChatEndEvent)):
            if event.response:
                usage = (
                    self._parse_token_usage(event.response) if event.response else None
                )
                # LOGGER.info(f"[{MODEL_ID}] Input Tokens: {usage["input"]}")
                # LOGGER.info(f"[{MODEL_ID}] Output Tokens: {usage["output"]}")

        if isinstance(event, EmbeddingEndEvent):
            token_count = sum(
                self._token_counter.get_string_tokens(chunk) for chunk in event.chunks
            )
            usage = {
                "input": 0,
                "output": 0,
                "total": token_count or 0,
                "total_cost": (
                    token_count * EMBEDDERS_COST[EMBED_MODEL_ID]
                    if MODEL_ID in LLMS_COST.keys()
                    else 0
                ),
            }
            # LOGGER.info(f"[{EMBED_MODEL_ID}] Embedding Tokens: {usage["total"]}")

        if isinstance(event, ReRankEndEvent):

            num_chunks = len(event.nodes)

            usage = {
                "total_cost": np.ceil(num_chunks / 100) * RERANK_COST[RERANKER_ID],
            }

            LOGGER.info(f"[{RERANKER_ID}] reranking {num_chunks} chunks")

        self._get_generation_client(event.span_id).update(
            usage=usage, end_time=_get_timestamp()
        )

    def _parse_token_usage(
        self, response: Union[ChatResponse, CompletionResponse]
    ) -> Optional[ModelUsage]:
        if ((raw := getattr(response, "raw", None)) and hasattr(raw, "get")) and (
            (usage := raw.get("usage")) or (usage := raw.get("usage_metadata"))
        ):
            return _parse_usage_from_mapping(usage)

        if additional_kwargs := getattr(response, "additional_kwargs", None):
            return _parse_usage_from_mapping(additional_kwargs)

    def _get_generation_client(self, id: str) -> StatefulGenerationClient:
        trace_id = self._context.trace_id
        if trace_id is None:
            LOGGER.warning(
                "Trace ID is not set. Creating generation client with new trace id."
            )
            trace_id = str(create_uuid())

        return StatefulGenerationClient(
            client=self._langfuse.client,
            id=id,
            trace_id=trace_id,
            task_manager=self._langfuse.task_manager,
            state_type=StateType.OBSERVATION,
        )


def _parse_usage_from_mapping(
    usage: Union[object, Mapping[str, Any]],
) -> ModelUsage:
    if isinstance(usage, Mapping):
        return _get_token_counts_from_mapping(usage)

    return _parse_usage_from_object(usage)


def _parse_usage_from_object(usage: object) -> ModelUsage:
    model_usage: ModelUsage = {
        "unit": None,
        "input": None,
        "output": None,
        "total": None,
        "input_cost": None,
        "output_cost": None,
        "total_cost": None,
    }

    if (
        (prompt_tokens := getattr(usage, "prompt_tokens", None)) is not None  # openai
        or (prompt_tokens := getattr(usage, "inputTokens", None)) is not None  # bedrock
        or (prompt_tokens := getattr(usage, "prompt_token_count", None))
        is not None  # gemini
    ):
        model_usage["input"] = prompt_tokens
        model_usage["input_cost"] = (
            prompt_tokens * LLMS_COST[MODEL_ID]["input_cost"]
            if MODEL_ID in LLMS_COST.keys()
            else 0
        )

    if (
        (completion_tokens := getattr(usage, "completion_tokens", None))
        is not None  # openai
        or (completion_tokens := getattr(usage, "outputTokens", None))
        is not None  # bedrock
        or (completion_tokens := getattr(usage, "candidates_token_count", None))
        is not None  # gemini
    ):
        model_usage["output"] = completion_tokens
        model_usage["output_cost"] = (
            completion_tokens * LLMS_COST[MODEL_ID]["input_cost"]
            if MODEL_ID in LLMS_COST.keys()
            else 0
        )
    if (
        (total_tokens := getattr(usage, "total_tokens", None)) is not None  # openai
        or (total_tokens := getattr(usage, "totalTokens", None)) is not None  # bedrock
        or (total_tokens := getattr(usage, "total_token_count", None))
        is not None  # gemini
    ):
        model_usage["total"] = total_tokens
        model_usage["total_cost"] = (
            model_usage["input_cost"] + model_usage["output_cost"]
        )

    return model_usage


def _get_token_counts_from_mapping(
    usage_mapping: Mapping[str, Any],
) -> ModelUsage:
    model_usage: ModelUsage = {
        "unit": "TOKENS",
        "input": None,
        "output": None,
        "total": None,
        "input_cost": None,
        "output_cost": None,
        "total_cost": None,
    }
    if (
        (prompt_tokens := usage_mapping.get("prompt_tokens")) is not None  # openai
        or (prompt_tokens := usage_mapping.get("inputTokens")) is not None  # bedrock
        or (prompt_tokens := usage_mapping.get("prompt_token_count"))
        is not None  # gemini
    ):
        model_usage["input"] = prompt_tokens
        model_usage["input_cost"] = (
            prompt_tokens * LLMS_COST[MODEL_ID]["input_cost"]
            if MODEL_ID in LLMS_COST.keys()
            else 0
        )

    if (
        (completion_tokens := usage_mapping.get("completion_tokens"))
        is not None  # openai
        or (completion_tokens := usage_mapping.get("outputTokens"))
        is not None  # bedrock
        or (completion_tokens := usage_mapping.get("candidates_token_count"))
        is not None  # gemini
    ):
        model_usage["output"] = completion_tokens
        model_usage["output_cost"] = (
            completion_tokens * LLMS_COST[MODEL_ID]["input_cost"]
            if MODEL_ID in LLMS_COST.keys()
            else 0
        )
    if (
        (total_tokens := usage_mapping.get("total_tokens")) is not None  # openai
        or (total_tokens := usage_mapping.get("totalTokens")) is not None  # bedrock
        or (total_tokens := usage_mapping.get("total_token_count"))
        is not None  # gemini
    ):
        model_usage["total"] = total_tokens
        model_usage["total_cost"] = (
            model_usage["input_cost"] + model_usage["output_cost"]
        )

    return model_usage
