import boto3
import os

from logging import getLogger

logger = getLogger(__name__)

COGNITO_USERNAME = "test_user"
COGNITO_PASSWORD = "TestPassword123!"


client_cognito = boto3.client("cognito-idp")


def mock_user_pool_id() -> str:
    # Create a user pool
    user_pool_response = client_cognito.create_user_pool(PoolName='test_pool')
    user_pool_id = user_pool_response['UserPool']['Id']
    return user_pool_id


def mock_signup() -> dict:
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


