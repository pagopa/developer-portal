import os
import copy
from pathlib import Path
from typing import Union, Tuple, Optional, List, Any, Dict

from llama_index.core import PromptTemplate
from llama_index.core.async_utils import asyncio_run
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.core.base.response.schema import (
    Response,
    StreamingResponse,
    AsyncStreamingResponse,
    PydanticResponse,
)
from llama_index.core.agent.workflow import (
    AgentInput,
    AgentOutput,
    ToolCall,
    ToolCallResult,
    AgentStream,
    AgentSetup,
)
from llama_index.core.tools.types import ToolOutput
from llama_index.core.schema import QueryBundle
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
RESPONSE_TYPE = Union[
    Response,
    StreamingResponse,
    AsyncStreamingResponse,
    PydanticResponse,
    AgentInput,
    AgentOutput,
    AgentSetup,
    AgentStream,
    ToolCall,
    ToolCallResult,
    ToolOutput,
]


class Chatbot:
    def __init__(
        self,
        params: dict | None = None,
        prompts: dict | None = None,
    ):
        self.params = params
        self.prompts = prompts
        self.pii = PresidioPII(config=params["config_presidio"])
        self.model = get_llm()
        self.judge = Evaluator()
        self.embed_model = get_embed_model()
        self.qa_prompt_tmpl, self.ref_prompt_tmpl, self.condense_prompt_tmpl = (
            self._get_prompt_templates()
        )
        self.index = load_index_redis(
            self.model,
            self.embed_model,
            chunk_size=self.params["vector_index"]["chunk_size"],
            chunk_overlap=self.params["vector_index"]["chunk_overlap"],
        )
        self.engine = get_engine(
            self.index,
            llm=self.model,
            identity_prompt=self.prompts["identity_prompt_str"],
            text_qa_template=self.qa_prompt_tmpl,
            refine_template=self.ref_prompt_tmpl,
            verbose=self.params["engine"]["verbose"],
        )
        self.instrumentor = LlamaIndexInstrumentor(
            public_key=LANGFUSE_PUBLIC_KEY,
            secret_key=LANGFUSE_SECRET_KEY,
            host=LANGFUSE_HOST,
            mask=self._mask_trace,
        )
        self.instrumentor._event_handler = EventHandler(langfuse_client=LANGFUSE_CLIENT)

    def _get_prompt_templates(
        self,
    ) -> Tuple[PromptTemplate, PromptTemplate, PromptTemplate]:

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

    def _get_response_json(self, engine_response: RESPONSE_TYPE) -> dict:

        tool_calls = engine_response.tool_calls
        product_list = []
        references_list = []
        retrieved_contexts = []

        for tool_call in tool_calls:
            raw_output = tool_call.tool_output.raw_output
            product_list += getattr(raw_output, "products", [])
            references = getattr(raw_output, "references", [])

            for ref in references:
                references_list.append(f"[{ref.title}]({WEBSITE_URL}{ref.filepath})")

            nodes = getattr(raw_output, "source_nodes", [])
            for node in nodes:
                url = WEBSITE_URL + node.metadata["filepath"]
                retrieved_contexts.append(f"URL: {url}\n\n{node.text}")

        response_json = {
            "response": engine_response.response.content.strip(),
            "products": product_list,
            "references": references_list,
            "contexts": retrieved_contexts,
        }

        return response_json

    def mask_pii(self, message: str) -> str:
        try:
            split_message = message.split("Rif:")
            message = self.pii.mask_pii(split_message[0])
            if len(split_message) > 1:
                message += "Rif:" + split_message[1]

        except Exception as e:
            LOGGER.debug(f"Exception: {e}")

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
        """Mask PII recursively in data sent to Langfuse (without altering real output)."""

        if (
            isinstance(data, (str, list, dict, tuple))
            or isinstance(data, (QueryBundle, ChatMessage))
            or isinstance(data, RESPONSE_TYPE)
        ):
            try:
                masked_data = copy.deepcopy(data)

                if isinstance(masked_data, str):
                    return self.mask_pii(masked_data)

                if isinstance(masked_data, QueryBundle):
                    return self._mask_trace(masked_data.query_str)

                elif isinstance(masked_data, dict):
                    return {k: self._mask_trace(v) for k, v in masked_data.items()}

                elif isinstance(masked_data, list):
                    return [self._mask_trace(item) for item in masked_data]

                elif isinstance(masked_data, tuple):
                    return tuple(self._mask_trace(item) for item in masked_data)

                elif isinstance(masked_data, ChatMessage):
                    for i, block in enumerate(masked_data.blocks):
                        data.blocks[i].text = self._mask_trace(block.text)

                elif isinstance(masked_data, RESPONSE_TYPE):
                    for field in vars(masked_data):
                        value = getattr(masked_data, field)
                        setattr(masked_data, field, self._mask_trace(value))
                else:
                    pass

                return masked_data

            except Exception as e:
                LOGGER.error("Masking failed:", e)
        else:
            return data

    def chat_generate_with_final_response(
        self,
        query_str: str,
        trace_id: str,
        session_id: str | None = None,
        user_id: str | None = None,
        messages: Optional[List[Dict[str, str]]] | None = None,
    ) -> dict:
        response_json = self.chat_generate(
            query_str=query_str,
            trace_id=trace_id,
            session_id=session_id,
            user_id=user_id,
            messages=messages,
        )

        response_json["final_response"] = self.get_final_response(response_json)
        return response_json

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
                engine_response = asyncio_run(self.engine.run(query_str, chat_history))
                response_json = self._get_response_json(engine_response)

            except Exception as e:
                response_json = {
                    "response": "Scusa, non posso elaborare la tua richiesta.\nProva a formulare una nuova domanda.",
                    "products": ["none"],
                    "references": [],
                    "contexts": [],
                }
                LOGGER.error(f"Exception: {e}")

            trace.update(
                output=response_json["response"],
                metadata={"contexts": response_json["contexts"]},
                tags=response_json["products"],
            )
            trace.score(name="user-feedback", value=0, data_type="NUMERIC")
        self.instrumentor.flush()

        return response_json

    def get_final_response(self, response_json: dict) -> str:

        final_response = response_json["response"]

        if len(response_json["references"]) > 0:
            final_response += "\n\nRif:"
            for ref in response_json["references"]:
                final_response += "\n" + ref

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
