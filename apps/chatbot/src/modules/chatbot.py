import os
import re
import uuid
from datetime import datetime
from logging import getLogger
from typing import Union, Tuple, Sequence, Optional, List, Any

from llama_index.core import PromptTemplate
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.core.base.response.schema import Response, StreamingResponse, AsyncStreamingResponse, PydanticResponse
from llama_index.core.chat_engine.types import BaseChatEngine, AgentChatResponse, StreamingAgentChatResponse
from llama_index.core.async_utils import asyncio_run

from langfuse import Langfuse
from langfuse.llama_index import LlamaIndexInstrumentor
from langfuse.api.resources.trace.types.traces import Traces
from langfuse.model import TraceWithFullDetails

from src.modules.models import get_llm, get_embed_model
from src.modules.vector_database import load_automerging_index_redis, REDIS_KVSTORE, INDEX_ID
from src.modules.engine import get_automerging_engine
from src.modules.handlers import EventHandler
from src.modules.presidio import PresidioPII
from src.modules.utils import get_ssm_parameter

from dotenv import load_dotenv


load_dotenv()
logger = getLogger(__name__)


USE_PRESIDIO = True if (os.getenv("CHB_USE_PRESIDIO", "True")).lower() == "true" else False
USE_CHAT_ENGINE = True if (os.getenv("CHB_USE_CHAT_ENGINE", "True")).lower() == "true" else False 
USE_ASYNC = True if (os.getenv('CHB_ENGINE_USE_ASYNC', "True")).lower() == "true" else False
USE_STREAMING = True if (os.getenv('CHB_ENGINE_USE_STREAMING', "False")).lower() == "true" else False 
RESPONSE_TYPE = Union[
    Response, StreamingResponse, AsyncStreamingResponse, PydanticResponse,
    AgentChatResponse, StreamingAgentChatResponse
] 
SYSTEM_PROMPT = (
    "You are the virtual PagoPA S.p.A. assistant. Your name is Discovery.\n"
    "Your role is to provide accurate, professional, and helpful responses to users' queries regarding "
    "the PagoPA DevPortal documentation available at: https://dev.developer.pagopa.it"
)
LANGFUSE_PUBLIC_KEY = get_ssm_parameter(os.getenv("CHB_LANGFUSE_PUBLIC_KEY"), os.getenv("LANGFUSE_INIT_PROJECT_PUBLIC_KEY"))
LANGFUSE_SECRET_KEY = get_ssm_parameter(os.getenv("CHB_LANGFUSE_SECRET_KEY"), os.getenv("LANGFUSE_INIT_PROJECT_SECRET_KEY"))
LANGFUSE_HOST = os.getenv("CHB_LANGFUSE_HOST")
LANGFUSE = Langfuse(
    public_key = LANGFUSE_PUBLIC_KEY,
    secret_key = LANGFUSE_SECRET_KEY,
    host = LANGFUSE_HOST
)


class Chatbot():
    def __init__(
            self,
            params: dict,
            prompts: dict,
            use_chat_engine: bool | None = None
        ):

        self.params = params
        self.prompts = prompts
        self.use_chat_engine = use_chat_engine if use_chat_engine else USE_CHAT_ENGINE

        if USE_PRESIDIO:
            self.pii = PresidioPII(config=params["config_presidio"])

        self.model = get_llm()
        self.embed_model = get_embed_model()
        self.index = load_automerging_index_redis(
            self.model,
            self.embed_model,
            chunk_sizes=params["vector_index"]["chunk_sizes"],
            chunk_overlap=params["vector_index"]["chunk_overlap"]
        )
        self.qa_prompt_tmpl, self.ref_prompt_tmpl, self.condense_prompt_tmpl = self._get_prompt_templates()
        self.engine = get_automerging_engine(
            self.index,
            llm = self.model,
            text_qa_template = self.qa_prompt_tmpl,
            refine_template = self.ref_prompt_tmpl,
            condense_template = self.condense_prompt_tmpl,
            verbose = self.params["engine"]["verbose"],
            use_chat_engine = self.use_chat_engine
        )
        self.system_message = ChatMessage(
            role = self.model.metadata.system_role,
            content = SYSTEM_PROMPT 
        ) if isinstance(self.engine, BaseChatEngine) else None
        self.instrumentor = LlamaIndexInstrumentor(
            public_key = LANGFUSE_PUBLIC_KEY,
            secret_key = LANGFUSE_SECRET_KEY,
            host = LANGFUSE_HOST,
            mask=self._mask_trace
        )
        self.instrumentor._event_handler = EventHandler(langfuse_client=LANGFUSE)


    def _get_prompt_templates(self) -> Tuple[PromptTemplate, PromptTemplate]:

        # create templates
        qa_prompt_tmpl = PromptTemplate(
            self.prompts["qa_prompt_str"], 
            template_var_mappings={
                "context_str": "context_str",
                "query_str": "query_str"
            }
        )

        ref_prompt_tmpl = PromptTemplate(
            self.prompts["refine_prompt_str"],
            prompt_type="refine",
            template_var_mappings = {
                "existing_answer": "existing_answer",
                "context_msg": "context_msg"
            }
        )

        condense_prompt_tmpl = PromptTemplate(
            self.prompts["condense_prompt_str"],
            template_var_mappings={
                "chat_history": "chat_history",
                "question": "question"
            }
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

        if response_str is None or response_str == "Empty Response" or response_str == "" or len(nodes) == 0:
            response_str = "Mi dispiace, posso rispondere solo a domande riguardo la documentazione del DevPortal di PagoPA.\nProva a riformulare la domanda."
        else:
            response_str = self._unmask_reference(response_str, nodes)
        
        return response_str
    

    def _unmask_reference(self, response_str: str, nodes) -> str:

        pattern = r'[a-fA-F0-9]{64}'

        # Find all matches in the text
        hashed_urls = re.findall(pattern, response_str)

        logger.info(f"Generated answer has {len(hashed_urls)} references taken from {len(nodes)} nodes. First node has score: {nodes[0].score:.4f}.")
        for hashed_url in hashed_urls:
            url = REDIS_KVSTORE.get(
                collection=f"hash_table_{INDEX_ID}", 
                key=hashed_url
            )
            if url is None:
                url = "{URL}"

            response_str = response_str.replace(hashed_url, url)

        # remove sentences with generated masked url: {URL}
        parts = re.split(r"(?<=[\.\?\!\n])", response_str)
        filtered_parts = [part for part in parts if "{URL}" not in part] # filter out parts containing {URL}
        response_str = "".join(filtered_parts) # join the filtered parts back into a single string

        return response_str
    

    def mask_pii(self, message: str) -> str:
        if USE_PRESIDIO:
            try:
                split_message = message.split("Rif:")
                masked_message = self.pii.mask_pii(split_message[0])
                if len(split_message)>1:
                    masked_message = masked_message + "Rif:" + split_message[1]
                return masked_message
            except Exception as e:
                logger.warning(f"Exception: {e}")
        else:
            return message
        

    def _messages_to_chathistory(self, messages: Optional[List[dict]] = None) -> List[ChatMessage]:

        chat_history = [self.system_message]
        if messages:
            for message in messages:
                chat_history += [
                    ChatMessage(
                        role = MessageRole.USER,
                        content = message["question"]
                    ),
                    ChatMessage(
                        role = MessageRole.ASSISTANT,
                        content = message["answer"]
                    )
                ]

        return chat_history

    
    def get_trace(self, trace_id: str, as_dict: bool = False) -> TraceWithFullDetails | dict:

        try:
            trace = LANGFUSE.fetch_trace(trace_id)
            trace = trace.data
        except Exception as e:
            logger.error(e)

        if as_dict:
            return trace.dict()
        else:
            return trace


    def get_traces(
            self, 
            user_id: str | None = None,
            session_id: str | None = None,
            from_timestamp: datetime | None = None,
            to_timestamp: datetime | None = None,
            order_by: str | None = None,
            tags: str | Sequence[str] | None = None,
        ) -> Traces:

        try:
            traces = LANGFUSE.get_traces(
                user_id=user_id,
                session_id = session_id,
                from_timestamp = from_timestamp,
                to_timestamp = to_timestamp,
                order_by = order_by,
                tags = tags
            )
        except Exception as e:
            logger.error(e)

        return traces


    def add_langfuse_tag(self, trace_id: str, tag: str) -> None:
        with self.instrumentor.observe(trace_id=trace_id) as trace:
            trace_info = self.get_trace(trace_id, as_dict=False)
            if tag not in trace_info.tags:
                trace.update(
                    tags = trace_info.tags + [tag]
                )
                logger.info(f"Added tag {tag} to trace {trace_id}")
            else:
                logger.warning(f"Tag {tag} already present in trace {trace_id}")


    def remove_langfuse_tag(self, trace_id: str, tag: str) -> None:
        with self.instrumentor.observe(trace_id=trace_id) as trace:
            trace_info = self.get_trace(trace_id, as_dict=False)
            if tag in trace_info.tags:
                trace_info.tags.pop(trace_info.tags.index(tag))
                trace.update(
                    tags = trace_info.tags
                )
                logger.info(f"Removed tag {tag} from trace {trace_id}")
            else:
                logger.warning(f"Tag {tag} not present in trace {trace_id}")


    def _mask_trace(self, data: Any) -> None:
        
        if isinstance(data, dict):
            for key, value in data.items():
                
                if isinstance(value, str):
                    data[key] = self.mask_pii(value)

                if isinstance(value, list):
                    for message in value:
                        if isinstance(message, ChatMessage):
                            message.content = self.mask_pii(message.content)
                        if isinstance(message, str):
                            message = self.mask_pii(message)

                if isinstance(value, dict):
                    for k, v in value.items():
                        if isinstance(v, list):
                            for message in v:
                                if isinstance(message, ChatMessage):
                                    message.content = self.mask_pii(message.content)
                                if isinstance(message, str):
                                    message = self.mask_pii(message)
                        if isinstance(v, str):
                            value[k] = self.mask_pii(v)

        if isinstance(data, str):
            data = self.mask_pii(data)

        return data


    def chat_generate(
            self, 
            query_str: str,
            trace_id: str | None = None,
            session_id: str | None = None,
            user_id: str | None = None,
            messages: Optional[List[dict]] = None,
            tags: Union[str, List[str]] | None = None
        ) -> str:


        chat_history = self._messages_to_chathistory(messages)
        
        if not trace_id:
            logger.debug(f"[Langfuse] Trace id not provided. Generating a new one")
            trace_id = str(uuid.uuid4())

        logger.info(f"[Langfuse] Trace id: {trace_id}")

        with self.instrumentor.observe(
            trace_id = trace_id,
            session_id = session_id,
            user_id = user_id,
            tags = tags
        ):

            try:
                if USE_ASYNC and not USE_STREAMING:
                    engine_response = asyncio_run(self.engine.achat(query_str, chat_history))
                elif not USE_ASYNC and USE_STREAMING:
                    engine_response = self.engine.stream_chat(query_str, chat_history)
                elif USE_ASYNC and USE_STREAMING:
                    engine_response = asyncio_run(self.engine.astream_chat(query_str, chat_history))
                else:
                    engine_response = self.engine.chat(query_str, chat_history)
                response_str = self._get_response_str(engine_response)

            except Exception as e:
                response_str = "Scusa, non posso elaborare la tua richiesta.\nProva a chierdimi una nuova domanda."
                logger.error(f"Exception: {e}")

        self.instrumentor.flush()

        return response_str
