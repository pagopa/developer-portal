# Deploy the all-in-one LiteLLM image with ACM and Route53 TLS setup.
module "litellm" {
  source = "../../"

  region = var.region
  env    = var.env
  azs    = var.azs
  tenant = var.tenant

  vpc_id                             = var.vpc_id
  public_subnet_ids                  = var.public_subnet_ids
  private_subnet_ids                 = var.private_subnet_ids
  additional_task_security_group_ids = var.additional_task_security_group_ids

  create_database         = var.create_database
  database_url            = var.database_url
  database_url_secret_arn = var.database_url_secret_arn
  create_redis            = var.create_redis
  redis_url               = var.redis_url
  gateway_image           = var.gateway_image

  litellm_master_key = var.litellm_master_key
  litellm_license    = var.litellm_license
  ui_password        = var.ui_password

  acm_certificate_arn = local.create_certificate ? aws_acm_certificate_validation.litellm[0].certificate_arn : var.acm_certificate_arn
  enable_https        = local.create_certificate || var.acm_certificate_arn != ""
  allow_plaintext_alb = var.allow_plaintext_alb
  s3_force_destroy    = var.s3_force_destroy
  skip_final_snapshot = var.skip_final_snapshot

  proxy_config          = var.proxy_config
  gateway_extra_env     = var.gateway_extra_env
  backend_extra_env     = var.backend_extra_env
  gateway_extra_secrets = var.gateway_extra_secrets
  backend_extra_secrets = var.backend_extra_secrets
}
