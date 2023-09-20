
resource "aws_cognito_user_pool" "devportal" {
  name = "devportalpool"

  user_pool_add_ons {
    advanced_security_mode = "OFF"
  }

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  admin_create_user_config {
    # allow user to create via signup page
    allow_admin_create_user_only = false
  }

  password_policy {
    minimum_length = 8
  }

}

resource "aws_cognito_user_pool_client" "devportal_website" {
  name = "devportal-website-client"

  user_pool_id                         = aws_cognito_user_pool.devportal.id
  generate_secret                      = false
  prevent_user_existence_errors        = "ENABLED"
  callback_urls                        = [format("https://%s", var.dns_domain_name)]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["openid"]
  supported_identity_providers         = ["COGNITO"]
}

resource "aws_cognito_user_pool_domain" "devportal" {
  domain          = "auth"
  certificate_arn = aws_acm_certificate.auth.arn
  user_pool_id    = aws_cognito_user_pool.devportal.id
}
