import json
import boto3
import requests
from llama_index.core.async_utils import asyncio_run

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS
from src.modules.vector_database import REDIS_CLIENT
from src.modules.models import get_llm, get_embed_model
from src.modules.chatbot import Chatbot, LANGFUSE_CLIENT


LOGGER = get_logger(__name__)
CHATBOT = Chatbot()


def test_aws_credentials() -> None:
    identity = None
    try:
        session = boto3.Session(
            aws_access_key_id=SETTINGS.aws_access_key_id,
            aws_secret_access_key=SETTINGS.aws_secret_access_key,
        )
        sts = session.client("sts")
        identity = sts.get_caller_identity()

    except Exception as e:
        LOGGER.error(f"{str(e)}")

    assert identity is not None


def test_ssm_params() -> None:

    if SETTINGS.provider == "google":
        assert SETTINGS.google_api_key is not None
        assert SETTINGS.google_service_account is not None

    assert SETTINGS.index_id is not None
    assert SETTINGS.strapi_api_key is not None


def test_connection_redis() -> None:
    flag = False
    try:
        REDIS_CLIENT.ping()
        flag = True
    except Exception as e:
        LOGGER.error(e)

    assert flag is True


def test_connection_langfuse():
    assert LANGFUSE_CLIENT.auth_check() is True


def test_strapi_connection() -> None:

    url = SETTINGS.website_url.replace("https://", "https://cms.")
    url += "/api/apis-data?populate[product]=*&populate[apiRestDetail][populate][specUrls]=*"
    headers = {"Authorization": f"Bearer {SETTINGS.strapi_api_key}"}

    response = requests.get(url, headers=headers)
    LOGGER.info(f"Fetching API data from {url}")
    assert response.status_code == 200


def test_models() -> None:

    flag = False
    try:
        _ = get_llm()
        _ = get_embed_model()
        flag = True
    except Exception as e:
        LOGGER.error(e)

    assert flag is True


def test_pii_mask() -> None:
    masked_str = CHATBOT.mask_pii("Il mio nome e' Mario Rossi")
    assert masked_str == "Il mio nome e' <PERSON_1>"


def test_messages_to_chathistory() -> None:

    chat_history = CHATBOT._messages_to_chathistory()
    assert len(chat_history) == 0

    messages = [
        {"question": "aaaa", "answer": "bbbb"},
        {"question": "cccc", "answer": "dddd"},
        {"question": "eeee", "answer": "ffff"},
    ]
    chat_history = CHATBOT._messages_to_chathistory(messages)

    assert len(chat_history) == 2 * len(messages)


def test_chat_generation() -> None:

    query_str = "GPD gestisce i pagamenti spontanei?"

    try:
        response_json = asyncio_run(
            CHATBOT.chat_generate(
                query_str=query_str,
                trace_id="abcde",
                user_id="user-test",
                session_id="session-test",
            )
        )
        response_json = asyncio_run(
            CHATBOT.chat_generate(
                query_str="sai dirmi di più?",
                trace_id="fghik",
                messages=[{"question": query_str, "answer": response_json["response"]}],
                user_id="user-test",
                session_id="session-test",
            )
        )

    except Exception as e:
        LOGGER.error(e)
        response_json = {}

    assert response_json != {}
