output "alb_dns_name" {
  description = "Public DNS name of the LiteLLM ALB."
  value       = module.litellm.alb_dns_name
}

output "alb_url" {
  description = "Proxy URL. Dashboard at /, API at /v1/*."
  value       = module.litellm.alb_url
}

output "ecs_cluster" {
  description = "ECS cluster name."
  value       = module.litellm.ecs_cluster
}

output "vpc_id" {
  description = "VPC the stack runs in, whether module-created or supplied."
  value       = module.litellm.vpc_id
}

output "task_security_group_id" {
  description = "Tasks security group. Allow this inbound on an existing database or Redis."
  value       = module.litellm.task_security_group_id
}

output "aurora_writer_endpoint" {
  description = "Aurora writer endpoint."
  value       = module.litellm.aurora_writer_endpoint
}

output "aurora_reader_endpoint" {
  description = "Aurora reader endpoint."
  value       = module.litellm.aurora_reader_endpoint
}

output "redis_endpoint" {
  description = "ElastiCache Redis primary endpoint (TLS)."
  value       = module.litellm.redis_endpoint
}

output "s3_bucket" {
  description = "S3 bucket name."
  value       = module.litellm.s3_bucket
}

output "master_key_secret_arn" {
  description = "Secrets Manager ARN holding LITELLM_MASTER_KEY."
  value       = module.litellm.master_key_secret_arn
}

output "db_master_password_secret_arn" {
  description = "Secrets Manager ARN holding the Aurora credentials as JSON."
  value       = module.litellm.db_master_password_secret_arn
}

output "database_url_secret_arn" {
  description = "Secrets Manager reference injected into LiteLLM as DATABASE_URL."
  value       = module.litellm.database_url_secret_arn
}
output "acm_certificate_arn" {
  description = "Validated ACM certificate ARN used by the ALB, or empty in HTTP-only mode."
  value       = local.create_certificate ? aws_acm_certificate_validation.litellm[0].certificate_arn : var.acm_certificate_arn
}

output "litellm_url" {
  description = "HTTPS URL for the managed LiteLLM domain, or null when using an existing certificate or HTTP-only mode."
  value       = local.create_certificate ? "https://${aws_route53_record.litellm[0].name}" : null
}
