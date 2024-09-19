import boto3
import logging

def get_ssm_parameter(name: str, default: str | None = None) -> str | None:
    """
    Retrieves a specific value from AWS Systems Manager's Parameter Store.

    :param name: The name of the parameter to retrieve.
    :param default: The default value to return if the parameter is not found.
    :return: The value of the requested parameter.
    """
    ssm = boto3.client('ssm')
    logging.debug(f"Getting parameter {name} from SSM")
    try: 
        # Get the requested parameter
        response = ssm.get_parameter(
            Name=name,
            WithDecryption=True
        )
    except boto3.botocore.errorfactory.ParameterNotFound:
        logging.warning(f"Parameter {name} not found in SSM, returning default")
        return default
    
    logging.debug(f"Parameter {name} retrieved from SSM")
    return response['Parameter']['Value']