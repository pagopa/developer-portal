from typing import Union, Tuple, Optional, List, Dict

from llama_index.core import PromptTemplate
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

from openinference.instrumentation.llama_index import LlamaIndexInstrumentor
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import SimpleSpanProcessor

from src.modules.logger import get_logger
from src.modules.telemetry import DictSpanExporter
from src.modules.models import get_llm, get_embed_model
from src.modules.agent import get_agent
from src.modules.settings import SETTINGS


LOGGER = get_logger(__name__, level=SETTINGS.log_level)
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

TRACE_PROVIDER = TracerProvider()
EXPORTER = DictSpanExporter()
TRACE_PROVIDER.add_span_processor(SimpleSpanProcessor(EXPORTER))
LlamaIndexInstrumentor().instrument(tracer_provider=TRACE_PROVIDER)


class Chatbot:
    def __init__(
        self,
    ):
        self.model = get_llm()
        self.embed_model = get_embed_model()
        self.qa_prompt_tmpl, self.ref_prompt_tmpl = self._get_prompt_templates()

    def _get_prompt_templates(
        self,
    ) -> Tuple[PromptTemplate, PromptTemplate]:

        qa_prompt_tmpl = PromptTemplate(
            SETTINGS.qa_prompt_str,
            template_var_mappings={
                "context_str": "context_str",
                "query_str": "query_str",
            },
        )

        ref_prompt_tmpl = PromptTemplate(
            SETTINGS.refine_prompt_str,
            prompt_type="refine",
            template_var_mappings={
                "existing_answer": "existing_answer",
                "context_msg": "context_msg",
            },
        )

        return qa_prompt_tmpl, ref_prompt_tmpl

    def _get_response_json(self, engine_response: RESPONSE_TYPE) -> dict:

        tool_calls = engine_response.tool_calls
        product_list = []
        references_list = []
        retrieved_contexts = []

        for tool_call in tool_calls:

            raw_output = tool_call.tool_output.raw_output
            product_list += getattr(raw_output, "products", [])
            references = getattr(raw_output, "references", [])

            references_list = [
                f"[{ref.title}]({SETTINGS.website_url}{ref.filepath})"
                for ref in references
            ]

            nodes = getattr(raw_output, "source_nodes", [])
            retrieved_contexts = [
                f"-------\nURL: {SETTINGS.website_url + node.metadata['filepath']}\n\n{node.text}\n\n"
                for node in nodes
            ]

        response_json = {
            "response": engine_response.response.content.strip(),
            "products": product_list,
            "references": references_list,
            "contexts": retrieved_contexts,
            "spans": EXPORTER.spans,
        }
        EXPORTER.spans = []

        return response_json

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

    async def chat_generate(
        self,
        query_str: str,
        messages: Optional[List[Dict[str, str]]] | None = None,
    ) -> dict:

        agent = get_agent(
            llm=self.model,
            embed_model=self.embed_model,
            text_qa_template=self.qa_prompt_tmpl,
            refine_template=self.ref_prompt_tmpl,
        )

        chat_history = self._messages_to_chathistory(messages)

        try:
            engine_response = await agent.run(query_str, chat_history)
            response_json = self._get_response_json(engine_response)

        except Exception as e:
            response_json = {
                "response": "Scusa, non posso elaborare la tua richiesta.\n"
                + "Prova a formulare una nuova domanda.",
                "products": ["none"],
                "references": [],
                "contexts": [],
                "spans": [],
            }
            LOGGER.error(f"Exception: {e}")

        response_json["products"].append(f"chatbot@{SETTINGS.chatbot_release}")

        return response_json
