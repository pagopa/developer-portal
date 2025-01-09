## ECS for CMS Strapi
module "cms_ecs_cluster" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ecs.git//modules/cluster?ref=8b97783def49997d18a6fcb00dc21ce1edc0f538" # v5.9.0

  cluster_name = "cms-ecs-cluster"
}

resource "aws_ecs_task_definition" "cms_task_def" {
  family                   = "cms-task-def"
  execution_role_arn       = module.iam_role_ecs_task_execution.iam_role_arn
  task_role_arn            = module.iam_role_task_role.iam_role_arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.cms_app_cpu
  memory                   = var.cms_app_memory
  container_definitions = templatefile(
    "${path.module}/task-definitions/cms_app.json.tpl",
    {
      image                      = module.ecr.repository_url
      fargate_cpu                = var.cms_app_cpu
      fargate_memory             = var.cms_app_memory
      aws_region                 = var.aws_region
      db_host                    = module.cms_rds.cluster_endpoint
      db_user                    = module.cms_rds.cluster_master_username
      db_password_arn            = module.secret_cms_database_password.ssm_parameter_arn
      bucket_name                = module.s3_bucket_cms.s3_bucket_id
      admin_jwt_secret_arn       = module.secret_cms_admin_jwt_secret.ssm_parameter_arn
      db_name                    = module.cms_rds.cluster_database_name
      db_client                  = "postgres"
      container_port             = var.cms_app_port
      app_keys                   = module.secret_cms_app_keys.ssm_parameter_arn
      api_token_salt             = module.secret_cms_api_token_salt.ssm_parameter_arn
      transfer_token_salt        = module.secret_cms_transfer_token_salt.ssm_parameter_arn
      jwt_secret                 = module.secret_cms_jwt_secret.ssm_parameter_arn
      access_key_id              = module.secret_cms_access_key_id.ssm_parameter_arn
      access_key_secret          = module.secret_cms_access_key_secret.ssm_parameter_arn
      bucket_full_url            = module.s3_bucket_cms.s3_bucket_bucket_regional_domain_name
      cdn_url                    = "https://${aws_route53_record.strapi_media_library.name}"
      aws_bucket_endpoint        = "https://s3.${var.aws_region}.amazonaws.com"
      repo_owner                 = "pagopa"
      repo_name                  = "developer-portal"
      workflow_id                = var.environment == "prod" ? "deploy_website_content.yaml" : "deploy_website.yaml"
      target_branch              = "main"
      github_pat                 = module.secret_cms_github_pat.ssm_parameter_arn
      log_group                  = module.cms_log_group.cloudwatch_log_group_name
      google_gsuite_hd           = module.secret_cms_google_gsuite_hd.ssm_parameter_arn
      google_oauth_client_id     = module.secret_cms_google_oauth_client_id.ssm_parameter_arn
      google_oauth_client_secret = module.secret_cms_google_oauth_client_secret.ssm_parameter_arn
      google_oauth_redirect_uri  = format("https://cms.%s/strapi-plugin-sso/google/callback", var.dns_domain_name)
      ac_integration_is_enabled  = var.ac_integration_is_enabled ? "True" : "False"
      ac_base_url                = var.ac_integration_is_enabled ? var.ac_base_url_param : module.secret_cms_transfer_token_salt.ssm_parameter_arn
      ac_api_key                 = var.ac_integration_is_enabled ? var.ac_api_key_param : module.secret_cms_transfer_token_salt.ssm_parameter_arn
      ac_sender_url              = "https://${var.dns_domain_name}"
  })
}

module "cms_ecs_service" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ecs.git//modules/service?ref=8b97783def49997d18a6fcb00dc21ce1edc0f538" # v5.9.0

  name                           = "cms-ecs"
  cluster_arn                    = module.cms_ecs_cluster.arn
  desired_count                  = 1
  create_task_definition         = false
  create_iam_role                = false
  create_task_exec_iam_role      = false
  create_security_group          = false
  launch_type                    = "FARGATE"
  force_new_deployment           = true
  enable_execute_command         = true
  task_definition_arn            = aws_ecs_task_definition.cms_task_def.arn
  tasks_iam_role_arn             = module.iam_role_task_role.iam_role_arn
  task_exec_iam_role_arn         = module.iam_role_ecs_task_execution.iam_role_arn
  ignore_task_definition_changes = true # CMS Deployment is managed by the "Deploy CMS" GitHub Action

  security_group_ids = [aws_security_group.ecs_tasks.id]
  subnet_ids         = module.vpc.private_subnets
  assign_public_ip   = false

  load_balancer = {
    cms-target-group = {
      target_group_arn = module.cms_load_balancer.target_groups["cms-target-group"].arn
      container_name   = "cms-docker"
      container_port   = var.cms_app_port
    }
  }
}
