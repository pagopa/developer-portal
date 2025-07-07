import os
import re
import json
import yaml
from pathlib import Path
from typing import Union, Tuple, Optional, List, Any, Dict

from llama_index.core import PromptTemplate
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.core.base.response.schema import (
    Response,
    StreamingResponse,
    AsyncStreamingResponse,
    PydanticResponse,
)
from llama_index.core.chat_engine.types import (
    AgentChatResponse,
    StreamingAgentChatResponse,
)
from llama_index.core.async_utils import asyncio_run
from langfuse.llama_index import LlamaIndexInstrumentor

from src.modules.logger import get_logger
from src.modules.models import get_llm, get_embed_model
from src.modules.vector_database import load_index_redis
from src.modules.engine import get_engine
from src.modules.handlers import EventHandler
from src.modules.presidio import PresidioPII
from src.modules.evaluator import Evaluator
from src.modules.monitor import (
    LANGFUSE_PUBLIC_KEY,
    LANGFUSE_SECRET_KEY,
    LANGFUSE_HOST,
    LANGFUSE_CLIENT,
    add_langfuse_score,
)


LOGGER = get_logger(__name__)
CWF = Path(__file__)
ROOT = CWF.parent.parent.parent.absolute().__str__()
WEBSITE_URL = os.getenv("CHB_WEBSITE_URL")
USE_PRESIDIO = (
    True if (os.getenv("CHB_USE_PRESIDIO", "True")).lower() == "true" else False
)
USE_ASYNC = (
    True if (os.getenv("CHB_ENGINE_USE_ASYNC", "True")).lower() == "true" else False
)
USE_STREAMING = (
    True
    if (os.getenv("CHB_ENGINE_USE_STREAMING", "False")).lower() == "true"
    else False
)
RESPONSE_TYPE = Union[
    Response,
    StreamingResponse,
    AsyncStreamingResponse,
    PydanticResponse,
    AgentChatResponse,
    StreamingAgentChatResponse,
]


class Chatbot:
    def __init__(
        self,
        params: dict | None = None,
        prompts: dict | None = None,
    ):
        self.params = (
            params
            if params
            else yaml.safe_load(open(os.path.join(ROOT, "config", "params.yaml"), "r"))
        )
        self.prompts = (
            prompts
            if prompts
            else yaml.safe_load(open(os.path.join(ROOT, "config", "prompts.yaml"), "r"))
        )

        if USE_PRESIDIO:
            self.pii = PresidioPII(config=params["config_presidio"])

        self.model = get_llm()
        self.judge = Evaluator(llm=get_llm())
        self.embed_model = get_embed_model()
        self.index = load_index_redis(
            self.model,
            self.embed_model,
            chunk_size=params["vector_index"]["chunk_size"],
            chunk_overlap=params["vector_index"]["chunk_overlap"],
        )
        self.qa_prompt_tmpl, self.ref_prompt_tmpl, self.condense_prompt_tmpl = (
            self._get_prompt_templates()
        )
        self.engine = get_engine(
            self.index,
            llm=self.model,
            system_prompt=self.prompts["system_prompt_str"],
            text_qa_template=self.qa_prompt_tmpl,
            refine_template=self.ref_prompt_tmpl,
            condense_template=self.condense_prompt_tmpl,
            verbose=self.params["engine"]["verbose"],
        )
        self.instrumentor = LlamaIndexInstrumentor(
            public_key=LANGFUSE_PUBLIC_KEY,
            secret_key=LANGFUSE_SECRET_KEY,
            host=LANGFUSE_HOST,
            mask=self._mask_trace,
        )
        self.instrumentor._event_handler = EventHandler(langfuse_client=LANGFUSE_CLIENT)

    def _get_prompt_templates(self) -> Tuple[PromptTemplate, PromptTemplate]:

        qa_prompt_tmpl = PromptTemplate(
            self.prompts["qa_prompt_str"],
            template_var_mappings={
                "context_str": "context_str",
                "query_str": "query_str",
            },
        )

        ref_prompt_tmpl = PromptTemplate(
            self.prompts["refine_prompt_str"],
            prompt_type="refine",
            template_var_mappings={
                "existing_answer": "existing_answer",
                "context_msg": "context_msg",
            },
        )

        condense_prompt_tmpl = PromptTemplate(
            self.prompts["condense_prompt_str"],
            template_var_mappings={
                "chat_history": "chat_history",
                "question": "question",
            },
        )

        return qa_prompt_tmpl, ref_prompt_tmpl, condense_prompt_tmpl

    def _get_response_str(self, engine_response: RESPONSE_TYPE) -> str:

        if isinstance(engine_response, StreamingAgentChatResponse):
            response_str = ""
            for token in engine_response.response_gen:
                response_str += token
        if isinstance(engine_response, AgentChatResponse):
            response_str = engine_response.response
        else:
            engine_response = engine_response.get_response()
            response_str = engine_response.response

        response_str = response_str.strip()
        nodes = engine_response.source_nodes

        if (
            response_str is None
            or response_str == "Empty Response"
            or response_str == ""
            or len(nodes) == 0
        ):
            response_str = (
                '{"response": "Mi dispiace, posso rispondere solo a domande riguardo '
                "la documentazione del DevPortal di PagoPA. "
                'Prova a riformulare la domanda.", '
                '"topics": ["none"], "references": []}'
            )
        if (
            re.search(r'"response":', response_str) is None
            and re.search(r'"topics":', response_str) is None
            and re.search(r'"references":', response_str) is None
        ):
            response_str = (
                '{{"response": "{response_str}", "topics": ["none"], "references": []}}'
            ).format(response_str=response_str)

        return response_str

    def mask_pii(self, message: str) -> str:
        if USE_PRESIDIO:
            try:
                split_message = message.split("Rif:")
                masked_message = self.pii.mask_pii(split_message[0])
                if len(split_message) > 1:
                    masked_message = masked_message + "Rif:" + split_message[1]
                return masked_message
            except Exception as e:
                LOGGER.debug(f"Exception: {e}")
        else:
            return message

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

    def _mask_trace(self, data: Any) -> Any:

        if isinstance(data, str):
            data = self.mask_pii(data)

        if isinstance(data, dict):
            for key, value in data.items():
                data[key] = self._mask_trace(value)

        if isinstance(data, list):
            for i, value in enumerate(data):
                data[i] = self._mask_trace(value)

        if isinstance(data, tuple):
            data_as_list = list(data)
            for i, value in enumerate(data_as_list):
                data_as_list[i] = self._mask_trace(value)
            data = tuple(data_as_list)

        if isinstance(data, ChatMessage):
            for i, block in enumerate(data.blocks):
                data.blocks[i].text = self._mask_trace(block.text)

        return data

    def chat_generate(
        self,
        query_str: str,
        trace_id: str,
        session_id: str | None = None,
        user_id: str | None = None,
        messages: Optional[List[Dict[str, str]]] | None = None,
    ) -> dict:

        chat_history = self._messages_to_chathistory(messages)
        LOGGER.info(f"Langfuse trace id: {trace_id}")

        with self.instrumentor.observe(
            trace_id=trace_id, session_id=session_id, user_id=user_id
        ) as trace:
            try:
                if USE_ASYNC and not USE_STREAMING:
                    engine_response = asyncio_run(
                        self.engine.achat(query_str, chat_history)
                    )
                elif not USE_ASYNC and USE_STREAMING:
                    engine_response = self.engine.stream_chat(query_str, chat_history)
                elif USE_ASYNC and USE_STREAMING:
                    engine_response = asyncio_run(
                        self.engine.astream_chat(query_str, chat_history)
                    )
                else:
                    engine_response = self.engine.chat(query_str, chat_history)

                retrieved_contexts = []
                for node in engine_response.source_nodes:
                    url = WEBSITE_URL + node.metadata["filepath"]
                    retrieved_contexts.append(f"URL: {url}\n\n{node.text}")

                response_str = self._get_response_str(engine_response)
            except Exception as e:
                response_str = (
                    '{"response": "Scusa, non posso elaborare la tua richiesta. '
                    'Prova a formulare una nuova domanda.", '
                    '"topics": ["none"], "references": []}'
                )
                retrieved_contexts = [""]
                LOGGER.error(f"Exception: {e}")

            try:
                if response_str[:7] == "```json" and response_str[-3:] == "```":
                    response_str = response_str[7:-3]
                response_str = response_str.strip()

                response_json = json.loads(response_str)
            except Exception as e:
                LOGGER.error(f"JSON parsing error: {e}. Response: {response_str}")
                response_json = {
                    "response": "Mi dispiace, non sono riuscito a elaborare la risposta.",
                    "topics": ["none"],
                    "references": [],
                    "contexts": [],
                }

            if "contexts" not in response_json.keys():
                response_json["contexts"] = retrieved_contexts

            trace.update(
                output=response_json["response"],
                metadata={"contexts": retrieved_contexts},
                tags=response_json["topics"],
            )
            trace.score(name="user-feedback", value=0, data_type="NUMERIC")
        self.instrumentor.flush()

        return response_json

    def get_final_response(self, response_json: dict) -> str:

        final_response = response_json["response"]
        if response_json["references"]:
            final_response += "\n\nRif:"
            for ref in response_json["references"]:
                title = ref["title"]
                url = WEBSITE_URL + ref["filepath"]
                final_response += f"\n[{title}]({url})"

        return final_response

    def evaluate(
        self,
        query_str: str,
        response_str: str,
        retrieved_contexts: List[str],
        trace_id: str,
        messages: Optional[List[Dict[str, str]]] | None = None,
    ) -> dict:

        if messages is not None:
            chat_history = self._messages_to_chathistory(messages)
            condense_prompt = self.prompts["condense_prompt_evaluation_str"].format(
                chat_history=chat_history, query_str=query_str
            )
            condense_query_response = asyncio_run(self.model.acomplete(condense_prompt))
            query_str = condense_query_response.text.strip()

        scores = self.judge.evaluate(
            query_str=query_str,
            response_str=response_str,
            retrieved_contexts=retrieved_contexts,
        )
        for key, value in scores.items():
            add_langfuse_score(
                trace_id=trace_id,
                name=key,
                value=value,
                data_type="NUMERIC",
            )

        return scores
