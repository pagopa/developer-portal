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
from src.modules.vector_index import load_index_redis
from src.modules.documents import get_product_list
from src.modules.models import get_llm, get_embed_model
from src.modules.tools.rag_tool import get_query_engine_tool
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


DEVPORTAL_PRODUCTS = get_product_list() + ["api", "webinars"]
DEVPORTAL_RAG_TOOL_DESCRIPTION = (
    f"Use this tool for all technical, architectural, and integration-related queries regarding PagoPA Developer Portal products: {DEVPORTAL_PRODUCTS}. "
    "Use this tool when the user is an IT professional or a developer seeking to integrate or manage the PagoPA Developer Portal products. "
    "It contains API specifications, authentication methods, SDKs, technical onboarding for institutions, and backend configuration. "
    "DO NOT use this for general 'how to use' questions from citizens. "
    "Use this tool for API specifications, SDKs, technical onboarding processes for institutions (Ente Creditore) and PSPs, "
    "authentication methods (API Keys), environment configurations (checkout, eCommerce), and technical troubleshooting for developers. "
)
CITTADINO_RAG_TOOL_DESCRIPTION = (
    "Use this tool for all queries related to the end-user (citizen) experience of Italian digital platforms. "
    "This tool contains comprehensive information on the PagoPA products: SEND (Notifiche Digitali), the App IO, and the PagoPA payment ecosystem from a user's perspective. "
    "Consult this tool for questions about receiving digital notifications, using the App IO interface, paying taxes or fines as a citizen, "
    "troubleshooting payment receipts, and general help center inquiries (FAQ). "
    "DO NOT use this for technical integration or API queries. "
)


class Chatbot:
    def __init__(
        self,
    ):
        self.model = get_llm()
        self.embed_model = get_embed_model()
        self.qa_prompt_tmpl, self.ref_prompt_tmpl = self._get_prompt_templates()

        self.discovery = get_agent(
            name="DiscoveryAgent",
            tools=[
                get_query_engine_tool(
                    index=load_index_redis(index_id=SETTINGS.devportal_index_id),
                    name="DevPortalRAGTool",
                    description=DEVPORTAL_RAG_TOOL_DESCRIPTION,
                    text_qa_template=self.qa_prompt_tmpl,
                    refine_template=self.ref_prompt_tmpl,
                ),
                get_query_engine_tool(
                    index=load_index_redis(index_id=SETTINGS.cittadino_index_id),
                    name="CittadinoRAGTool",
                    description=CITTADINO_RAG_TOOL_DESCRIPTION,
                    text_qa_template=self.qa_prompt_tmpl,
                    refine_template=self.ref_prompt_tmpl,
                ),
            ],
        )

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

        chat_history = self._messages_to_chathistory(messages)

        try:
            engine_response = await self.discovery.run(query_str, chat_history)
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
