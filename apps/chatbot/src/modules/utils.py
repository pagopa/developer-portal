import os
import boto3
from logging import getLogger

logger = getLogger(__name__)

AWS_ACCESS_KEY_ID = os.getenv("CHB_AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("CHB_AWS_SECRET_ACCESS_KEY")
AWS_DEFAULT_REGION = os.getenv("CHB_AWS_DEFAULT_REGION")
AWS_ENDPOINT_URL = os.getenv("CHB_AWS_SSM_ENDPOINT_URL", None)
SSM_CLIENT = boto3.client(
    "ssm",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_DEFAULT_REGION,
    endpoint_url=AWS_ENDPOINT_URL,
)


def get_ssm_parameter(name: str | None, default: str | None = None) -> str | None:
    """
    Retrieves a specific value from AWS Systems Manager's Parameter Store.

    :param name: The name of the parameter to retrieve.
    :param default: The default value to return if the parameter is not found.
    :return: The value of the requested parameter.
    """

    logger.warning(f"Getting parameter {name} from SSM. AWS_ENDPOINT_URL: {AWS_ENDPOINT_URL}")
    try:
        # Get the requested parameter
        response = SSM_CLIENT.get_parameter(Name=name, WithDecryption=True)
    except SSM_CLIENT.exceptions.ParameterNotFound:
        logger.warning(
            f"Parameter {name} not found in SSM, returning default: {default}"
        )
        return default

    logger.debug(f"Parameter {name} retrieved from SSM")
    return response["Parameter"]["Value"]


def put_ssm_parameter(name: str, value: str) -> None:

    logger.debug(f"Putting parameter {name} to SSM")
    try:
        SSM_CLIENT.put_parameter(
            Name=name,
            Value=value,
            Type="String",
            Overwrite=True,
        )
    except Exception as e:
        logger.error(e)
