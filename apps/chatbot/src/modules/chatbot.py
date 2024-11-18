import os
import re
from logging import getLogger
from typing import Union, Tuple, Optional, List

from llama_index.core import PromptTemplate
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.core.base.response.schema import Response, StreamingResponse, AsyncStreamingResponse, PydanticResponse
from llama_index.core.chat_engine.types import AgentChatResponse, StreamingAgentChatResponse
from llama_index.core.async_utils import asyncio_run

from langfuse import Langfuse
from langfuse.llama_index import LlamaIndexInstrumentor

from src.modules.models import get_llm, get_embed_model
from src.modules.vector_database import load_automerging_index_redis, REDIS_KVSTORE, INDEX_ID
from src.modules.engine import get_automerging_engine
from src.modules.handlers import EventHandler
from src.modules.presidio import PresidioPII

from dotenv import load_dotenv


load_dotenv()
logger = getLogger(__name__)


USE_PRESIDIO = True if (os.getenv("CHB_USE_PRESIDIO", "True")).lower() == "true" else False
USE_ASYNC = True if (os.getenv('CHB_ENGINE_USE_ASYNC', "True")).lower() == "true" else False
USE_STREAMING = True if (os.getenv('CHB_ENGINE_USE_STREAMING', "False")).lower() == "true" else False 
USE_CHAT_ENGINE = True if (os.getenv('CHB_ENGINE_USE_CHAT_ENGINE', "True")).lower() == "true" else False 
RESPONSE_TYPE = Union[
    Response, StreamingResponse, AsyncStreamingResponse, PydanticResponse,
    AgentChatResponse, StreamingAgentChatResponse
]
START_CHAT_MESSAGE = [ChatMessage(
    role = MessageRole.ASSISTANT,
    content = (
        "Ciao! Io sono Discovery, l'assistente virtuale di PagoPA.\n"
        "Rispondo solo e soltanto a domande riguardanti la documentazione di PagoPA DevPortal, "
        "che puoi trovare sul sito: https://dev.developer.pagopa.it!"
    )
)]
LANGFUSE_PUBLIC_KEY = os.getenv("LANGFUSE_PUBLIC_KEY")
LANGFUSE_SECRET_KEY = os.getenv("LANGFUSE_SECRET_KEY")
LANGFUSE_HOST = os.getenv("LANGFUSE_HOST")
LANGFUSE_TAG = os.getenv("LANGFUSE_TAG", "development")
LANGFUSE = Langfuse(
    public_key = LANGFUSE_PUBLIC_KEY,
    secret_key = LANGFUSE_SECRET_KEY,
    host = LANGFUSE_HOST
)

class Chatbot():
    def __init__(
            self,
            params,
            prompts
        ):

        self.params = params
        self.prompts = prompts

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
            verbose=self.params["engine"]["verbose"]
        )
        self.instrumentor = LlamaIndexInstrumentor(
            public_key = LANGFUSE_PUBLIC_KEY,
            secret_key = LANGFUSE_SECRET_KEY,
            host = LANGFUSE_HOST,
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

        ref_prompt_tmpl = None
        # PromptTemplate(
        #     self.prompts["refine_prompt_str"],
        #     prompt_type="refine",
        #     template_var_mappings = {
        #         "existing_answer": "existing_answer",
        #         "query_str": "query_str"
        #     }
        # )

        condense_prompt_tmpl = PromptTemplate(
            self.prompts["condense_prompt_str"],
            template_var_mappings={
                "chat_history": "chat_history",
                "question": "question"
            }
        )

        return qa_prompt_tmpl, ref_prompt_tmpl, condense_prompt_tmpl


    def _get_response_str(self, engine_response: RESPONSE_TYPE) -> str:

        if USE_CHAT_ENGINE:
            if isinstance(engine_response, StreamingAgentChatResponse):
                response_str = ""
                for token in engine_response.response_gen:
                    response_str += token
            else:
                response_str = engine_response.response
        else:
            if isinstance(engine_response, StreamingResponse):
                engine_response = engine_response.get_response()

            response_str = engine_response.response.strip()
        
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

        chat_history = []
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
        
        chat_history = START_CHAT_MESSAGE + chat_history

        return chat_history
    

    def update_trace_with_feedback(self, trace_id, user_feedback) -> None:

        with self.instrumentor.observe(trace_id=trace_id) as trace:

            trace.update(
                metadata={
                    "user_feedback": user_feedback
                }
            )

    
    def get_trace(self, trace_id: str):

        trace = {}
        try:
            trace_langfuse = LANGFUSE.get_trace(trace_id)
            for item in trace_langfuse:
                key, value = item
                trace[key] = value
        except Exception as e:
            logger.error(e)

        return trace


    def generate(
            self, 
            query_str: str,
            trace_id: str | None = None,
            session_id: str | None = None,
            user_id: str | None = None,
            tags: Union[str, List[str]] | None = None
        ) -> str:

        if tags is None:
            tags = [LANGFUSE_TAG]
        elif isinstance(tags, str):
            tags = [tags]
        elif isinstance(tags, List[str]):
            pass
        else:
            raise ValueError(f"Error! The given tags: {tags} is not acceptable. It has to be a sting, a list of string, or None")

        with self.instrumentor.observe(
            trace_id = trace_id,
            session_id = session_id,
            user_id = user_id,
            tags = tags,
            metadata = {"user_feedback": None}
            ) as trace:

            try:
                engine_response = self.engine.query(query_str)
                response_str = self._get_response_str(engine_response)

            except Exception as e:
                response_str = "Scusa, non posso elaborare la tua richiesta.\nProva a chiedimi una nuova domanda."
                logger.error(f"Exception: {e}")
        
            trace.update(
                input=self.mask_pii(query_str),
                output=self.mask_pii(response_str),
            )

        self.instrumentor.flush()

        return response_str


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
        if tags is None:
            tags = [LANGFUSE_TAG]
        elif isinstance(tags, str):
            tags = [tags]
        elif isinstance(tags, List[str]):
            pass
        else:
            raise ValueError(f"Error! tags: {tags} is not acceptable. It has to be a sting, a list of string, or None")

        with self.instrumentor.observe(
            trace_id = trace_id,
            session_id = session_id,
            user_id = user_id,
            tags = tags,
            metadata = {"user_feedback": None}
        ) as trace:

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
                response_str = "Scusa, non posso elaborare la tua richiesta.\nProva a chiedimi una nuova domanda."
                logger.error(f"Exception: {e}")

            trace.update(
                input=self.mask_pii(query_str),
                output=self.mask_pii(response_str),
            )

        self.instrumentor.flush()

        return response_str
