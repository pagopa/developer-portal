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
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ecs.git//modules/service?ref=8b97783def49997d18a6fcb00dc21ce1edc0f538" # v5.9.0

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
