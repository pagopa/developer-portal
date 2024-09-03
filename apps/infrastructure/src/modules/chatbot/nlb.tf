module "nlb" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-alb.git?ref=3e9c6cbaf4c1d858c3bbee6f086f0c8ef17522ab" # v9.6.0

  name                  = "chatbot-load-balancer"
  vpc_id                = var.vpc.id
  subnets               = var.vpc.private_subnets
  security_groups       = [aws_security_group.nlb.id]
  internal              = true
  create_security_group = false
  load_balancer_type    = "network"

  listeners = {
    redis_port = {
      port     = 6379
      protocol = "TCP_UDP"
      forward = {
        target_group_key = "redis-tg"
      }
    }
  }

  target_groups = {
    redis-tg = {
      name              = "redis-tg"
      protocol          = "TCP_UDP"
      target_type       = "ip"
      port              = var.ecs_redis.port
      vpc_id            = var.vpc.id
      create_attachment = false
    }
  }
}


resource "aws_security_group" "nlb" {
  name        = "${local.prefix}-nlb"
  description = "Redis"
  vpc_id      = var.vpc.id

  # https://registry.terraform.io/providers/hashicorp/aws/5.35.0/docs/resources/security_group#recreating-a-security-group
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group_rule" "nlb_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.nlb.id
}

resource "aws_security_group_rule" "lambda_redis_ingress" {
  type                     = "ingress"
  from_port                = var.ecs_redis.port
  to_port                  = var.ecs_redis.port
  protocol                 = "tcp"
  security_group_id        = aws_security_group.nlb.id
  source_security_group_id = aws_security_group.lambda.id
}

resource "aws_security_group_rule" "ecs_redis_ingress" {
  type                     = "ingress"
  from_port                = var.ecs_redis.port
  to_port                  = var.ecs_redis.port
  protocol                 = "tcp"
  security_group_id        = aws_security_group.nlb.id
  source_security_group_id = var.security_groups.ecs_tasks
}
