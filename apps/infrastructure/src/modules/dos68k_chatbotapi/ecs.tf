###############################################################################
#                              CloudWatch Logs                                #
###############################################################################
module "ecs_log_group" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/log-group?ref=bf969da953bdbea229392255d2b36e7b720e917e" # v5.3.0

  name              = "/dos68k-chatbotapi/ecs"
  retention_in_days = 60
}

###############################################################################
#                               ECS Cluster                                   #
###############################################################################
module "ecs_cluster" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ecs.git//modules/cluster?ref=8b97783def49997d18a6fcb00dc21ce1edc0f538" # v5.9.0

  cluster_name = "${local.prefix}-ecs-cluster"
}

###############################################################################
#                           ECS Task Definition                               #
###############################################################################
resource "aws_ecs_task_definition" "chatbotapi" {
  family                   = "${local.prefix}-chatbotapi-task-def"
  execution_role_arn       = module.iam_role_ecs_task_execution.iam_role_arn
  task_role_arn            = module.iam_role_ecs_task.iam_role_arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.ecs_chatbotapi.cpu
  memory                   = var.ecs_chatbotapi.memory

  container_definitions = templatefile(
    "${path.module}/task-definitions/chatbotapi.json.tpl",
    {
      container_name = local.container_name
      image          = "${module.ecr.repository_url}:${var.ecs_chatbotapi.image_tag}"
      container_port = local.container_port
      aws_region     = var.aws_region
      log_group      = module.ecs_log_group.cloudwatch_log_group_name
      frontend_url   = "https://${var.dns_domain_name}"

      model_api_key_arn  = module.ssm_model_api_key.ssm_parameter_arn
      model_id_arn       = module.ssm_model_id.ssm_parameter_arn
      embed_model_id_arn = module.ssm_embed_model_id.ssm_parameter_arn
      redis_host_arn     = module.ssm_redis_host.ssm_parameter_arn
    }
  )
}

###############################################################################
#                               ECS Service                                   #
###############################################################################
module "ecs_service" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ecs.git//modules/service?ref=378d0cb7e8fde47e8ddf58461ed1974486dbbd5d" # v7.1.0

  name                           = "${local.prefix}-chatbotapi"
  cluster_arn                    = module.ecs_cluster.arn
  desired_count                  = 1
  create_task_definition         = false
  create_iam_role                = false
  create_task_exec_iam_role      = false
  create_security_group          = false
  launch_type                    = "FARGATE"
  force_new_deployment           = true
  enable_execute_command         = true
  task_definition_arn            = aws_ecs_task_definition.chatbotapi.arn
  tasks_iam_role_arn             = module.iam_role_ecs_task.iam_role_arn
  task_exec_iam_role_arn         = module.iam_role_ecs_task_execution.iam_role_arn
  ignore_task_definition_changes = false
  enable_autoscaling             = false
  autoscaling_max_capacity       = 1
  autoscaling_min_capacity       = 1

  security_group_ids = [aws_security_group.ecs_chatbotapi.id]
  subnet_ids         = var.vpc.private_subnets
  assign_public_ip   = false

  load_balancer = {
    chatbotapi-target-group = {
      target_group_arn = module.nlb.target_groups["chatbotapi-tg"].arn
      container_name   = local.container_name
      container_port   = local.container_port
    }
  }
}

###############################################################################
#                            Security Groups                                  #
###############################################################################
resource "aws_security_group" "ecs_chatbotapi" {
  name        = "${local.prefix}-chatbotapi-ecs"
  description = "dos68k Chatbot API ECS tasks"
  vpc_id      = var.vpc.id

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group_rule" "ecs_chatbotapi_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.ecs_chatbotapi.id
}

resource "aws_security_group_rule" "nlb_to_ecs_ingress" {
  type                     = "ingress"
  from_port                = local.container_port
  to_port                  = local.container_port
  protocol                 = "tcp"
  security_group_id        = aws_security_group.ecs_chatbotapi.id
  source_security_group_id = aws_security_group.nlb.id
}
