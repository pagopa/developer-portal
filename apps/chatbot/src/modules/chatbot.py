import os
import re
import logging
from typing import Union, Tuple

from llama_index.core import PromptTemplate
from llama_index.core.base.response.schema import (
    Response, StreamingResponse, AsyncStreamingResponse, PydanticResponse
)

from src.modules.models import get_llm, get_embed_model
from src.modules.vector_database import load_automerging_index_redis, REDIS_KVSTORE, INDEX_ID
from src.modules.engine import get_automerging_query_engine
from src.modules.presidio import PresidioPII

from dotenv import load_dotenv

load_dotenv()


USE_PRESIDIO = True if (os.getenv("CHB_USE_PRESIDIO", "True")).lower() == "true" else False
RESPONSE_TYPE = Union[
    Response, StreamingResponse, AsyncStreamingResponse, PydanticResponse
]

logging.getLogger().setLevel(os.getenv("LOG_LEVEL", "INFO"))


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
        self.qa_prompt_tmpl, self.ref_prompt_tmpl = self._get_prompt_templates()
        self.engine = get_automerging_query_engine(
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


    def _get_response_str(self, engine_response: RESPONSE_TYPE) -> str:

        if isinstance(engine_response, StreamingResponse):
            typed_response = engine_response.get_response()
        else:
            typed_response = engine_response
        
        response_str = typed_response.response.strip()
        nodes = typed_response.source_nodes

        if response_str is None or response_str == "Empty Response" or response_str == "" or len(nodes) == 0:
            response_str = """Mi dispiace, posso rispondere solo a domande riguardo la documentazione del [PagoPA DevPortal | Home](https://developer.pagopa.it/).
            Prova a riformulare la domanda.
            """
        else:
            response_str = self._unmask_reference(response_str, nodes)
        
        return response_str
    

    def _unmask_reference(self, response_str: str, nodes) -> str:

        pattern = r'[a-fA-F0-9]{64}'

        # Find all matches in the text
        hashed_urls = re.findall(pattern, response_str)

        logging.info(f"[chatbot.py] Generated answer has {len(hashed_urls)} references taken from {len(nodes)} nodes. First node has score: {nodes[0].score:.4f}.")
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
        try:
            return self.pii.mask_pii(message)
        except Exception as e:
            logging.warning(f"[chatbot.py] exception in mask_pii: {e}")


    def generate(self, query_str: str) -> str:

        try:
            engine_response = self.engine.query(query_str)
            response_str = self._get_response_str(engine_response)

        except Exception as e:
            response_str = "Mi dispiace, non mi è consentito elaborare contenuti inappropriati.\nRiformula la domanda in modo che non violi queste linee guida."
            logging.info(f"[chatbot.py] exception in generate: {e}")

        return response_str
