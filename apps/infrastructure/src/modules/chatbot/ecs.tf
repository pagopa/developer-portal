## ECS for Chatbot Redis
module "ecs_log_group" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/log-group?ref=bf969da953bdbea229392255d2b36e7b720e917e" # v5.3.0

  name              = "/chatbot/ecs"
  retention_in_days = 60
}

module "ecs_cluster" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ecs.git//modules/cluster?ref=8b97783def49997d18a6fcb00dc21ce1edc0f538" # v5.9.0

  cluster_name = "${local.prefix}-ecs-cluster"
}

resource "aws_ecs_task_definition" "ecs_redis_task_def" {
  family                   = "redis-task-def"
  execution_role_arn       = module.iam_role_ecs_task_execution.iam_role_arn
  task_role_arn            = module.ecs_redis_task_iam_role.iam_role_arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.ecs_redis.cpu
  memory                   = var.ecs_redis.memory
  container_definitions = templatefile(
    "${path.module}/task-definitions/redis.json.tpl",
    {
      container_name = local.redis_container_name
      image          = var.ecs_redis.image_uri
      fargate_cpu    = var.ecs_redis.cpu
      fargate_memory = var.ecs_redis.memory
      aws_region     = var.aws_region
      container_port = var.ecs_redis.port
      log_group      = module.ecs_log_group.cloudwatch_log_group_name
      efs_mount_points = jsonencode([{
        "containerPath" : "/data",
        "sourceVolume" : "redis-storage",
        "readOnly" : false
        }
      ])
  })

  volume {
    name = "redis-storage"
    efs_volume_configuration {
      authorization_config {
        access_point_id = aws_efs_access_point.this.id
        iam             = "DISABLED"
      }
      transit_encryption = "ENABLED"
      file_system_id     = aws_efs_file_system.this.id
    }
  }
}

module "ecs_service" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ecs.git//modules/service?ref=378d0cb7e8fde47e8ddf58461ed1974486dbbd5d" # v7.1.0

  name                           = "redis"
  cluster_arn                    = module.ecs_cluster.arn
  desired_count                  = 1
  create_task_definition         = false
  create_iam_role                = false
  create_task_exec_iam_role      = false
  create_security_group          = false
  launch_type                    = "FARGATE"
  force_new_deployment           = true
  enable_execute_command         = true
  task_definition_arn            = aws_ecs_task_definition.ecs_redis_task_def.arn
  tasks_iam_role_arn             = module.ecs_redis_task_iam_role.iam_role_arn
  task_exec_iam_role_arn         = module.iam_role_ecs_task_execution.iam_role_arn
  ignore_task_definition_changes = false
  enable_autoscaling             = false
  autoscaling_max_capacity       = 1
  autoscaling_min_capacity       = 1

  security_group_ids = [aws_security_group.redis.id]
  subnet_ids         = var.vpc.private_subnets
  assign_public_ip   = false

  load_balancer = {
    redis-target-group = {
      target_group_arn = module.nlb.target_groups["redis-tg"].arn
      container_name   = local.redis_container_name
      container_port   = var.ecs_redis.port
    }
  }
}

resource "aws_security_group" "redis" {
  name        = "${local.prefix}-redis"
  description = "Redis"
  vpc_id      = var.vpc.id

  # https://registry.terraform.io/providers/hashicorp/aws/5.35.0/docs/resources/security_group#recreating-a-security-group
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group_rule" "redis_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.redis.id
}

resource "aws_security_group_rule" "nlb_ingress" {
  type                     = "ingress"
  from_port                = var.ecs_redis.port
  to_port                  = var.ecs_redis.port
  protocol                 = "tcp"
  security_group_id        = aws_security_group.redis.id
  source_security_group_id = aws_security_group.nlb.id
}

##### Monitoring (Langfuse)
resource "aws_ecs_task_definition" "monitoring_task_def" {
  family                   = "langfuse-task-def"
  execution_role_arn       = module.iam_role_ecs_monitoring_task_execution.iam_role_arn
  task_role_arn            = module.ecs_monitoring_task_iam_role.iam_role_arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.ecs_monitoring.cpu
  memory                   = var.ecs_monitoring.memory
  container_definitions = templatefile(
    "${path.module}/task-definitions/langfuse.json.tpl",
    {
      image          = var.ecs_monitoring.image_uri
      fargate_cpu    = var.ecs_monitoring.cpu
      fargate_memory = var.ecs_monitoring.memory
      container_port = var.ecs_monitoring.port
      container_name = "langfuse"
      aws_region     = var.aws_region
      log_group      = module.ecs_log_group.cloudwatch_log_group_name

      postgres_url         = module.postgres_url.ssm_parameter_arn
      base_url             = "https://${local.monitoring_host}"
      client_id            = module.user_pool_client_id.ssm_parameter_arn
      client_secret        = module.user_pool_client_secret.ssm_parameter_arn
      issuer               = module.user_pool_issuer.ssm_parameter_arn
      master_user_email    = local.langfuse_master_email
      master_user_name     = "master"
      master_user_password = module.master_user_password.ssm_parameter_arn
      encryption_key       = module.encryption_key.ssm_parameter_arn
      salt                 = module.salt.ssm_parameter_arn
      nextauth_secret      = module.nextauth_secret.ssm_parameter_arn
      langfuse_public_key  = module.langfuse_public_key.ssm_parameter_arn
      langfuse_secret_key  = module.langfuse_secret_key.ssm_parameter_arn
  })
}

module "monitoring_ecs_service" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ecs.git//modules/service?ref=378d0cb7e8fde47e8ddf58461ed1974486dbbd5d" # v7.1.0

  name                           = "langfuse-ecs"
  cluster_arn                    = module.ecs_cluster.arn
  desired_count                  = 1
  create_task_definition         = false
  create_iam_role                = false
  create_task_exec_iam_role      = false
  create_security_group          = false
  launch_type                    = "FARGATE"
  force_new_deployment           = true
  enable_execute_command         = true
  task_definition_arn            = aws_ecs_task_definition.monitoring_task_def.arn
  tasks_iam_role_arn             = module.ecs_monitoring_task_iam_role.iam_role_arn
  task_exec_iam_role_arn         = module.iam_role_ecs_task_execution.iam_role_arn
  ignore_task_definition_changes = false
  enable_autoscaling             = false
  autoscaling_max_capacity       = 1
  autoscaling_min_capacity       = 1

  security_group_ids = [aws_security_group.monitoring_ecs.id]
  subnet_ids         = var.vpc.private_subnets
  assign_public_ip   = false

  load_balancer = {
    monitoring-target-group = {
      target_group_arn = module.monitoring_load_balancer.target_groups["monitoring-target-group"].arn
      container_name   = "langfuse"
      container_port   = var.ecs_monitoring.port
    }

    internal-monitoring-target-group = {
      target_group_arn = module.internal_monitoring_load_balancer.target_groups["internal-monitoring-target-group"].arn
      container_name   = "langfuse"
      container_port   = var.ecs_monitoring.port
    }
  }
}

resource "aws_security_group" "monitoring_ecs" {
  name        = "${local.prefix}-monitoring-ecs"
  description = "Monitoring ECS"
  vpc_id      = var.vpc.id

  # https://registry.terraform.io/providers/hashicorp/aws/5.35.0/docs/resources/security_group#recreating-a-security-group
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group_rule" "monitoring_ecs_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.monitoring_ecs.id
}

resource "aws_security_group_rule" "alb_ingress" {
  type                     = "ingress"
  from_port                = var.ecs_monitoring.port
  to_port                  = var.ecs_monitoring.port
  protocol                 = "tcp"
  security_group_id        = aws_security_group.monitoring_ecs.id
  source_security_group_id = aws_security_group.monitoring_lb.id
}

resource "aws_security_group_rule" "internal_alb_ingress" {
  type                     = "ingress"
  from_port                = var.ecs_monitoring.port
  to_port                  = var.ecs_monitoring.port
  protocol                 = "tcp"
  security_group_id        = aws_security_group.monitoring_ecs.id
  source_security_group_id = aws_security_group.internal_monitoring_lb.id
}

resource "random_password" "encryption_key" {
  length           = 64    # 32 bytes in hexadecimal = 64 characters
  special          = false # Disable special characters
  override_special = ""    # Ensure no special characters are added
}

module "encryption_key" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/chatbot/monitoring/encryption_key"
  value                = random_password.encryption_key.result
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}

resource "random_id" "salt" {
  byte_length = 32 # Generate 32 random bytes
}

module "salt" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/chatbot/monitoring/salt"
  value                = base64encode(random_id.salt.b64_std)
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}

resource "random_id" "nextauth_secret" {
  byte_length = 32 # Generate 32 random bytes
}

module "nextauth_secret" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/chatbot/monitoring/nextauth_secret"
  value                = base64encode(random_id.nextauth_secret.b64_std)
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}

resource "random_uuid" "public_key_uuid" {}
resource "random_uuid" "secret_key_uuid" {}

module "langfuse_public_key" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/chatbot/monitoring/langfuse_public_key"
  value                = "pk-lf-${random_uuid.public_key_uuid.result}"
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}

module "langfuse_secret_key" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/chatbot/monitoring/langfuse_secret_key"
  value                = "sk-lf-${random_uuid.secret_key_uuid.result}"
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}
