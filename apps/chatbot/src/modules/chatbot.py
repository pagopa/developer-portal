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


QA_PROMPT_STR = """
You are an Italian customer services chatbot.
Given the context:
---------------------
{context_str}
---------------------
Query Rules:
1. Do not accept any query that requests or involves information that could identify a human being.
2. You must give information about yourself, your tasks, etc., when a user asks.
3. Block queries that are not in Italian.
4. Block queries containing offensive language, hate speech, or discriminatory content.
5. Do not accept queries that request speculative or unverified information.
---------------------
Response Guidelines:
- If any of the rules listed above are broken, respond with: "Non posso rispondere a questa domanda perché," followed by a comma-separated list of the violated rules.
- If the retrieved context is empty, reply with: "Mi dispiace, ma non posso fornire una risposta a questa domanda. Per piacere, riformula la domanda in maniera più dettagliata o chiedimene una nuova."
- If the query complies with the query rules listed above, generate an answer using only the retrieved context and not any prior knowledge.
- Keep the answer to three sentences maximum and ensure it is concise.
- Ensure the answer is respectful and does not disclose any sensitive or personal information.
- Ensure the answer has a reference link. If it is not possible, provide title of the source retrivied context.
- Translate the answer to Italian if it is not.

Reply to the query: {query_str}
Answer:
"""

REFINE_PROMPT_STR = """
Query: {query_str}
Existing Answer: {existing_answer}
---------------------
Refinement Guidelines:
- Refine the existing answer to better address the question while ensuring compliance with the rules.
- Use retrieved context only; do not introduce new information.
- Ensure the refined answer is concise and relevant, limited to three sentences.
- Ensure the refined answer does not disclose personal or sensitive information.
- Ensure the refined answer is respectful, accurate, and does not contain offensive or discriminatory content.
- Ensure the refined answer has a reference link. If it is not possible, provide title of the source retrivied context.
- Translate the refined answer to Italian if it is not.
---------------------
Task:
Refine the original answer to better answer the query according to the refinement guidlines listed above.
Refined Answer:
"""

# Refinement Guidelines:
# - Refine the existing answer to better address the question while ensuring compliance with the rules.
# - Use retrieved context only; do not introduce new information.
# - Provide the improved answer in three sentences or less.

class Chatbot():
    def __init__(
            self,
            params
        ):

        self.params = params

        self.model = AsyncBedrock(
            model=params["models"]["model_id"],
            temperature=params["models"]["temperature"],
            max_tokens=params["models"]["max_tokens"]
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
            }
        )

        ref_prompt_tmpl = PromptTemplate(
            REFINE_PROMPT_STR,
            prompt_type="refine",
            template_var_mappings = {
                "existing_answer": "existing_answer",
                "query_str": "query_str"
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


    def _check_language(self, message_str, role):

        lang = detect_language(message_str)
        logging.info(f"Detected '{lang}' at the last {role}'s message.")

        return lang


    def generate(self, query_str: str) -> str:

        query_lang = self._check_language(query_str, "User")
        if query_lang != "it":
            response_str = """Mi dispiace, ma non posso aiutarti. Accetto solo domande in italiano.
            Riformula la domanda in italiano oppure chiedimene una nuova.
            """

        else:

            response = self.engine.query(query_str)
            nodes = response.source_nodes
            response_str = response.response.strip()

            if response_str == "Empty Response" or response_str == "" or len(nodes) == 0:
                response_str = """Mi dispiace, ma non posso aiutarti perché la tua domanda è fuori contesto.
                Chiedimi una nuova domanda.
                """

            else:
                response_lang = self._check_language(response_str, "Assistant")
                if response_lang != "it":
                    logging.info(f"Translating response to Italian..")
                    translation = self.model.complete(f"Translate to Italian: {response_str}")
                    response_str = translation.text.strip()

                # update messages
                self._update_messages("User", query_str)
                self._update_messages("Assistant", response_str)

        return response_str


    async def agenerate(self, query_str: str) -> str:
        # TO DO
        return None

    #     query_lang = self._check_language(query_str, "User")
    #     if query_lang != "Italian":
    #         # query = model.acomplete(f"Translate to Italian: {query_str}")
    #         # query = asyncio.run(asyncio.gather(query))
    #         # query_str = query[0].response.strip()
    #         response_str = (
    #             f"Mi dispiace, ma non posso aiutarti. Accetto solo domande in italiano.\n"
    #             "Chiedimi la prossima domanda in italiano."
    #         )

    #     else:

    #         response = self.engine.aquery(query_str)

    #         return response
    

    # async def apost_processing(self):

    #     nodes = response.source_nodes
    #     response_str = response.response.strip()

    #     if response_str == "Empty Response" or response_str == "" or len(nodes) == 0:
    #         response_str = (
    #             "Mi dispiace, ma non posso aiutarti perché la tua domanda è fuori contesto.\n"
    #             "Chiedimi una nuova domanda."
    #         )

    #     else:
    #         response_lang = self._check_language(response_str, "Assistant")
    #         if response_lang != "Italian":
    #             logging.info(f"Translating it to Italian..")
    #             translation = asyncio.run(asyncio.gather(
    #                 self.model.acomplete(f"Traslate to Italian: {response_str}")
    #             ))[0]
    #             response_str = translation.text

    #         if len(nodes) > 0:
    #             metadata = nodes[0].metadata
    #             if metadata['source'] != "" and metadata['title'] != "":
    #                 response_str += f"\n\n**Link:** [{metadata['title']}]({metadata['source']})"

    #     # update messages
    #     self._update_messages("User", query_str)
    #     self._update_messages("Assistant", response_str)

    # return response_str
