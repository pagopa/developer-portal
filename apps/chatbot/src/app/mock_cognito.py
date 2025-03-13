import boto3
import os
from moto import mock_aws

COGNITO_USERNAME = "test_user"
COGNITO_PASSWORD = "TestPassword123!"

@mock_aws
def mock_client():
    return boto3.client('cognito-idp', region_name=os.getenv('AWS_DEFAULT_REGION'))

client = mock_client()

@mock_aws
def mock_user_pool_id():
    # Create a user pool
    user_pool_response = client.create_user_pool(PoolName='test_pool')
    user_pool_id = user_pool_response['UserPool']['Id']
    return user_pool_id

@mock_aws
def mock_signup():
    user_pool_id = mock_user_pool_id()
    # Create a user pool client
    client_response = client.create_user_pool_client(
        UserPoolId=user_pool_id,
        ClientName='test_client'
    )
    client_id = client_response['UserPoolClient']['ClientId']

    # Sign up a new user
    client.sign_up(
        ClientId=client_id,
        Username=COGNITO_USERNAME,
        Password=COGNITO_PASSWORD
    )

    # Admin confirm the user (bypassing the confirmation step)
    client.admin_confirm_sign_up(
        UserPoolId=user_pool_id,
        Username=COGNITO_USERNAME,
    )

    # Initiate auth to obtain JWT tokens
    response = client.initiate_auth(
        ClientId=client_id,
        AuthFlow='USER_PASSWORD_AUTH',
        AuthParameters={
            'USERNAME': COGNITO_USERNAME,
            'PASSWORD': COGNITO_PASSWORD,
        }
    )

    access_token = response['AuthenticationResult']['AccessToken']

    print('Access Token:', access_token)
    print('User Pool ID:', user_pool_id)

    return {
        "access_token": access_token,
        "user_pool_id": user_pool_id
    }

if __name__ == "__main__":
    mock_signup()

