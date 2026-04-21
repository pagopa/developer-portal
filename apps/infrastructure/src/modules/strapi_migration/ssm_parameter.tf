## Secrets SSM Parameter Store for CMS Strapi
resource "random_password" "cms_database_password" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

module "secret_cms_database_password" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=28784d318fcb1d5b632e38a4c1f567dd138fcd83" # v1.1.2

  name        = "/cmsv5/database/password"
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

  name        = "/cmsv5/admin_jwt_secret"
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

  name        = "/cmsv5/jwt_secret"
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

  name        = "/cmsv5/app_keys"
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

  name        = "/cmsv5/api_token_salt"
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

  name        = "/cmsv5/transfer_token_salt"
  value       = random_password.cms_transfer_token_salt.result
  secure_type = true
}

data "aws_ssm_parameter" "secret_cms_github_pat" {
  name = "/cms/github_pat"
}

data "aws_ssm_parameter" "secret_cms_google_oauth_client_id" {
  name = "/cms/google_oauth_client_id"
}

data "aws_ssm_parameter" "secret_cms_google_oauth_client_secret" {
  name = "/cms/google_oauth_client_secret"
}

data "aws_ssm_parameter" "secret_cms_google_gsuite_hd" {
  name = "/cms/google_gsuite_hd"
}

data "aws_ssm_parameter" "secret_cms_access_key_id" {
  name = "/cms/access_key_id"
}

data "aws_ssm_parameter" "secret_cms_access_key_secret" {
  name = "/cms/access_key_secret"
}