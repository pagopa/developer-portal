import os
import re
import yaml
from logging import getLogger
from pathlib import Path

from src.modules.vector_database import REDIS_CLIENT
from src.modules.models import get_llm, get_embed_model
from src.modules.chatbot import Chatbot, LANGFUSE


logger = getLogger(__name__)


CWF = Path(__file__)
ROOT = CWF.parent.parent.parent.absolute().__str__()
PARAMS = yaml.safe_load(open(os.path.join(ROOT, "config", "params.yaml"), "r"))
PROMPTS = yaml.safe_load(open(os.path.join(ROOT, "config", "prompts.yaml"), "r"))
CHATBOT = Chatbot(params=PARAMS, prompts=PROMPTS)


def test_connection_redis():
    flag = False
    try:
        REDIS_CLIENT.ping()
        flag = True
    except Exception as e:
        logger.error(e)

    assert flag == True


def test_connection_langfuse():
    assert LANGFUSE.auth_check() == True


def test_cloud_connection():

    flag = False
    try:
        _ = get_llm()
        _ = get_embed_model()
        flag = True
    except Exception as e:
        logger.error(e)

    assert flag == True


def test_prompt_templates():

    for prompt_str, template in zip(PROMPTS.values(), CHATBOT._get_prompt_templates()):
        vars_str = re.findall(r'\{(.*?)\}', prompt_str)
        vars_tmp = list(template.template_var_mappings.keys())
        assert vars_str == vars_tmp


def test_pii_mask():
    masked_str = CHATBOT.mask_pii("Il mio nome e' Mario Rossi")
    assert masked_str == "Il mio nome e' <PERSON_1>"


def test_messages_to_chathistory():

    chat_history = CHATBOT._messages_to_chathistory()
    assert len(chat_history) == 1

    messages = [
        {"question": "aaaa", "answer": "bbbb"},
        {"question": "cccc", "answer": "dddd"},
        {"question": "eeee", "answer": "ffff"},
    ]
    chat_history = CHATBOT._messages_to_chathistory(messages)

    assert len(chat_history) == 2 * len(messages) + 1


def test_chat_generation():

    query_str = "GPD gestisce i pagamenti spontanei?"

    try:
        res = CHATBOT.chat_generate(
            query_str = query_str,
            trace_id = "abcde",
            user_id = "user-test",
            session_id = "session-test",
            tags = "test"
        )
        res = CHATBOT.chat_generate(
            query_str = "sai dirmi di più?",
            trace_id = "fghik", 
            messages = [{"question": query_str, "answer": res}],
            user_id = "user-test",
            session_id = "session-test",
            tags = "test"
        )

        trace1 = CHATBOT.get_trace("abcde")
        print("trace 1:", trace1) 
        trace2 = CHATBOT.get_trace("fghik")
        print("trace 2:", trace2) 
    except Exception as e:
        logger.error(e)
        res = f"Something went wrong!"

    assert res != f"Something went wrong!"
