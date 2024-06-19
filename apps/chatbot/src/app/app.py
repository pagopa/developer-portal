import argparse
import time
import yaml
import logging
import asyncio
import nest_asyncio

import gradio as gr
from langdetect import detect

from llama_index.core import PromptTemplate
from llama_index.embeddings.bedrock import BedrockEmbedding

from src.modules.async_bedrock import AsyncBedrock
from src.modules.vector_database import load_automerging_index
from src.modules.retriever import get_automerging_query_engine

# nest_asyncio.apply()
logging.basicConfig(level=logging.INFO)


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
    # "You are the chatbot for the Italian company PagoPA. Your name is PagLO.\n"
    "Given the context information here below:\n"
    "---------------------\n"
    "{context_str}\n"
    "---------------------\n"
    "Use the following pieces of retrieved context and not prior knowledge to answer the question: {query_str}\n"
    "Use three sentences maximum and keep the answer concise."
    "If you don't know the answer, just say that you cannot provide an answer and ask for another question.\n"
    "Always translate the answer to Italian."
    "Answer: "
)


REFINE_PROMPT_STR = (
    "The original question is as follows: {query_str}\n"
    "We have provided an existing answer: {existing_answer}\n"
    "We have the opportunity to refine the existing answer following the rules below:\n"
    "---------------------\n"
    "{rules_str}\n"
    "---------------------\n"
    "Given such rules, refine the <existing answer> to better answer the <question>.\n"
    "Refined Answer: "
)


def rules_fn(**kwargs):
    
    rules_str = (
        "- The refined answer has to be complete.\n"
    )
    return rules_str


def print_like_dislike(x: gr.LikeData):
    print(x.index, x.value, x.liked)


def add_message(history, message):
    for x in message["files"]:
        history.append(((x,), None))
    if message["text"] is not None:
        history.append((message["text"], None))
    return history, gr.MultimodalTextbox(value=None, interactive=False)


def get_response_str(query_str):

    query_lang = LANGUAGES[detect(query_str)]
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

        response = engine.query(query_str)
        nodes = response.source_nodes
        response_str = response.response.strip()

        if response_str == "Empty Response" or response_str == "" or len(nodes) == 0:
            response_str = (
                "Mi dispiace, ma non posso aiutarti perché la tua domanda è fuori contesto.\n"
                "Chiedimi una nuova domanda."
            )

        else:
            response_lang = LANGUAGES[detect(response_str)]
            print(response_str)
            logging.info(f"Detected {response_lang} for the generated answer.")
            if response_lang != "Italian":
                logging.info(f"Detected {response_lang} at the generated response. Translating it to Italian..")
                response = model.complete(f"Traslate to Italian: {response_str}")
                response_str = response.response.strip()

            if len(nodes) > 0:
                metadata = nodes[0].metadata
                if metadata['source'] != "" and metadata['title'] != "":
                    response_str += f"\n\n**Link:** [{metadata['title']}]({metadata['source']})"

    return response_str


def bot(history):

    response_str = get_response_str(history[-1][0])
    history[-1][1] = ""
    for character in response_str:
        history[-1][1] += character
        time.sleep(0.02)
        yield history


with gr.Blocks() as demo:

    gr.Markdown("# PagoPA Chatbot")

    chatbot = gr.Chatbot(
        [],
        elem_id="chatbot",
        bubble_full_width=False
    )

    chat_input = gr.MultimodalTextbox(interactive=True, file_types=["image"], placeholder="Enter message or upload file...", show_label=False)

    chat_msg = chat_input.submit(add_message, [chatbot, chat_input], [chatbot, chat_input])
    bot_msg = chat_msg.then(bot, chatbot, chatbot, api_name="bot_response")
    bot_msg.then(lambda: gr.MultimodalTextbox(interactive=True), None, [chat_input])

    chatbot.like(print_like_dislike, None, None)

demo.queue()

if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument("--params", type=str, default="params.yaml", help="params path")
    args = parser.parse_args()

    # load parameters
    params = yaml.safe_load(open(args.params, "r"))

    # load models
    model = AsyncBedrock(
        model=params["models"]["model_id"],
        model_kwargs={
            "temperature": params["models"]["temperature"]
        }
    )

    embed_model = BedrockEmbedding(
        model_name=params["models"]["emded_model_id"],
    )

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
        template_var_mappings = {
            "existing_answer": "existing_answer",
            "query_str": "query_str"
        },
        function_mappings = {
            "rules_str": rules_fn
        }
    )

    # load index vector database
    index = load_automerging_index(
        model,
        embed_model,
        save_dir=params["vector_index"]["path"],
        chunk_sizes=params["vector_index"]["chunk_sizes"],
        chunk_overlap=params["vector_index"]["chunk_overlap"],
    )

    # query engine
    engine = get_automerging_query_engine(
        index,
        llm=model,
        similarity_top_k=params["retriever"]["similarity_top_k"],
        similarity_cutoff=params["retriever"]["similarity_cutoff"],
        text_qa_template=qa_prompt_tmpl,
        refine_template=None,
        verbose=params["retriever"]["verbose"]
    )

    demo.launch()