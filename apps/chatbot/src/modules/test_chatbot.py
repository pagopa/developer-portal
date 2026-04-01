import os
import boto3
from llama_index.core.async_utils import asyncio_run

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS
from src.modules.vector_index import REDIS_CLIENT
from src.modules.models import get_llm, get_embed_model
from src.modules.chatbot import Chatbot


LOGGER = get_logger(__name__, level=SETTINGS.log_level)
CHATBOT = Chatbot()


def test_aws_credentials() -> None:
    identity = None
    try:
        session = boto3.Session(
            aws_access_key_id=os.getenv("CHB_AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("CHB_AWS_SECRET_ACCESS_KEY"),
        )
        sts = session.client("sts")
        identity = sts.get_caller_identity()

    except Exception as e:
        LOGGER.error(f"{str(e)}")

    assert identity is not None


def test_ssm_params() -> None:

    if SETTINGS.provider == "google":
        assert SETTINGS.google_service_account is not None

    assert SETTINGS.devportal_index_id is not None


def test_connection_redis() -> None:
    flag = False
    try:
        REDIS_CLIENT.ping()
        flag = True
    except Exception as e:
        LOGGER.error(e)

    assert flag is True


def test_models() -> None:

    flag = False
    try:
        _ = get_llm()
        _ = get_embed_model()
        flag = True
    except Exception as e:
        LOGGER.error(e)

    assert flag is True


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
                messages=[],
            )
        )
        response_json = asyncio_run(
            CHATBOT.chat_generate(
                query_str="sai dirmi di più?",
                messages=[{"question": query_str, "answer": response_json["response"]}],
            )
        )

    except Exception as e:
        LOGGER.error(e)
        response_json = {}

    assert response_json != {}


def test_async_safe_google_rerank() -> None:
    from unittest.mock import Mock, patch
    from llama_index.core.schema import NodeWithScore, TextNode, QueryBundle
    from src.modules.google_reranker import AsyncSafeGoogleRerank

    credentials = Mock()
    credentials.project_id = "test-project"

    try:
        reranker = AsyncSafeGoogleRerank(
            top_n=2,
            model="test-model",
            project_id="test-project",
            location="global",
            credentials=credentials,
        )
    except Exception as e:
        assert False, f"Failed to instantiate: {e}"

    async def mock_rank(*args, **kwargs):
        mock_response = Mock()
        mock_response.records = []
        return mock_response

    async def test_call():
        nodes = [NodeWithScore(node=TextNode(text="hello"), score=1.0)]
        query_bundle = QueryBundle(query_str="hi")

        with patch(
            "google.cloud.discoveryengine_v1.RankServiceAsyncClient"
        ) as MockClient:
            mock_instance = MockClient.return_value
            mock_instance.rank.side_effect = mock_rank

            results = await reranker._apostprocess_nodes(nodes, query_bundle)
            return results

    try:
        results = asyncio_run(test_call())
        assert isinstance(results, list)
    except Exception as e:
        assert False, f"Call inside loop failed with: {type(e).__name__}: {e}"
