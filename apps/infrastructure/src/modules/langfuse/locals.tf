locals {
  prefix                    = "${var.module}-${var.environment}"
  langfuse_domain_name      = "mon3.${var.custom_domain_name}"
  langfuse_master_email     = "devportal@pagopa.it"
  langfuse_master_user_name = "master"

  use_external_user_pool            = var.cognito_user_pool_id != null
  user_pool_client_id_param_arn     = module.user_pool_client_id.ssm_parameter_arn
  user_pool_client_secret_param_arn = module.user_pool_client_secret.ssm_parameter_arn
  user_pool_issuer_param_arn        = module.user_pool_issuer.ssm_parameter_arn
  master_user_password_param_arn    = var.master_user_password_param_arn != null ? var.master_user_password_param_arn : module.master_user_password[0].ssm_parameter_arn
}
