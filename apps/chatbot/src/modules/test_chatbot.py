import os
import yaml
import logging
from pathlib import Path

from src.modules.chatbot import Chatbot

logging.getLogger().setLevel(os.getenv("LOG_LEVEL", "INFO"))


CWF = Path(__file__)
ROOT = CWF.parent.parent.parent.absolute().__str__()
PARAMS = yaml.safe_load(open(os.path.join(ROOT, "config", "params.yaml"), "r"))
PROMPTS = yaml.safe_load(open(os.path.join(ROOT, "config", "prompts.yaml"), "r"))
CHATBOT = Chatbot(params=PARAMS, prompts=PROMPTS)


def test_prompt_templates():

    qa_prompt_tmpl, ref_prompt_tmpl = CHATBOT._get_prompt_templates()

    p1 = PROMPTS["qa_prompt_str"].format(context_str="aaaaa", query_str="bbbbb")
    p2 = qa_prompt_tmpl.format(context_str="aaaaa", query_str="bbbbb")
    p3 = PROMPTS["refine_prompt_str"].format(existing_answer="aaaaa", query_str="bbbbb", context_msg="ccccc")
    p4 = ref_prompt_tmpl.format(existing_answer="aaaaa", query_str="bbbbb", context_msg="ccccc")

    assert p1 == p2 and p3 == p4


def test_messages_to_chathistory():

    chat_history = CHATBOT._messages_to_chathistory()
    assert len(chat_history) == 1

    ###########################3

    messages = [
        {"question": "aaaa", "answer": "bbbb"},
        {"question": "cccc", "answer": "dddd"},
        {"question": "eeee", "answer": "ffff"},
    ]
    chat_history = CHATBOT._messages_to_chathistory(messages)

    assert len(chat_history) == 2 * len(messages) + 1


def test_pii_mask():
    masked_str = CHATBOT.mask_pii("Il mio nome e' Mario Rossi")
    assert masked_str == "Il mio nome e' <PERSON_1>"
