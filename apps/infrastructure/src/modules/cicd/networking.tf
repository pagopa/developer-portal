resource "aws_security_group" "codebuild" {
  name        = "${local.prefix}-codebuild"
  description = "Security group for Codebuild container"
  vpc_id      = var.vpc.id

  # https://registry.terraform.io/providers/hashicorp/aws/5.35.0/docs/resources/security_group#recreating-a-security-group
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group_rule" "codebuild_redis_ingress" {
  count                    = var.create_chatbot ? 1 : 0
  type                     = "ingress"
  from_port                = var.redis_port
  to_port                  = var.redis_port
  protocol                 = "tcp"
  security_group_id        = var.security_groups.redis
  source_security_group_id = aws_security_group.codebuild.id
}


resource "aws_security_group_rule" "codebuild_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.codebuild.id
}
