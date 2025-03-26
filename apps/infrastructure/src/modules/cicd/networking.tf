resource "aws_security_group_rule" "codebuild_redis_ingress" {
  count                    = var.create_chatbot ? 1 : 0
  type                     = "ingress"
  from_port                = var.redis_port
  to_port                  = var.redis_port
  protocol                 = "tcp"
  security_group_id        = var.security_groups.redis
  source_security_group_id = module.codebuild.security_group.id
}
