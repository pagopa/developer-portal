import boto3

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS

LOGGER = get_logger(__name__)

COGNITO_USERNAME = "test_user"
COGNITO_PASSWORD = "TestPassword123!"


client_cognito = boto3.client("cognito-idp")


def mock_signup(custom_username: str = None) -> dict:

    username = custom_username or COGNITO_USERNAME
    user_pool_id = SETTINGS.auth_cognito_userpool_id

    client_response = client_cognito.create_user_pool_client(
        UserPoolId=user_pool_id, ClientName="test_client"
    )
    client_id = client_response["UserPoolClient"]["ClientId"]

    LOGGER.info(f"mock_signup(custom_username={username})")

    users = client_cognito.list_users(
        UserPoolId=user_pool_id, Filter=f'username="{username}"'
    )
    if users["Users"] == []:
        client_cognito.sign_up(
            ClientId=client_id, Username=username, Password=COGNITO_PASSWORD
        )

        client_cognito.admin_confirm_sign_up(
            UserPoolId=user_pool_id,
            Username=username,
        )

    response = client_cognito.initiate_auth(
        ClientId=client_id,
        AuthFlow="USER_PASSWORD_AUTH",
        AuthParameters={
            "USERNAME": username,
            "PASSWORD": COGNITO_PASSWORD,
        },
    )

    access_token = response["AuthenticationResult"]["AccessToken"]

    return {"access_token": access_token, "user_pool_id": user_pool_id}
