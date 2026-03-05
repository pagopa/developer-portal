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
from src.modules.models import get_llm, get_embed_model
from src.modules.tools import (
    get_query_engine_tool,
    follow_up_questions_tool,
    DEVPORTAL_TOOL_NAME,
    CITTADINO_TOOL_NAME,
    CHIPS_TOOL_NAME,
    DEVPORTAL_RAG_TOOL_DESCRIPTION,
    CITTADINO_RAG_TOOL_DESCRIPTION,
)
from src.modules.agents import get_discovery_agent
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

        tools = []
        try:
            devportal_index = load_index_redis(index_id=SETTINGS.devportal_index_id)
            tools.append(
                get_query_engine_tool(
                    index=devportal_index,
                    name=DEVPORTAL_TOOL_NAME,
                    description=DEVPORTAL_RAG_TOOL_DESCRIPTION,
                    text_qa_template=self.qa_prompt_tmpl,
                    refine_template=self.ref_prompt_tmpl,
                )
            )
        except Exception as e:
            LOGGER.error(f"Failed to load DevPortal index: {e}")
            raise

        try:
            cittadino_index = load_index_redis(index_id=SETTINGS.cittadino_index_id)
            tools += [
                get_query_engine_tool(
                    index=cittadino_index,
                    name=CITTADINO_TOOL_NAME,
                    description=CITTADINO_RAG_TOOL_DESCRIPTION,
                    text_qa_template=self.qa_prompt_tmpl,
                    refine_template=self.ref_prompt_tmpl,
                ),
                follow_up_questions_tool(name=CHIPS_TOOL_NAME),
            ]
        except Exception as e:
            LOGGER.error(f"Failed to load Cittadino index: {e}")
            raise

        try:
            self.discovery = get_discovery_agent(name="DiscoveryAgent", tools=tools)
        except Exception as e:
            LOGGER.error(f"Failed to initialize Discovery Agent: {e}")
            raise

    def _get_prompt_templates(
        self,
    ) -> Tuple[PromptTemplate, PromptTemplate]:
        """Initializes the prompt templates for question-answering and refining responses."""

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
        """Extracts the relevant information from the engine response and formats it into a JSON structure.
        Args:
            engine_response (RESPONSE_TYPE): The response object returned by the discovery agent, which may contain a structured response with the answer, products, references, and contexts.
        Returns:
            dict: A JSON-formatted dictionary containing the response, products, references, contexts, and spans.
        """

        if isinstance(engine_response.structured_response, dict):
            references_list = []
            if isinstance(engine_response.structured_response["references"], list):
                for ref in engine_response.structured_response["references"]:
                    references_list.append(f"[{ref['title']}]({ref['url']})")

            follow_up_tool_called = False
            retrieved_contexts = []
            for tool_call in engine_response.tool_calls:

                raw_output = tool_call.tool_output.raw_output
                nodes = getattr(raw_output, "source_nodes", [])
                if (
                    tool_call.tool_name in [DEVPORTAL_TOOL_NAME, CITTADINO_TOOL_NAME]
                    and nodes
                ):
                    retrieved_contexts.extend(
                        [
                            f"-------\nURL: {node.metadata['url']}\n\n{node.text}\n\n"
                            for node in nodes
                        ]
                    )

                if tool_call.tool_name == CHIPS_TOOL_NAME:
                    follow_up_tool_called = True

            chips = (
                engine_response.structured_response["follow_up_questions"]
                if follow_up_tool_called
                else []
            )

            response_json = {
                "response": engine_response.structured_response["response"],
                "products": engine_response.structured_response["products"],
                "references": references_list,
                "contexts": retrieved_contexts,
                "chips": chips,
                "spans": EXPORTER.spans,
            }

        else:
            response_json = {
                "response": "Scusa, non posso elaborare la tua richiesta.\n"
                + "Prova a formulare una nuova domanda.",
                "products": ["none"],
                "references": [],
                "contexts": [],
                "chips": [],
                "spans": [],
            }

        return response_json

    def _messages_to_chathistory(
        self, messages: Optional[List[Dict[str, str]]] = None
    ) -> List[ChatMessage]:
        """Converts a list of message dictionaries into a list of ChatMessage objects for the chat history.
        Args:
            messages (Optional[List[Dict[str, str]]]): A list of message dictionaries, where each dictionary has a "question" key for user messages and an "answer" key for assistant messages.
        Returns:
            List[ChatMessage]: A list of ChatMessage objects representing the chat history, with alternating user and assistant messages. The assistant messages are processed to remove any reference sections (indicated by "
        """

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
        knowledge_base: str | None = None,
    ) -> dict:
        """Generates a response to the user's query by running the discovery agent with the provided query and chat history, and formats the response into a JSON structure.
        Args:
            query_str (str): The user's query string.
            messages (Optional[List[Dict[str, str]]]): A list of message dictionaries representing the chat history. Each dictionary should have a "question" key for user messages and an "answer" key for assistant messages.
            knowledge_base (str | None): An optional knowledge base string to provide additional context for the query.
        Returns:
            dict: A JSON-formatted dictionary containing the response, products, references, contexts, and spans.
        """

        chat_history = self._messages_to_chathistory(messages)

        if knowledge_base:
            query_str = query_str + f" | Knowledge Base: {knowledge_base}"

        try:
            engine_response = await self.discovery.run(
                user_msg=query_str,
                chat_history=chat_history,
            )
            response_json = self._get_response_json(engine_response)
        except Exception as e:
            response_json = {
                "response": "Scusa, non posso elaborare la tua richiesta.\n"
                + "Prova a formulare una nuova domanda.",
                "products": ["none"],
                "references": [],
                "contexts": [],
                "chips": [],
                "spans": [],
            }
            LOGGER.warning(f"Exception: {e}")

        response_json["products"].append(f"chatbot@{SETTINGS.chatbot_release}")
        EXPORTER.spans = []

        return response_json
