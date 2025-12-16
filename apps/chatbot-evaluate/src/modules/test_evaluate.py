from src.modules.logger import get_logger
from src.modules.models import get_llm, get_embed_model
from src.modules.judge import Judge
from src.modules.settings import AWS_SESSION, SETTINGS

LOGGER = get_logger(__name__)
JUDGE = Judge()


def test_aws_credentials() -> None:
    identity = None
    try:
        sts = AWS_SESSION.client("sts")
        identity = sts.get_caller_identity()

    except Exception as e:
        LOGGER.error(f"{str(e)}")

    assert identity is not None


def test_ssm_params() -> None:

    if SETTINGS.provider == "google":
        GOOGLE_API_KEY = SETTINGS.google_api_key
        assert GOOGLE_API_KEY is not None


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
        query_str=query_str,
        response_str=response_str,
        retrieved_contexts=contexts,
    )
