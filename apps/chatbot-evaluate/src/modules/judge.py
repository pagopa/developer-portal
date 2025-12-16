from typing import Optional, List, Dict

from llama_index.core.async_utils import asyncio_run
from llama_index.core.llms import ChatMessage, MessageRole

from src.modules.logger import get_logger
from src.modules.models import get_llm, get_embed_model
from src.modules.evaluator import Evaluator
from src.modules.settings import SETTINGS


LOGGER = get_logger(__name__)


class Judge:
    def __init__(self):
        self.condense_prompt_str = SETTINGS.condense_prompt_str
        self.llm = get_llm(temperature=0.0)
        self.evaluator = Evaluator(
            llm=self.llm,
            embedder=get_embed_model(),
        )

    def _messages_to_chathistory(
        self, messages: Optional[List[Dict[str, str]]] = None
    ) -> List[ChatMessage]:

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
        query_str: str,
        response_str: str,
        retrieved_contexts: List[str],
        messages: Optional[List[Dict[str, str]]] | None = None,
    ) -> dict:

        if messages is not None:
            chat_history = self._messages_to_chathistory(messages)
            condense_prompt = self.condense_prompt_str.format(
                chat_history=chat_history, query_str=query_str
            )
            condense_query_response = asyncio_run(self.llm.acomplete(condense_prompt))
            query_str = condense_query_response.text.strip()

        scores = self.evaluator.evaluate(
            query_str=query_str,
            response_str=response_str,
            retrieved_contexts=retrieved_contexts,
        )

        return scores
