import argparse
import time
import yaml
import logging
import gradio as gr
from src.modules.chatbot import Chatbot


logging.basicConfig(level=logging.INFO)


def print_like_dislike(x: gr.LikeData):
    print(x.index, x.value, x.liked)


def add_message(history, message):
    for x in message["files"]:
        history.append(((x,), None))
    if message["text"] is not None:
        history.append((message["text"], None))
    return history, gr.MultimodalTextbox(value=None, interactive=False)


def bot(history):

    response_str = chatbot.generate(history[-1][0])
    history[-1][1] = ""
    for character in response_str:
        history[-1][1] += character
        time.sleep(0.02)
        yield history


with gr.Blocks() as demo:

    gr.Markdown("# PagoPA Chatbot")

    gr_chatbot = gr.Chatbot(
        [],
        elem_id="chatbot",
        avatar_images=(
            "src/app/user.png",
            "src/app/chatbot.png"
        ),
        bubble_full_width=False
    )

    chat_input = gr.MultimodalTextbox(
        interactive=True,
        file_types=None,
        placeholder="Enter message..",
        show_label=False
    )

    chat_msg = chat_input.submit(add_message, [gr_chatbot, chat_input], [gr_chatbot, chat_input])
    bot_msg = chat_msg.then(bot, gr_chatbot, gr_chatbot, api_name="bot_response")
    bot_msg.then(lambda: gr.MultimodalTextbox(interactive=True), None, [chat_input])

    gr_chatbot.like(print_like_dislike, None, None)

    clear = gr.ClearButton(
        value="Clear chat",
        components=[chat_input, gr_chatbot]
    )

demo.queue()


if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument("--params", type=str, default="config/params.yaml", help="params path")
    parser.add_argument("--prompts", type=str, default="config/prompts.yaml", help="prompts path")
    args = parser.parse_args()

    # load parameters
    params = yaml.safe_load(open(args.params, "r"))
    prompts = yaml.safe_load(open(args.prompts, "r"))

    chatbot = Chatbot(params, prompts)

    demo.launch()