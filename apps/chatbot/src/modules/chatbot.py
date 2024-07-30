import os
import re
import logging
from typing import Dict, List, Union, Tuple

from langdetect import detect_langs

from llama_index.core import PromptTemplate
from llama_index.core.base.response.schema import (
    Response, StreamingResponse, AsyncStreamingResponse, PydanticResponse
)
from llama_index.embeddings.bedrock import BedrockEmbedding

from src.modules.async_bedrock import AsyncBedrock, MyBedrockEmbedding
from src.modules.vector_database import load_automerging_index, load_url_hash_table
from src.modules.retriever import get_automerging_query_engine


# LANGUAGES = {
#     'af': 'Afrikaans', 'ar': 'Arabo', 'bg': 'Bulgaro', 'bn': 'Bengalese',
#     'ca': 'Catalano', 'cs': 'Ceco', 'cy': 'Gallese', 'da': 'Danese',
#     'de': 'Tedesco', 'el': 'Greco', 'en': 'Inglese', 'es': 'Spagnolo',
#     'et': 'Estone', 'fa': 'Persiano (Farsi)', 'fi': 'Finlandese', 'fr': 'Francese',
#     'gu': 'Gujarati', 'he': 'Ebraico', 'hi': 'Hindi', 'hr': 'Croato',
#     'hu': 'Ungherese', 'id': 'Indonesiano', 'it': 'Italiano', 'ja': 'Giapponese',
#     'kn': 'Kannada', 'ko': 'Coreano', 'lt': 'Lituano', 'lv': 'Lettone',
#     'mk': 'Macedone', 'ml': 'Malayalam', 'mr': 'Marathi', 'ne': 'Nepalese',
#     'nl': 'Olandese', 'no': 'Norvegese', 'pa': 'Punjabi', 'pl': 'Polacco',
#     'pt': 'Portoghese', 'ro': 'Rumeno', 'ru': 'Russo', 'sk': 'Slovacco',
#     'sl': 'Sloveno', 'so': 'Somalo', 'sq': 'Albanese', 'sv': 'Svedese',
#     'sw': 'Swahili', 'ta': 'Tamil', 'te': 'Telugu', 'th': 'Thailandese',
#     'tl': 'Tagalog (Filippino)', 'tr': 'Turco', 'uk': 'Ucraino', 'ur': 'Urdu',
#     'vi': 'Vietnamita', 'zh-cn': 'Cinese Semplificato', 'zh-tw': 'Cinese Tradizionale'
# }
ITALIAN_THRESHOLD = 0.85
RESPONSE_TYPE = Union[
    Response, StreamingResponse, AsyncStreamingResponse, PydanticResponse
]


class Chatbot():
    def __init__(
            self,
            params,
            prompts,
            use_guardrail: bool = True
        ):

        self.params = params
        self.prompts = prompts
        self.use_guardrail = use_guardrail
        self.hash_table = load_url_hash_table(
            s3_bucket_name=os.getenv("AWS_S3_BUCKET"),
        )

        self.model = AsyncBedrock(
            aws_access_key_id=os.getenv("CHB_AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("CHB_AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("CHB_AWS_DEFAULT_REGION"),
            model=params["models"]["model_id"],
            temperature=params["models"]["temperature"],
            max_tokens=params["models"]["max_tokens"],
            use_guardrail=use_guardrail,
            model_kwargs={
                "topP": params["models"]["topP"]
            },
        )
        self.embed_model = BedrockEmbedding(
            model_name=params["models"]["emded_model_id"],
            aws_access_key_id=os.getenv("CHB_AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("CHB_AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("CHB_AWS_DEFAULT_REGION")
        )

        self.index = load_automerging_index(
            self.model,
            self.embed_model,
            save_dir=params["vector_index"]["path"],
            s3_bucket_name=os.getenv("CHB_AWS_S3_BUCKET"),
            region=os.getenv("CHB_AWS_DEFAULT_REGION"),
            chunk_sizes=params["vector_index"]["chunk_sizes"],
            chunk_overlap=params["vector_index"]["chunk_overlap"],
        )

        self.messages = []
        qa_prompt_tmpl, ref_prompt_tmpl = self._get_prompt_templates()
        self.engine = get_automerging_query_engine(
            self.index,
            llm=self.model,
            similarity_top_k=self.params["retriever"]["similarity_top_k"],
            similarity_cutoff=self.params["retriever"]["similarity_cutoff"],
            text_qa_template=qa_prompt_tmpl,
            refine_template=ref_prompt_tmpl,
            verbose=self.params["retriever"]["verbose"]
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


    def _update_messages(self, role: str, message: str):
        self.messages.append({"role": role, "text": message})


    def _messages_to_str(self, **kwargs) -> str:
        text = ""
        if len(self.messages) > 0:
            for speach in self.messages:
                text += f"{speach['role']}: {speach['text']}\n"

        return text


    def get_chat_history(self) -> List[Dict[str, str]]:
        return self.messages


    def _check_language(self, message_str):

        langs = detect_langs(message_str)
        it_score = 0.0
        for lang in langs:
            if lang.lang == "it":
                it_score = lang.prob

        logging.info(f"Detected '{langs[0].lang}' with score {langs[0].prob:.4f} at the last user's message.")

        return it_score
    
    

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
            response_str = self._unmask_add_reference(response_str, nodes)
        
        return response_str
    

    def _unmask_add_reference(self, response_str: str, nodes) -> str:

        pattern = r'[a-fA-F0-9]{64}'

        # Find all matches in the text
        hashed_urls = re.findall(pattern, response_str)

        if not hashed_urls:
            logging.info("Generated answer does not have a reference. Adding the first one in source nodes to it.")

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
                title, hashed_url = k
                if hashed_url in self.hash_table.keys():
                    url = self.hash_table[hashed_url]
                else:
                    url = "{URL}"

                if i == 0 and v == 1:
                    response_str += f"\n[{title}]({url})"
                    break
                else:
                    if v > 2:
                        response_str += f"\n[{title}]({url})"

        else:
            logging.info(f"Generated answer has {len(hashed_urls)} references.")
            for hashed_url in hashed_urls:
                if hashed_url in self.hash_table.keys():
                    url = self.hash_table[hashed_url]
                else:
                    url = "{URL}"
                response_str = response_str.replace(hashed_url, url)

        # remove potential generate masked url as {URL}
        parts = re.split(r"(?<=[\.\?\!\n])", response_str)
        filtered_parts = [part for part in parts if "{URL}" not in part] # filter out parts containing {URL}
        response_str = "".join(filtered_parts) # join the filtered parts back into a single string

        return response_str


    def generate(self, query_str: str) -> str:

        it_score = self._check_language(query_str)
        if it_score < ITALIAN_THRESHOLD:
            response_str = """Scusa, ma la domanda fornita è insufficiente per fornirti una risposta pertinente, oppure non è formulata in italiano.
            Per piacere, riformula la tua domanda.
            """

        else:

            engine_response = self.engine.query(query_str)
            response_str = self._get_response_str(engine_response)

        # update messages
        self._update_messages("User", query_str)
        self._update_messages("Assistant", response_str)

        return response_str
    

    async def agenerate(self, query_str: str) -> str:

        it_score = self._check_language(query_str)
        if it_score < ITALIAN_THRESHOLD:
            response_str = """Scusa, ma la domanda fornita è insufficiente per fornirti una risposta pertinente oppure non è formulata in italiano.
            Per piacere, riformula la tua domanda.
            """
        else:

            engine_response = self.engine.aquery(query_str)
            response_str = self._get_response_str(engine_response)

        self._update_messages("User", query_str)
        self._update_messages("Assistant", response_str)

        return response_str
