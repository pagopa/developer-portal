###############################################################################
#                        Internal Network Load Balancer                       #
###############################################################################
module "nlb" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-alb.git?ref=3e9c6cbaf4c1d858c3bbee6f086f0c8ef17522ab" # v9.6.0

  name                  = "${local.prefix}-chatbotapi-nlb"
  vpc_id                = var.vpc.id
  subnets               = var.vpc.private_subnets
  security_groups       = [aws_security_group.nlb.id]
  internal              = true
  create_security_group = false
  load_balancer_type    = "network"

  listeners = {
    chatbotapi = {
      port     = local.container_port
      protocol = "TCP"
      forward = {
        target_group_key = "chatbotapi-tg"
      }
    }
  }

  target_groups = {
    chatbotapi-tg = {
      name              = "${local.prefix}-chatbotapi-tg"
      protocol          = "TCP"
      target_type       = "ip"
      port              = local.container_port
      vpc_id            = var.vpc.id
      create_attachment = false

      health_check = {
        enabled             = true
        path                = "/health"
        port                = "traffic-port"
        protocol            = "HTTP"
        healthy_threshold   = 3
        unhealthy_threshold = 3
        interval            = 30
      }
    }
  }
}

###############################################################################
#                        NLB Security Group                                   #
###############################################################################
data "aws_vpc" "selected" {
  id = var.vpc.id
}

resource "aws_security_group" "nlb" {
  name        = "${local.prefix}-chatbotapi-nlb"
  description = "dos68k Chatbot API NLB"
  vpc_id      = var.vpc.id

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

resource "aws_security_group_rule" "nlb_ingress" {
  type              = "ingress"
  from_port         = local.container_port
  to_port           = local.container_port
  protocol          = "tcp"
  cidr_blocks       = [data.aws_vpc.selected.cidr_block]
  security_group_id = aws_security_group.nlb.id
  description       = "Allow API Gateway VPC Link traffic"
}
