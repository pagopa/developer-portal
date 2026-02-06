from src.modules.logger import get_logger
from src.modules.settings import SETTINGS, AWS_SESSION
from src.modules.vector_index import REDIS_CLIENT
from src.modules.models import get_llm, get_embed_model


LOGGER = get_logger(__name__)


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
        assert SETTINGS.google_api_key is not None

    assert SETTINGS.index_id is not None


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
    query = "who are you?"
    try:
        llm = get_llm()
        embed_model = get_embed_model()
        _ = llm.complete(query)
        _ = embed_model.get_text_embedding(query)
        flag = True
    except Exception as e:
        LOGGER.error(e)

    assert flag is True
