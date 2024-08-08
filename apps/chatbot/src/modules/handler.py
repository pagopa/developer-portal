import logging

from llama_index.core.instrumentation.event_handlers import BaseEventHandler
from llama_index.core.instrumentation.events.llm import LLMCompletionEndEvent, LLMChatEndEvent
from llama_index.core.instrumentation.events.embedding import EmbeddingEndEvent


class ModelEventHandler(BaseEventHandler):
    
    @classmethod
    def class_name(cls) -> str:
        """Class name."""
        return "ModelEventHandler"


    def handle(self, event):
        """Logic for handling event."""       

        if isinstance(event, (LLMCompletionEndEvent, LLMChatEndEvent)):
            logging.info(f"event_id: {event.id_}")
            logging.info(f"timestamp: {event.timestamp.strftime("%Y-%m-%d %H:%M:%S")}")
            logging.info(f"input tokens: {event.response.raw["inputTextTokenCount"]}")
            logging.info(f"output tokens: {event.response.raw["results"][0]["tokenCount"]}")
            logging.info(f"completion reason: {event.response.raw["results"][0]["completionReason"]}")
            logging.info(f"guardrail action: {event.response.raw["amazon-bedrock-guardrailAction"]}")

        elif isinstance(event, EmbeddingEndEvent):
            logging.info(f"Embedding {len(event.chunks)} text chunks")
