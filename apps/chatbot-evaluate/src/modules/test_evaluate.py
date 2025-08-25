import os
import boto3
import json

from src.modules.logger import get_logger
from src.modules.models import get_llm, get_embed_model
from src.modules.judge import Judge
from src.modules.monitor import LANGFUSE_CLIENT
from src.modules.settings import SETTINGS

LOGGER = get_logger(__name__)
JUDGE = Judge()
WEBSITE_URL = os.getenv("CHB_WEBSITE_URL")


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
        GOOGLE_API_KEY = SETTINGS.google_api_key
        assert GOOGLE_API_KEY is not None


def test_connection_langfuse():
    assert LANGFUSE_CLIENT.auth_check() is True


def test_models() -> None:

    flag = False
    try:
        _ = get_llm()
        _ = get_embed_model()
        flag = True
    except Exception as e:
        LOGGER.error(e)

    assert flag is True


def test_evaluation() -> None:

    contexts = [
        "text text text text text",
        "text text text text text",
        "text text text text text",
        "text text text text text",
    ]
    query_str = "text text text text text"
    response_str = "text text text text text"
    scores = JUDGE.evaluate(
        trace_id="test_trace_id",
        query_str=query_str,
        response_str=response_str,
        retrieved_contexts=contexts,
    )
