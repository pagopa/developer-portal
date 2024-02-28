locals {
  from_email_address = format("PagoPA DevPortal <noreply@%s>", var.dns_domain_name)
}

resource "aws_cognito_user_pool" "devportal" {
  lifecycle {
    prevent_destroy = true
  }

  name                = "devportalpool"
  deletion_protection = "ACTIVE"

  user_pool_add_ons {
    advanced_security_mode = "OFF"
  }

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  user_attribute_update_settings {
    attributes_require_verification_before_update = ["email"]
  }

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
    minimum_length                   = 8
    require_lowercase                = true
    require_numbers                  = true
    require_uppercase                = true
    require_symbols                  = true
    temporary_password_validity_days = 7
  }

  email_configuration {
    email_sending_account = "DEVELOPER"
    from_email_address    = local.from_email_address
    source_arn            = module.ses_developer_pagopa_it.ses_domain_identity_arn
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
  }

  lambda_config {
    custom_message                 = module.cognito_custom_message_function.lambda_function_arn
    post_confirmation              = module.cognito_post_confirmation_function.lambda_function_arn
    create_auth_challenge          = module.cognito_create_auth_challenge_function.lambda_function_arn
    define_auth_challenge          = module.cognito_define_auth_challenge_function.lambda_function_arn
    verify_auth_challenge_response = module.cognito_verify_auth_challenge_function.lambda_function_arn
  }

  # Custom attributes cannot be required.
  # Terraform cannot update or delete an attribute.
  # Terraform can add a new attribute as update in-place.
  # https://github.com/hashicorp/terraform-provider-aws/issues/24844
  schema {
    name                     = "email"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = true

    string_attribute_constraints {
      min_length = 1
      # https://www.rfc-editor.org/rfc/rfc2821#section-4.5.3.1
      max_length = 512
    }
  }

  schema {
    name                     = "given_name"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = true
    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

  schema {
    name                     = "family_name"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = true
    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

  schema {
    name                     = "privacy_accepted"
    attribute_data_type      = "Boolean"
    developer_only_attribute = false
    mutable                  = true
    required                 = false
  }

  schema {
    name                     = "mailinglist_accepted"
    attribute_data_type      = "Boolean"
    developer_only_attribute = false
    mutable                  = true
    required                 = false
  }

  schema {
    name                     = "job_role"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = false
    string_attribute_constraints {
      min_length = 1
      max_length = 2048
    }
  }

  schema {
    name                     = "company_type"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = false
    string_attribute_constraints {
      min_length = 1
      max_length = 2048
    }
  }

  schema {
    name                     = "user_preferences"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = false
    string_attribute_constraints {
      min_length = 1
      max_length = 2048
    }
  }

}

resource "aws_cognito_user_pool_client" "devportal_website" {
  name = "devportal-website-client"

  user_pool_id                  = aws_cognito_user_pool.devportal.id
  generate_secret               = false
  prevent_user_existence_errors = "ENABLED"

  callback_urls = (var.environment == "dev" ?
    [
      "http://localhost:3000/auth/callback/cognito",
      "http://localhost:3000/api/auth/callback/cognito",
      format("https://%s", var.dns_domain_name)
    ] :
    [
      format("https://%s", var.dns_domain_name)
    ]
  )

  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["openid"]
  supported_identity_providers         = ["COGNITO"]
  explicit_auth_flows                  = ["ALLOW_USER_SRP_AUTH", "ALLOW_CUSTOM_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
}

resource "aws_cognito_user_pool_domain" "devportal" {
  domain          = aws_acm_certificate.auth.domain_name
  certificate_arn = aws_acm_certificate.auth.arn
  user_pool_id    = aws_cognito_user_pool.devportal.id
}

resource "aws_cognito_user_group" "hosts" {
  name         = "hosts"
  user_pool_id = aws_cognito_user_pool.devportal.id
  role_arn     = aws_iam_role.devportal_authenticated_host_user.arn
}

# Alarms

## Cognito User Pool Sign Up Throttles
module "cognito_user_pool_sign_up_throttles_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | SignUp Throttles"
  actions_enabled   = true
  alarm_description = "This alarm helps to monitor the occurrence of throttled sign-up requests"
  metric_name       = "SignUpThrottles"
  namespace         = "AWS/Cognito"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 0
  statistic           = "Sum"
  unit                = "Count"
  period              = 60
  evaluation_periods  = 5
  datapoints_to_alarm = 5
  treat_missing_data  = "notBreaching" # No data in the period is considered as good.

  dimensions = {
    UserPool       = aws_cognito_user_pool.devportal.id
    UserPoolClient = aws_cognito_user_pool_client.devportal_website.id
  }
}

## Cognito User Pool Sign In Throttles
module "cognito_user_pool_sign_in_throttles_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | SignIn Throttles"
  actions_enabled   = true
  alarm_description = "This alarm helps to monitor the occurrence of throttled sign-in requests"
  metric_name       = "SignInThrottles"
  namespace         = "AWS/Cognito"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 0
  statistic           = "Sum"
  unit                = "Count"
  period              = 60
  evaluation_periods  = 5
  datapoints_to_alarm = 5
  treat_missing_data  = "notBreaching" # No data in the period is considered as good.

  dimensions = {
    UserPool       = aws_cognito_user_pool.devportal.id
    UserPoolClient = aws_cognito_user_pool_client.devportal_website.id
  }
}

## Cognito User Pool Token Refresh Throttles
module "cognito_user_pool_token_refresh_throttles_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | TokenRefresh Throttles"
  actions_enabled   = true
  alarm_description = "This alarm helps to monitor the occurrence of throttled token refresh requests"
  metric_name       = "TokenRefreshThrottles"
  namespace         = "AWS/Cognito"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 30 # TODO: change this after an analysis of historic data for this alarm
  statistic           = "Sum"
  unit                = "Count"
  period              = 60
  evaluation_periods  = 5
  datapoints_to_alarm = 5
  treat_missing_data  = "notBreaching" # No data in the period is considered as good.

  dimensions = {
    UserPool       = aws_cognito_user_pool.devportal.id
    UserPoolClient = aws_cognito_user_pool_client.devportal_website.id
  }
}
