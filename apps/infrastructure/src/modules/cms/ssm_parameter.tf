## Secrets SSM Parameter Store for CMS Strapi
resource "random_password" "cms_database_password" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

module "secret_cms_database_password" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=28784d318fcb1d5b632e38a4c1f567dd138fcd83" # v1.1.2

  name        = "/cms/database/password"
  value       = random_password.cms_database_password.result
  secure_type = true
}

resource "random_password" "cms_admin_jwt_secret" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

module "secret_cms_admin_jwt_secret" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=28784d318fcb1d5b632e38a4c1f567dd138fcd83" # v1.1.2

  name        = "/cms/admin_jwt_secret"
  value       = random_password.cms_admin_jwt_secret.result
  secure_type = true
}

resource "random_password" "cms_jwt_secret" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

module "secret_cms_jwt_secret" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=28784d318fcb1d5b632e38a4c1f567dd138fcd83" # v1.1.2

  name        = "/cms/jwt_secret"
  value       = random_password.cms_jwt_secret.result
  secure_type = true
}

resource "random_password" "cms_app_keys" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

module "secret_cms_app_keys" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=28784d318fcb1d5b632e38a4c1f567dd138fcd83" # v1.1.2

  name        = "/cms/app_keys"
  value       = random_password.cms_app_keys.result
  secure_type = true
}

resource "random_password" "cms_api_token_salt" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

module "secret_cms_api_token_salt" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=28784d318fcb1d5b632e38a4c1f567dd138fcd83" # v1.1.2

  name        = "/cms/api_token_salt"
  value       = random_password.cms_api_token_salt.result
  secure_type = true
}

resource "random_password" "cms_transfer_token_salt" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

module "secret_cms_transfer_token_salt" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=28784d318fcb1d5b632e38a4c1f567dd138fcd83" # v1.1.2

  name        = "/cms/transfer_token_salt"
  value       = random_password.cms_transfer_token_salt.result
  secure_type = true
}

resource "random_password" "cms_github_pat" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

module "secret_cms_github_pat" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=28784d318fcb1d5b632e38a4c1f567dd138fcd83" # v1.1.2

  name                 = "/cms/github_pat"
  value                = random_password.cms_github_pat.result
  secure_type          = true
  ignore_value_changes = "true" # Ignore changes to value, because the value is updated manually
}

module "secret_cms_google_oauth_client_id" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=28784d318fcb1d5b632e38a4c1f567dd138fcd83" # v1.1.2

  name  = "/cms/google_oauth_client_id"
  value = "update-me"
  # Ignore changes to value, because the value is updated manually
  ignore_value_changes = "true"
}

module "secret_cms_google_oauth_client_secret" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=28784d318fcb1d5b632e38a4c1f567dd138fcd83" # v1.1.2

  name        = "/cms/google_oauth_client_secret"
  value       = "update-me"
  secure_type = true
  # Ignore changes to value, because the value is updated manually
  ignore_value_changes = "true"
}

module "secret_cms_google_gsuite_hd" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=28784d318fcb1d5b632e38a4c1f567dd138fcd83" # v1.1.2

  name  = "/cms/google_gsuite_hd"
  value = "update-me"
  # Ignore changes to value, because the value is updated manually
  ignore_value_changes = "true"
}

module "secret_cms_access_key_id" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=28784d318fcb1d5b632e38a4c1f567dd138fcd83" # v1.1.2

  name        = "/cms/access_key_id"
  value       = module.iam_user_cms.iam_access_key_id
  secure_type = true
}

module "secret_cms_access_key_secret" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=28784d318fcb1d5b632e38a4c1f567dd138fcd83" # v1.1.2

  name        = "/cms/access_key_secret"
  value       = module.iam_user_cms.iam_access_key_secret
  secure_type = true
}