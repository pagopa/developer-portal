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
    minimum_length = 8
  }

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

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

resource "aws_cognito_user_pool_domain" "devportal" {
  domain          = aws_acm_certificate.auth.domain_name
  certificate_arn = aws_acm_certificate.auth.arn
  user_pool_id    = aws_cognito_user_pool.devportal.id
}
