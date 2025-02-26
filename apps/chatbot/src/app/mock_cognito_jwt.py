import boto3
from moto import mock_aws

@mock_aws
def mock_signup_and_get_jwt():
    # Create a Cognito IDP client
    client = boto3.client('cognito-idp', region_name='us-east-1')

    # Create a user pool
    user_pool_response = client.create_user_pool(PoolName='test_pool')
    user_pool_id = user_pool_response['UserPool']['Id']

    # Create a user pool client
    client_response = client.create_user_pool_client(
        UserPoolId=user_pool_id,
        ClientName='test_client'
    )
    client_id = client_response['UserPoolClient']['ClientId']

    # Sign up a new user
    client.sign_up(
        ClientId=client_id,
        Username='test_user',
        Password='TestPassword123!'
    )

    # Admin confirm the user (bypassing the confirmation step)
    client.admin_confirm_sign_up(
        UserPoolId=user_pool_id,
        Username='test_user'
    )

    # Initiate auth to obtain JWT tokens
    response = client.initiate_auth(
        ClientId=client_id,
        AuthFlow='USER_PASSWORD_AUTH',
        AuthParameters={
            'USERNAME': 'test_user',
            'PASSWORD': 'TestPassword123!'
        }
    )

    # Extract the JWT token from the response
    return response['AuthenticationResult']['AccessToken']
