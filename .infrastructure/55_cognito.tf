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
    temporary_password_validity_days = 7
  }

  email_configuration {
    email_sending_account = "DEVELOPER"
    from_email_address    = format("Developer Portal <noreply@%s>", var.dns_domain_name)
    source_arn            = module.ses_developer_pagopa_it.ses_domain_identity_arn
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
