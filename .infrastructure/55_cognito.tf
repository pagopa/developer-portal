locals {
  from_email_address                     = format("Developer Portal <noreply@%s>", var.dns_domain_name)
  cognito_lambda_functions_artifact_path = "../apps/cognito-functions/out/cognito-functions.zip"
  /* FIXME: at the moment we need to add all the env variables required to all Lambda functions
   * because of a runtime error during the env parsing.
   * We should find a way to add only the variables required to the Lambda.
  */
  lambda_env_variables = {
    DOMAIN             = var.dns_domain_name
    FROM_EMAIL_ADDRESS = local.from_email_address
  }
}

module "cognito_custom_message_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "cognito_custom_message"
  description   = "The Lambda function executed to customize the email address verification message"
  handler       = "main.customMessageHandler"
  runtime       = "nodejs18.x"

  create_package                          = false
  local_existing_package                  = local.cognito_lambda_functions_artifact_path
  create_current_version_allowed_triggers = false

  environment_variables = local.lambda_env_variables

  allowed_triggers = {
    cognito_devportal = {
      principal  = "cognito-idp.amazonaws.com"
      source_arn = aws_cognito_user_pool.devportal.arn
    }
  }
}

module "cognito_post_confirmation_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "cognito_post_confirmation"
  description   = "The Lambda function executed after post confirmation of email address"
  handler       = "main.sensEmailHandler"
  runtime       = "nodejs18.x"

  create_package                          = false
  local_existing_package                  = local.cognito_lambda_functions_artifact_path
  create_current_version_allowed_triggers = false

  environment_variables = local.lambda_env_variables

  attach_policy_statements = true
  policy_statements = {
    ses = {
      effect    = "Allow",
      actions   = ["ses:SendEmail", "ses:SendRawEmail"],
      resources = [module.ses_developer_pagopa_it.ses_domain_identity_arn]
    },
  }

  allowed_triggers = {
    cognito_devportal = {
      principal  = "cognito-idp.amazonaws.com"
      source_arn = aws_cognito_user_pool.devportal.arn
    }
  }
}

resource "aws_cognito_user_pool" "devportal" {
  name                = "devportalpool"
  deletion_protection = "ACTIVE"

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
    custom_message    = module.cognito_custom_message_function.lambda_function_arn
    post_confirmation = module.cognito_post_confirmation_function.lambda_function_arn
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
  explicit_auth_flows                  = ["ADMIN_NO_SRP_AUTH"]
}

resource "aws_cognito_user_pool_domain" "devportal" {
  domain          = aws_acm_certificate.auth.domain_name
  certificate_arn = aws_acm_certificate.auth.arn
  user_pool_id    = aws_cognito_user_pool.devportal.id
}
