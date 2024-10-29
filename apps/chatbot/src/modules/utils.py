import os
import boto3
import logging
from dotenv import load_dotenv

load_dotenv()


AWS_ACCESS_KEY_ID = os.getenv("CHB_AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("CHB_AWS_SECRET_ACCESS_KEY")
AWS_DEFAULT_REGION = os.getenv("CHB_AWS_DEFAULT_REGION")
SSM_CLIENT = boto3.client(
    "ssm",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_DEFAULT_REGION
)


def get_ssm_parameter(name: str, default: str | None = None) -> str | None:
    """
    Retrieves a specific value from AWS Systems Manager's Parameter Store.

    :param name: The name of the parameter to retrieve.
    :param default: The default value to return if the parameter is not found.
    :return: The value of the requested parameter.
    """

    logging.debug(f"[utils.py - get_ssm_parameter] Getting parameter {name} from SSM")
    try: 
        # Get the requested parameter
        response = SSM_CLIENT.get_parameter(
            Name=name,
            WithDecryption=True
        )
    except SSM_CLIENT.exceptions.ParameterNotFound:
        logging.warning(f"Parameter {name} not found in SSM, returning default")
        return default
    
    logging.debug(f"[utils.py - get_ssm_parameter] Parameter {name} retrieved from SSM")
    return response["Parameter"]["Value"]


def put_ssm_parameter(name: str, value: str) -> None:

    logging.debug(f"[utils.py - put_ssm_parameter] Putting parameter {name} to SSM")
    try: 
        # Get the requested parameter
        SSM_CLIENT.put_parameter(
            Name=name,
            Value=value,
            Overwrite=True
        )
    except Exception as e:
        logging.error(e)
        