output "alb_dns_name" {
  description = "Public DNS name of the LiteLLM ALB."
  value       = aws_lb.this.dns_name
}

output "alb_url" {
  description = "Proxy URL. Switches scheme based on whether acm_certificate_arn is set; the underlying DNS name is the ALB. The dashboard is served at /, the API at /v1/*."
  value       = "${local.tls_enabled ? "https" : "http"}://${aws_lb.this.dns_name}"
}

output "ecs_cluster" {
  description = "ECS cluster name."
  value       = aws_ecs_cluster.this.name
}

output "vpc_id" {
  description = "VPC the stack runs in, whether module-created or passed in via `vpc_id`."
  value       = local.vpc_id
}

output "task_security_group_id" {
  description = "Security group attached to the ECS tasks. Allow inbound from this group on an existing database or Redis reached over `database_url` / `redis_url`."
  value       = aws_security_group.tasks.id
}

output "aurora_writer_endpoint" {
  description = "Aurora writer endpoint used in the password-based DATABASE_URL. Null when create_database = false."
  value       = one(aws_rds_cluster.this[*].endpoint)
}

output "aurora_reader_endpoint" {
  description = "Aurora reader endpoint. Null when create_database = false."
  value       = one(aws_rds_cluster.this[*].reader_endpoint)
}

output "redis_endpoint" {
  description = "ElastiCache Redis primary endpoint (TLS, transit_encryption_enabled = true). Null when `create_redis = false`."
  value       = one([for r in aws_elasticache_replication_group.this : "${r.primary_endpoint_address}:${r.port}"])
}

output "s3_bucket" {
  description = "S3 bucket name exposed to LiteLLM as S3_BUCKET_NAME / S3_REGION_NAME."
  value       = aws_s3_bucket.this.bucket
}

output "master_key_secret_arn" {
  description = "Secrets Manager ARN holding LITELLM_MASTER_KEY. Fetch with `aws secretsmanager get-secret-value --secret-id <arn>`."
  value       = aws_secretsmanager_secret.master_key.arn
}

output "db_master_password_secret_arn" {
  description = "Secrets Manager ARN holding the managed Aurora credentials as JSON. Null when create_database = false."
  value       = one(aws_secretsmanager_secret.db_master_password[*].arn)
}

output "database_url_secret_arn" {
  description = "Secrets Manager reference injected as DATABASE_URL, or null when running without a database."
  value       = local.database_url_secret_arn
}
