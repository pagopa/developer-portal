locals {
  prefix = "${var.module}-${var.environment}"

  kv_tags = [for key, value in var.tags : { key = key, value = value }]

  redis_container_name = "redis-stack"
  lambda_timeout       = 180

  cross_account_role_arn = "arn:aws:iam::039804388894:role/chatbot-dev-cross-account-generation"
}