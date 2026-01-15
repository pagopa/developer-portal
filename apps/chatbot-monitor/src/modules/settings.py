import boto3
import os
import yaml
from pathlib import Path
from pydantic_settings import BaseSettings

from src.modules.logger import get_logger

LOGGER = get_logger(__name__, level=os.getenv("LOG_LEVEL", "info"))
CWF = Path(__file__)
ROOT = CWF.parent.parent.parent.absolute().__str__()
PARAMS = yaml.safe_load(open(os.path.join(ROOT, "config", "params.yaml"), "r"))
AWS_SESSION = boto3.Session()


def get_ssm_parameter(name: str | None, default: str | None = None) -> str | None:
    """
    Retrieves a specific value from AWS Systems Manager's Parameter Store.

    :param name: The name of the parameter to retrieve.
    :param default: The default value to return if the parameter is not found.
    :return: The value of the requested parameter.
    """

    ssm_client = AWS_SESSION.client("ssm")
    LOGGER.info(f"get_ssm_parameter {name}...")

    if name is None:
        name = "none-params-in-ssm"
    try:
        response = ssm_client.get_parameter(Name=name, WithDecryption=True)
        value = response["Parameter"]["Value"]
    except ssm_client.exceptions.ParameterNotFound:
        LOGGER.warning(
            f"Parameter {name} not found in SSM, returning default: {default}"
        )
        return default

    return value


class ChatbotSettings(BaseSettings):
    """Settings for the chatbot application."""

    # api keys
    langfuse_host: str = os.getenv("CHB_LANGFUSE_HOST")
    langfuse_public_key: str = get_ssm_parameter(
        os.getenv("CHB_AWS_SSM_LANGFUSE_PUBLIC_KEY"),
        os.getenv("LANGFUSE_INIT_PROJECT_PUBLIC_KEY"),
    )
    langfuse_secret_key: str = get_ssm_parameter(
        os.getenv("CHB_AWS_SSM_LANGFUSE_SECRET_KEY"),
        os.getenv("LANGFUSE_INIT_PROJECT_SECRET_KEY"),
    )
    presidio_config: dict = PARAMS["config_presidio"]
    query_table_prefix: str = os.getenv("CHB_QUERY_TABLE_PREFIX", "chatbot")
    log_level: str = os.getenv("LOG_LEVEL", "info")


SETTINGS = ChatbotSettings()
