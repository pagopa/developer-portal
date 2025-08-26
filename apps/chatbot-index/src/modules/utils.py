import os
import boto3

from src.modules.logger import get_logger

LOGGER = get_logger(__name__)
SSM_CLIENT = boto3.client(
    "ssm",
    aws_access_key_id=os.getenv("CHB_AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("CHB_AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("CHB_AWS_DEFAULT_REGION"),
    endpoint_url=os.getenv("CHB_AWS_SSM_ENDPOINT_URL", None),
)


def get_ssm_parameter(name: str | None, default: str | None = None) -> str | None:
    """
    Retrieves a specific value from AWS Systems Manager's Parameter Store.

    :param name: The name of the parameter to retrieve.
    :param default: The default value to return if the parameter is not found.
    :return: The value of the requested parameter.
    """

    LOGGER.info(f"get_ssm_parameter {name}...")

    if name is None:
        name = "/none/param"
    try:
        # Get the requested parameter
        response = SSM_CLIENT.get_parameter(Name=name, WithDecryption=True)
        value = response["Parameter"]["Value"]
    except SSM_CLIENT.exceptions.ParameterNotFound:
        LOGGER.warning(
            f"Parameter {name} not found in SSM, returning default: {default}"
        )
        return default

    return value


def put_ssm_parameter(name: str, value: str) -> None:
    """
    Puts a specific value into AWS Systems Manager's Parameter Store.
    :param name: The name of the parameter to put.
    :param value: The value to store in the parameter.
    """

    LOGGER.debug(f"Putting parameter {name} to SSM")
    try:
        SSM_CLIENT.put_parameter(
            Name=name,
            Value=value,
            Type="String",
            Overwrite=True,
        )
    except Exception as e:
        LOGGER.error(e)
