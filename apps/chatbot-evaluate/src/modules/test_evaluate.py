import os
import boto3
import yaml
from pathlib import Path

from src.modules.logger import get_logger
from src.modules.models import get_llm, get_embed_model
from src.modules.judge import Judge
from src.modules.monitor import LANGFUSE_CLIENT
from src.modules.utils import (
    get_ssm_parameter,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
)

LOGGER = get_logger(__name__)
CWF = Path(__file__)
ROOT = CWF.parent.parent.parent.absolute().__str__()
PROVIDER = "mock"
PROMPTS = yaml.safe_load(open(os.path.join(ROOT, "config", "prompts.yaml"), "r"))
JUDGE = Judge(provider=PROVIDER, prompts=PROMPTS)
WEBSITE_URL = os.getenv("CHB_WEBSITE_URL")


def test_aws_credentials() -> None:
    identity = None
    try:
        session = boto3.Session(
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        )
        sts = session.client("sts")
        identity = sts.get_caller_identity()

    except Exception as e:
        LOGGER.error(f"{str(e)}")

    assert identity is not None


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
