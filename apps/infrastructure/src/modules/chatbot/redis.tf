# ################################################################################
# # ElastiCache - Redis
# ################################################################################
module "redis" {
  source = "git::https://github.com/cloudposse/terraform-aws-elasticache-redis.git?ref=4b296b84f68228e6db25ba1c0a8cb5f7f2ba9780" # v1.4.1
  providers = {
    aws = aws.eu-south-1
  }

  name                             = "${local.prefix}-redis"
  availability_zones               = slice(data.aws_availability_zones.available.names, 0, 3)
  vpc_id                           = var.vpc.id
  subnets                          = var.vpc.elasticache_subnets
  cluster_size                     = var.chatbot_redis.cluster_size
  instance_type                    = var.chatbot_redis.instance_type
  engine_version                   = var.chatbot_redis.engine_version
  family                           = var.chatbot_redis.family
  at_rest_encryption_enabled       = var.chatbot_redis.at_rest_encryption_enabled
  transit_encryption_enabled       = var.chatbot_redis.transit_encryption_enabled
  create_security_group            = false
  associated_security_group_ids    = [aws_security_group.redis.id]
  automatic_failover_enabled       = var.chatbot_redis.automatic_failover
  multi_az_enabled                 = var.chatbot_redis.multi_az
  snapshot_retention_limit         = var.chatbot_redis.snapshot_retention_limit
  snapshot_window                  = var.chatbot_redis.snapshot_windows
  apply_immediately                = true
  cloudwatch_metric_alarms_enabled = var.chatbot_redis.cloudwatch_metric_alarms_enabled
  auto_minor_version_upgrade       = var.chatbot_redis.auto_minor_version_upgrade
}

resource "aws_security_group" "redis" {
  provider    = aws.eu-south-1
  name        = "${local.prefix}-redis"
  description = "Redis"
  vpc_id      = var.vpc.id

  # https://registry.terraform.io/providers/hashicorp/aws/5.35.0/docs/resources/security_group#recreating-a-security-group
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group_rule" "redis_egress" {
  provider = aws.eu-south-1
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.redis.id
}

resource "aws_security_group_rule" "lambda_redis_ingress" {
  provider = aws.eu-south-1
  type                     = "ingress"
  from_port                = 6379
  to_port                  = 6379
  protocol                 = "tcp"
  security_group_id        = aws_security_group.redis.id
  source_security_group_id = aws_security_group.lambda.id
}