import os
import re
import logging
from typing import Union, Tuple, Optional, List
import nest_asyncio

from llama_index.core import PromptTemplate
from llama_index.core.async_utils import asyncio_run
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.core.chat_engine.types import AgentChatResponse, StreamingAgentChatResponse

from src.modules.models import get_llm, get_embed_model
from src.modules.vector_database import load_automerging_index_redis, REDIS_KVSTORE, INDEX_ID
from src.modules.engine import get_automerging_engine
from src.modules.presidio import PresidioPII
from src.modules.dynamodb import Chatbot_DynamoDB


SESSION_ID = os.getenv("CHB_SESSION_ID")
USE_ASYNC = True if os.getenv("CHB_ENGINE_USE_ASYNC", "True") == "True" else False,
USE_STREAMING = True if os.getenv("CHB_ENGINE_USE_STREAMING", "False") == "True" else False
USE_PRESIDIO = True if os.getenv("CHB_USE_PRESIDIO", "True") == "True" else False
RESPONSE_TYPE = Union[
    AgentChatResponse, StreamingAgentChatResponse
]
PREFIX_MESSAGE = """\
Ciao! Io sono Discovery, l'assistente virtuale di PagoPA. \
Rispondo solo e soltanto a domande riguardanti la documentazione di PagoPA DevPortal, \
che puoi trovare sul sito: https://dev.developer.pagopa.it!\
"""
DYNAMODB = Chatbot_DynamoDB()

logging.getLogger().setLevel(os.getenv("LOG_LEVEL", "INFO"))
nest_asyncio.apply()


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
        self.chat_store = DYNAMODB.get_chat_store(
            table_name = "Temporary_Conversations",
            session_id = SESSION_ID
        )
        
        self.qa_prompt_tmpl, self.ref_prompt_tmpl = self._get_prompt_templates()
        self.engine = get_automerging_engine(
            self.index,
            llm=self.model,
            text_qa_template=self.qa_prompt_tmpl,
            refine_template=self.ref_prompt_tmpl,
            verbose=self.params["engine"]["verbose"]
        )


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
                "query_str": "query_str"
            }
        )

        return qa_prompt_tmpl, ref_prompt_tmpl


    def reset_chat_history(self, user_id: str) -> None:
        self.chat_store.delete_messages(key=user_id)


    def _get_response_str(self, engine_response: RESPONSE_TYPE) -> str:

        if isinstance(engine_response, StreamingAgentChatResponse):
            response_str = ""
            for token in engine_response.response_gen:
                response_str += token
        else:
            response_str = engine_response.response
        
        response_str = response_str.strip()
        nodes = engine_response.source_nodes

        if response_str is None or response_str == "Empty Response" or response_str == "" or len(nodes) == 0:
            response_str = """Mi dispiace, posso rispondere solo a domande riguardo la documentazione del [PagoPA DevPortal | Home](https://developer.pagopa.it/).
            Prova a riformulare la domanda.
            """
        else:
            response_str = self._unmask_reference(response_str, nodes)

        if "Step 2:" in response_str:
            response_str = response_str.split("Step 2:")[1].strip()
        
        return response_str
    

    def _unmask_reference(self, response_str: str, nodes) -> str:

        pattern = r'[a-fA-F0-9]{64}'

        # Find all matches in the text
        hashed_urls = re.findall(pattern, response_str)

        logging.info(f"Generated answer has {len(hashed_urls)} references taken from {len(nodes)} nodes. First node has score: {nodes[0].score:.4f}.")
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
            return self.pii.mask_pii(message)
        else:
            return message
        
    
    async def agenerate(self, query_str: str, chat_history: Optional[List[ChatMessage]]=None):
        if USE_STREAMING:
            return await self.engine.astream_chat(query_str, chat_history)
        else:
            return await self.engine.achat(query_str, chat_history)


    def generate(self, query_str: str, user_id: str) -> str:     

        # get the user's chat history and set it to memory
        chat_history = self.chat_store.get_messages(user_id)
        if not chat_history:
            chat_history = [
                ChatMessage(
                    role = MessageRole.ASSISTANT,
                    content = PREFIX_MESSAGE
                )
            ]

        try:
            if USE_ASYNC:
                engine_response = asyncio_run(self.agenerate(query_str, chat_history))
            else:
                if USE_STREAMING:
                    engine_response = self.engine.stream_chat(query_str, chat_history)
                else:
                    engine_response = self.engine.chat(query_str, chat_history)

            response_str = self._get_response_str(engine_response)

        except Exception as e:
            exception_str = str(e)
            if "SAFETY" in exception_str:
                if "HARM_CATEGORY_HARASSMENT" in exception_str:
                    response_str = "Mi dispiace, ma non posso rispondere a domande offensive o minacciose."
                    logging.info("Gemini Safety: blocked query because retrieved HARASSMENT content in it.")
                if "HARM_CATEGORY_SEXUALLY_EXPLICIT" in exception_str:
                    response_str = "Mi dispiace, ma non posso rispondere a domande di natura sessualmente esplicita."
                    logging.info("Gemini Safety: blocked query because retrieved SEXUALLY_EXPLICIT content in it.")
                if "HARM_CATEGORY_HATE_SPEECH" in exception_str:
                    response_str = "Mi dispiace, ma non posso accettare discorsi di odio. Per favore, evita di usare linguaggio."
                    logging.info("Gemini Safety: blocked query because retrieved HATE_SPEECH content in it.")
                if "HARM_CATEGORY_DANGEROUS_CONTENT" in exception_str:
                    response_str = "Mi dispiace, ma non posso fornire informazioni che potrebbero essere pericolose o dannose."
                    logging.info("Gemini Safety: blocked query because retrieved DANGEROUS_CONTENT in it.")
            else:
                logging.warning(e)


        # update chat_history
        self.engine.reset()
        self.chat_store.add_message(
            key = user_id,
            message = [
                ChatMessage(
                    role=MessageRole.USER,
                    content=query_str
                ),
                ChatMessage(
                    role=MessageRole.ASSISTANT,
                    content=response_str
                ),
            ]
        )

        return response_str
