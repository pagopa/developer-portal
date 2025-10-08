from typing import Optional, List, Dict

from opentelemetry import trace
from llama_index.core.async_utils import asyncio_run
from llama_index.core.llms import ChatMessage, MessageRole

from src.modules.logger import get_logger
from src.modules.models import get_llm, get_embed_model
from src.modules.evaluator import Evaluator
from src.modules.monitor import add_langfuse_score
from src.modules.settings import SETTINGS


LOGGER = get_logger(__name__)
tracer = trace.get_tracer(__name__)


class Judge:
    def __init__(self):
        with tracer.start_as_current_span("judge_init") as span:
            with tracer.start_as_current_span("load_settings"):
                self.condense_prompt_str = SETTINGS.condense_prompt_str
            
            with tracer.start_as_current_span("get_llm"):
                self.llm = get_llm(temperature=0.0)
            
            with tracer.start_as_current_span("create_evaluator"):
                with tracer.start_as_current_span("get_embed_model"):
                    embed_model = get_embed_model()
                
                with tracer.start_as_current_span("instantiate_evaluator"):
                    self.evaluator = Evaluator(
                        llm=self.llm,
                        embedder=embed_model,
                    )

    def _messages_to_chathistory(
        self, messages: Optional[List[Dict[str, str]]] = None
    ) -> List[ChatMessage]:
        with tracer.start_as_current_span("messages_to_chathistory") as span:
            if messages:
                span.set_attribute("messages_count", len(messages))
            
            chat_history = []
            if messages:
                for message in messages:
                    user_content = message["question"]
                    assistant_content = (
                        message["answer"].split("Rif:")[0].strip()
                        if (
                            message
                            and message.get("answer")
                            and message.get("answer") is not None
                        )
                        else None
                    )
                    chat_history += [
                        ChatMessage(
                            role=MessageRole.USER,
                            content=user_content,
                        ),
                        ChatMessage(
                            role=MessageRole.ASSISTANT,
                            content=assistant_content,
                        ),
                    ]

            return chat_history

    def evaluate(
        self,
        trace_id: str,
        query_str: str,
        response_str: str,
        retrieved_contexts: List[str],
        messages: Optional[List[Dict[str, str]]] | None = None,
    ) -> dict:
        with tracer.start_as_current_span("judge_evaluate_method") as span:
            span.set_attribute("trace_id", trace_id)
            span.set_attribute("has_messages", messages is not None)
            span.set_attribute("contexts_count", len(retrieved_contexts))

            if messages is not None:
                with tracer.start_as_current_span("condense_query"):
                    chat_history = self._messages_to_chathistory(messages)
                    condense_prompt = self.condense_prompt_str.format(
                        chat_history=chat_history, query_str=query_str
                    )
                    with tracer.start_as_current_span("llm_acomplete"):
                        condense_query_response = asyncio_run(self.llm.acomplete(condense_prompt))
                    query_str = condense_query_response.text.strip()

            with tracer.start_as_current_span("evaluator_evaluate"):
                scores = self.evaluator.evaluate(
                    query_str=query_str,
                    response_str=response_str,
                    retrieved_contexts=retrieved_contexts,
                )
            
            with tracer.start_as_current_span("add_langfuse_scores") as langfuse_span:
                langfuse_span.set_attribute("scores_count", len(scores))
                for key, value in scores.items():
                    add_langfuse_score(
                        trace_id=trace_id,
                        name=key,
                        value=value,
                        data_type="NUMERIC",
                    )

            return scores
