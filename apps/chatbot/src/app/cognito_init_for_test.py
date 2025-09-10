import boto3
import os

# same of docker/files/localstack/init/ready.d/init.sh
COGNITO_USER_POOL_ID = "eu-south-1_test123"
COGNITO_USER_POOL_CLIENT_ID = "clientid123"
COGNITO_USERNAME = "test_user"
COGNITO_PASSWORD = "TestPassword123!"

os.environ["AUTH_COGNITO_USERPOOL_ID"] = COGNITO_USER_POOL_ID


def access_token() -> str:
    client_cognito = boto3.client("cognito-idp")
    response = client_cognito.initiate_auth(
        ClientId=COGNITO_USER_POOL_CLIENT_ID,
        AuthFlow="USER_PASSWORD_AUTH",
        AuthParameters={
            "USERNAME": COGNITO_USERNAME,
            "PASSWORD": COGNITO_PASSWORD,
        },
    )
    return response["AuthenticationResult"]["AccessToken"]
