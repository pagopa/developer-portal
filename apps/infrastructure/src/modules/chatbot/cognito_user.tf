locals {
  from_email_address = format("PagoPA DevPortal <noreply@%s>", var.dns_domain_name)
}

resource "aws_cognito_user_pool" "monitoring" {
  lifecycle {
    prevent_destroy = true
  }

  name                = "${local.prefix}-monitoring-user-pool"
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
    allow_admin_create_user_only = true
  }

  password_policy {
    minimum_length                   = 8
    require_lowercase                = true
    require_numbers                  = true
    require_uppercase                = true
    require_symbols                  = true
    temporary_password_validity_days = 7
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
}

resource "aws_cognito_user_pool_client" "langfuse" {
  name = "${local.prefix}-monitoring-langfuse"

  user_pool_id                  = aws_cognito_user_pool.monitoring.id
  generate_secret               = true
  prevent_user_existence_errors = "ENABLED"

  callback_urls = (var.environment == "dev" ?
    [
      "http://localhost:3001/api/auth/callback/cognito",
      "https://${local.monitoring_host}/api/auth/callback/cognito"
    ] :
    [
      "https://${local.monitoring_host}/api/auth/callback/cognito"
    ]
  )

  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["openid"]
  supported_identity_providers         = ["COGNITO"]
  explicit_auth_flows                  = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_USER_SRP_AUTH"]
  auth_session_validity                = 3

  refresh_token_validity = 30
  access_token_validity  = 1
  id_token_validity      = 1

  token_validity_units {
    refresh_token = "days"
    access_token  = "hours"
    id_token      = "hours"
  }
}

resource "aws_cognito_user_pool_domain" "monitoring" {
  domain       = "monitoring"
  user_pool_id = aws_cognito_user_pool.monitoring.id
}

resource "random_password" "master" {
  length           = 16
  special          = true
  min_upper        = 1
  min_special      = 1
  min_lower        = 1
  override_special = "!?"
}

resource "aws_cognito_user" "master" {
  user_pool_id   = aws_cognito_user_pool.monitoring.id
  username       = local.langfuse_master_email
  password       = random_password.master.result
  message_action = "SUPPRESS"
  attributes = {
    email          = local.langfuse_master_email
    email_verified = true
    given_name     = "Master"
    family_name    = "User"
  }
}

module "master_user_password" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/chatbot/monitoring/master_user_password"
  value                = random_password.master.result
  type                 = "SecureString"
  secure_type          = true
}

module "user_pool_client_id" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/chatbot/monitoring/user_pool_client_id"
  value                = aws_cognito_user_pool_client.langfuse.id
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}

module "user_pool_client_secret" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/chatbot/monitoring/user_pool_client_secret"
  value                = aws_cognito_user_pool_client.langfuse.client_secret
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}

module "user_pool_issuer" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/chatbot/monitoring/user_pool_issuer"
  value                = "https://${aws_cognito_user_pool.monitoring.endpoint}"
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}
