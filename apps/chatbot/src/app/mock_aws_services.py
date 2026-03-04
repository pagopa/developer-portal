from src.modules.logger import get_logger
from src.modules.settings import SETTINGS, AWS_SESSION

LOGGER = get_logger(__name__, level=SETTINGS.log_level)

COGNITO_USERNAME = "test_user"
COGNITO_PASSWORD = "TestPassword123!"


client_cognito = AWS_SESSION.client(
    "cognito-idp",
    region_name=SETTINGS.aws_cognito_region
)


def mock_signup() -> dict:
    user_pool_id = SETTINGS.auth_cognito_userpool_id

    client_response = client_cognito.create_user_pool_client(
        UserPoolId=user_pool_id, ClientName="test_client"
    )
    client_id = client_response["UserPoolClient"]["ClientId"]

    users = client_cognito.list_users(
        UserPoolId=user_pool_id, Filter=f'username="{COGNITO_USERNAME}"'
    )
    if users["Users"] == []:
        client_cognito.sign_up(
            ClientId=client_id, Username=COGNITO_USERNAME, Password=COGNITO_PASSWORD
        )

        client_cognito.admin_confirm_sign_up(
            UserPoolId=user_pool_id,
            Username=COGNITO_USERNAME,
        )

    response = client_cognito.initiate_auth(
        ClientId=client_id,
        AuthFlow="USER_PASSWORD_AUTH",
        AuthParameters={
            "USERNAME": COGNITO_USERNAME,
            "PASSWORD": COGNITO_PASSWORD,
        },
    )

    access_token = response["AuthenticationResult"]["AccessToken"]

    return {"access_token": access_token, "user_pool_id": user_pool_id}
