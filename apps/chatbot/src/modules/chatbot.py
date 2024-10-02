import os
import re
import logging
from typing import Union, Tuple


from llama_index.core import PromptTemplate
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.core.base.response.schema import (
    Response, StreamingResponse, AsyncStreamingResponse, PydanticResponse
)

from src.modules.models import get_llm, get_embed_model
from src.modules.vector_database import (
    load_automerging_index_s3, load_url_hash_table,
    load_automerging_index_redis, REDIS_KVSTORE
)
from src.modules.engine import get_automerging_query_engine


AWS_S3_BUCKET = os.getenv("CHB_AWS_S3_BUCKET")
ITALIAN_THRESHOLD = 0.85
NUM_MIN_WORDS_QUERY = 3
NUM_MIN_REFERENCES = 1
RESPONSE_TYPE = Union[
    Response, StreamingResponse, AsyncStreamingResponse, PydanticResponse
]

logging.getLogger().setLevel(os.getenv("LOG_LEVEL", "INFO"))

class Chatbot():
    def __init__(
            self,
            params,
            prompts,
        ):

        self.params = params
        self.prompts = prompts
        self.use_redis = params["vector_index"]["use_redis"]
        self.use_s3 = params["vector_index"]["use_s3"]

        if self.use_s3 and self.use_redis:
            raise Exception("Vector Store Error: use s3 or Redis or none of them.")

        self.model = get_llm()
        self.embed_model = get_embed_model()

        if self.use_redis:
            self.index = load_automerging_index_redis(
                self.model,
                self.embed_model,
                chunk_sizes=params["vector_index"]["chunk_sizes"],
                chunk_overlap=params["vector_index"]["chunk_overlap"]
            )

        elif self.use_s3:
            self.hash_table = load_url_hash_table(
                s3_bucket_name=AWS_S3_BUCKET,
            )
            self.index = load_automerging_index_s3(
                self.model,
                self.embed_model,
                save_dir=params["vector_index"]["path"],
                s3_bucket_name=AWS_S3_BUCKET,
                chunk_sizes=params["vector_index"]["chunk_sizes"],
                chunk_overlap=params["vector_index"]["chunk_overlap"],
            )
        else:
            self.hash_table = load_url_hash_table()
            self.index = load_automerging_index_s3(
                self.model,
                self.embed_model,
                save_dir=params["vector_index"]["path"],
                chunk_sizes=params["vector_index"]["chunk_sizes"],
                chunk_overlap=params["vector_index"]["chunk_overlap"],
            )

        self.history = [
            ChatMessage(
                role=MessageRole.ASSISTANT,
                content="""You are an Italian customer services chatbot. 
                Your name is Discovery and it is your duty to assist the user answering his questions about the PagoPA DevPortal documentation!
                """
            )
        ]
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


    def _update_history(self, role: MessageRole, message: str):
        self.history.append(ChatMessage(role=role, content=message))


    def reset_chat_history(self):
        self.history = []
        return self.history


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
            response_str = self._add_reference(response_str, nodes)
        
        return response_str
    

    def _add_reference(self, response_str: str, nodes) -> str:

        pattern = r'[a-fA-F0-9]{64}'

        # Find all matches in the text
        hashed_urls = re.findall(pattern, response_str)

        if not hashed_urls:
            num_refs = 0
            freq = {}
            for node in nodes:
                title = node.metadata["title"]
                hashed_url = node.metadata["filename"]
                if (title, hashed_url) not in freq.keys():
                    freq[(title, hashed_url)] = 1
                else:
                    freq[(title, hashed_url)] += 1

            freq_sorted = dict(sorted(freq.items(), key=lambda item: item[1], reverse=True))

            response_str += "\n\nRif:"

            for i, (k, v) in enumerate(freq_sorted.items()):
                
                if i == 0 and v == NUM_MIN_REFERENCES:
                    num_refs += 1
                    title = nodes[0].metadata["title"]
                    hashed_url = nodes[0].metadata["filename"]
                    if self.use_redis:
                        url = REDIS_KVSTORE.get(
                            collection="hash_table", 
                            key=hashed_url
                        )
                        if url is None:
                            url = "{URL}"
                    else:
                        if hashed_url in self.hash_table.keys():
                            url = self.hash_table[hashed_url]
                        else:
                            url = "{URL}"
                    response_str += f"\n[{title}]({url})"
                    break
                else:
                    if v > NUM_MIN_REFERENCES:
                        num_refs += 1
                        title, hashed_url = k
                        if self.use_redis:
                            url = REDIS_KVSTORE.get(
                                collection="hash_table", 
                                key=hashed_url
                            )
                            if url is None:
                                url = "{URL}"
                        else:
                            if hashed_url in self.hash_table.keys():
                                url = self.hash_table[hashed_url]
                            else:
                                url = "{URL}"
                        response_str += f"\n[{title}]({url})"

            logging.info(f"Generated answer had no references. Added {num_refs} references taken from {len(nodes)} nodes. First node has score: {nodes[0].score:.4f}.")

        else:
            logging.info(f"Generated answer has {len(hashed_urls)} references taken from {len(nodes)} nodes. First node has score: {nodes[0].score:.4f}.")
            for hashed_url in hashed_urls:
                if self.use_redis:
                    url = REDIS_KVSTORE.get(
                        collection="hash_table", 
                        key=hashed_url
                    )
                    if url is None:
                        url = "{URL}"
                else:
                    if hashed_url in self.hash_table.keys():
                        url = self.hash_table[hashed_url]
                    else:
                        url = "{URL}"
                response_str = response_str.replace(hashed_url, url)

        # remove sentences with generated masked url: {URL}
        parts = re.split(r"(?<=[\.\?\!\n])", response_str)
        filtered_parts = [part for part in parts if "{URL}" not in part] # filter out parts containing {URL}
        response_str = "".join(filtered_parts) # join the filtered parts back into a single string

        return response_str


    def generate(self, query_str: str) -> str:

        try:
            engine_response = self.engine.query(query_str)
            response_str = self._get_response_str(engine_response)

            self._update_history(MessageRole.USER, query_str)
            self._update_history(MessageRole.ASSISTANT, response_str)

        except Exception as e:
            exception_str = str(e)
            if "SAFETY" in exception_str:
                if "HARM_CATEGORY_HARASSMENT" in exception_str:
                    response_str = "Mi dispiace, ma non posso rispondere a domande offensive o minacciose."
                    logging.info("Gemini Safety: blocked query because retrieved HARM_CATEGORY_HARASSMENT in it.")
                if "HARM_CATEGORY_SEXUALLY_EXPLICIT" in exception_str:
                    response_str = "Mi dispiace, ma non posso rispondere a domande di natura sessualmente esplicita."
                    logging.info("Gemini Safety: blocked query because retrieved HARM_CATEGORY_SEXUALLY_EXPLICIT in it.")
                if "HARM_CATEGORY_HATE_SPEECH" in exception_str:
                    response_str = "Mi dispiace, ma non posso accettare discorsi di odio. Per favore, evita di usare linguaggio."
                    logging.info("Gemini Safety: blocked query because retrieved HARM_CATEGORY_HATE_SPEECH in it.")
                if "HARM_CATEGORY_DANGEROUS_CONTENT" in exception_str:
                    response_str = "Mi dispiace, ma non posso fornire informazioni che potrebbero essere pericolose o dannose."
                    logging.info("Gemini Safety: blocked query because retrieved HARM_CATEGORY_DANGEROUS_CONTENT in it.")
            else:
                logging.info(e)

        return response_str
