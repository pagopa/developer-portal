resource "aws_cognito_identity_pool" "devportal" {
  lifecycle {
    prevent_destroy = true
  }

  identity_pool_name               = "devportal-identity"
  allow_unauthenticated_identities = false
  allow_classic_flow               = false

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.devportal_website.id
    provider_name           = aws_cognito_user_pool.devportal.endpoint
    server_side_token_check = false
  }

}

resource "aws_cognito_identity_pool_roles_attachment" "main" {
  identity_pool_id = aws_cognito_identity_pool.devportal.id

  role_mapping {
    identity_provider = format(
      "cognito-idp.%s.amazonaws.com/%s:%s",
      var.aws_region, aws_cognito_user_pool.devportal.id, aws_cognito_user_pool_client.devportal_website.id
    )
    ambiguous_role_resolution = "AuthenticatedRole"
    type                      = "Token"
  }

  roles = {
    authenticated = aws_iam_role.devportal_authenticated_user.arn
  }
}
