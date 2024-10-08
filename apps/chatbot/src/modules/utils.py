import os
import boto3
import logging
from dotenv import load_dotenv

load_dotenv()


AWS_ACCESS_KEY_ID = os.getenv("CHB_AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("CHB_AWS_SECRET_ACCESS_KEY")
AWS_DEFAUL_REGION = os.getenv("GOOGLE_AWS_DEFAULT_REGION")


def get_ssm_parameter(name: str, default: str | None = None) -> str | None:
    """
    Retrieves a specific value from AWS Systems Manager's Parameter Store.

    :param name: The name of the parameter to retrieve.
    :param default: The default value to return if the parameter is not found.
    :return: The value of the requested parameter.
    """
    ssm = boto3.client(
        "ssm",
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_DEFAUL_REGION
    )
    logging.debug(f"Getting parameter {name} from SSM")
    try: 
        # Get the requested parameter
        response = ssm.get_parameter(
            Name=name,
            WithDecryption=True
        )
    except ssm.exceptions.ParameterNotFound:
        logging.warning(f"Parameter {name} not found in SSM, returning default")
        return default
    
    logging.debug(f"Parameter {name} retrieved from SSM")
    return response["Parameter"]["Value"]