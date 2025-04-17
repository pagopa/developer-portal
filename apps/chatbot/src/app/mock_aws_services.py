import boto3
import os

from logging import getLogger

logger = getLogger(__name__)

COGNITO_USERNAME = "test_user"
COGNITO_PASSWORD = "TestPassword123!"

AWS_ACCESS_KEY_ID = os.getenv("CHB_AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("CHB_AWS_SECRET_ACCESS_KEY")
AWS_DEFAULT_REGION = os.getenv("CHB_AWS_DEFAULT_REGION")
AWS_ENDPOINT_URL = os.getenv("CHB_AWS_SSM_ENDPOINT_URL", None)


def mock_client_cognito():
    client = boto3.client(
        "cognito-idp",
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_DEFAULT_REGION,
        endpoint_url=AWS_ENDPOINT_URL,
    )
    return client


def mock_client_ssm():
    client = boto3.client(
        "ssm",
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_DEFAULT_REGION,
        endpoint_url=AWS_ENDPOINT_URL,
    )
    return client


client_cognito = mock_client_cognito()
client_ssm = mock_client_ssm()


def mock_user_pool_id():
    # Create a user pool
    user_pool_response = client_cognito.create_user_pool(PoolName='test_pool')
    user_pool_id = user_pool_response['UserPool']['Id']
    return user_pool_id


def mock_signup():
    user_pool_id = mock_user_pool_id()
    # Create a user pool client
    client_response = client_cognito.create_user_pool_client(
        UserPoolId=user_pool_id,
        ClientName='test_client'
    )
    client_id = client_response['UserPoolClient']['ClientId']

    # Sign up a new user
    client_cognito.sign_up(
        ClientId=client_id,
        Username=COGNITO_USERNAME,
        Password=COGNITO_PASSWORD
    )

    # Admin confirm the user (bypassing the confirmation step)
    client_cognito.admin_confirm_sign_up(
        UserPoolId=user_pool_id,
        Username=COGNITO_USERNAME,
    )

    # Initiate auth to obtain JWT tokens
    response = client_cognito.initiate_auth(
        ClientId=client_id,
        AuthFlow='USER_PASSWORD_AUTH',
        AuthParameters={
            'USERNAME': COGNITO_USERNAME,
            'PASSWORD': COGNITO_PASSWORD,
        }
    )

    access_token = response['AuthenticationResult']['AccessToken']

    return {
        "access_token": access_token,
        "user_pool_id": user_pool_id
    }


def ssm_put_parameter(name: str, value: str) -> str:
    client_ssm.put_parameter(
        Name=name,
        Value=value,
        Type="String",
        Overwrite=True,
    )

    return value
