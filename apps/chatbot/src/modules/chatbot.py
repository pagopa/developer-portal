import logging
from langdetect import detect as detect_language

from llama_index.core import PromptTemplate
from llama_index.embeddings.bedrock import BedrockEmbedding

from src.modules.async_bedrock import AsyncBedrock
from src.modules.vector_database import load_automerging_index
from src.modules.retriever import get_automerging_query_engine


LANGUAGES = {
    "it": "Italian",
    "en": "English",
    "de": "German",
    "es": "Spanish",
    "fr": "French",
    "pt": "Portuguese",
    "hr": "Croatian",
    "sr": "Serbian",
    "sv": "Swedish",
    "da": "Danish",
    "no": "Norwegian",	
    "fi": "Finnish",
    "ru": "Russian",
    "uk": "Ukrainian"
}


QA_PROMPT_STR = (
    "You are the chatbot for the Italian company PagoPA. Your name is PagLO.\n"
    "Given the context information here below:\n"
    "---------------------\n"
    "{context_str}\n"
    "---------------------\n"
    "Given the conversation between you and the User:\n"
    "---------------------\n"
    "{messages_str}\n"
    "---------------------\n"
    "Use the following pieces of retrieved context and not prior knowledge to answer the question: {query_str}\n"
    "Use three sentences maximum and keep the answer concise."
    "If you don't know the answer, just say that you cannot provide an answer and ask for another question.\n"
    "Always translate the answer to Italian."
    "Answer: "
)


REFINE_PROMPT_STR = (
    "The original <question> is as follows: {query_str}\n"
    "We have provided an <existing answer>: {existing_answer}\n"
    "We have the opportunity to refine the existing answer following the rules below:\n"
    "---------------------\n"
    "{rules_str}\n"
    "---------------------\n"
    "Given such rules, refine the <existing answer> to better answer the <question>.\n"
    "Refined Answer: "
)


def rules_fn(**kwargs):
    
    rules_str = (
        "1. Accetto solo domande in italiano;\n"
        "2. Scrivo le mie risposte solo in italiano;\n"
        "3. Quando possibile, fornisco il link della pagina dove ho trovato la risposta alla domanda fatta;\n"
        "4. Non rispondo ad alcuna domanda che è fuori dal contesto di \"PagoPA DevPortal\";\n"
        "5. Non accetto alcuna domanda e non fornisco alcuna risposta che fornisce informazioni che possono essere utilizzate per distinguere o rintracciare l'identità di un individuo."
    )
    return rules_str


class Chatbot():
    def __init__(
            self,
            params
        ):
        
        self.params = params

        self.model = AsyncBedrock(
            model=params["models"]["model_id"],
            model_kwargs={
                "temperature": params["models"]["temperature"]
            }
        )
        self.embed_model = BedrockEmbedding(
            model_name=params["models"]["emded_model_id"],
        )

        self.index = load_automerging_index(
            self.model,
            self.embed_model,
            save_dir=params["vector_index"]["path"],
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

    
    def _get_prompt_templates(self):

        # create templates
        qa_prompt_tmpl = PromptTemplate(
            QA_PROMPT_STR, 
            template_var_mappings={
                "context_str": "context_str",
                "query_str": "query_str"
            },
            function_mappings = {
                "messages_str": self._messages_to_str
            }
        )

        ref_prompt_tmpl = PromptTemplate(
            REFINE_PROMPT_STR, 
            template_var_mappings = {
                "existing_answer": "existing_answer",
                "query_str": "query_str"
            },
            function_mappings = {
                "rules_str": rules_fn
            }
        )

        return qa_prompt_tmpl, ref_prompt_tmpl
    
    
    def _update_messages(self, role, message):
        self.messages.append({"role": role, "text": message})

    
    def _messages_to_str(self, **kwargs):
        text = ""
        if len(self.messages) > 0:
            for speach in self.messages:
                text += f"{speach['role']}: {speach['text']}\n"

        return text


    def get_chat_history(self):
        return self.messages


    def generate(self, query_str):

        query_lang = LANGUAGES[detect_language(query_str)]
        logging.info(f"Detected {query_lang} language at the last user's query.")
        if query_lang != "Italian":
            # query = model.acomplete(f"Traslate to Italian: {query_str}")
            # query = asyncio.run(asyncio.gather(query))
            # query_str = query[0].response.strip()
            response_str = (
                f"Mi dispiace, ma non posso aiutarti. Accetto solo domande in italiano.\n"
                "Chiedimi la prossima domanda in italiano."
            )

        else:

            response = self.engine.query(query_str)
            nodes = response.source_nodes
            response_str = response.response.strip()

            if response_str == "Empty Response" or response_str == "" or len(nodes) == 0:
                response_str = (
                    "Mi dispiace, ma non posso aiutarti perché la tua domanda è fuori contesto.\n"
                    "Chiedimi una nuova domanda."
                )

            else:
                response_lang = LANGUAGES[detect_language(response_str)]
                logging.info(f"Detected {response_lang} for the generated answer.")
                if response_lang != "Italian":
                    logging.info(f"Detected {response_lang} at the generated response. Translating it to Italian..")
                    response = self.model.complete(f"Traslate to Italian: {response_str}")
                    response_str = response.text()

                if len(nodes) > 0:
                    metadata = nodes[0].metadata
                    if metadata['source'] != "" and metadata['title'] != "":
                        response_str += f"\n\n**Link:** [{metadata['title']}]({metadata['source']})"

            # update messages
            self._update_messages("User", query_str)
            self._update_messages("PagLO", response_str)

        return response_str
