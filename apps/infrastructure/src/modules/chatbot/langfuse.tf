module "langfuse" {
  source = "../langfuse"

  count = var.environment == "dev" ? 1 : 0

  environment        = var.environment
  region             = var.aws_region
  vpc_id             = var.vpc.id
  private_subnet_ids = var.vpc.private_subnets
  public_subnet_ids  = var.vpc.public_subnets
  custom_domain_id   = var.hosted_zone_id
  custom_domain_name = var.dns_domain_name

  cognito_user_pool_id           = aws_cognito_user_pool.monitoring.id
  cognito_user_pool_endpoint     = aws_cognito_user_pool.monitoring.endpoint
  master_user_password_param_arn = module.master_user_password.ssm_parameter_arn

  lambda_security_group_id = aws_security_group.lambda_monitor.id
}
