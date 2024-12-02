locals {
  prefix = "${var.module}-${var.environment}"

  kv_tags = [for key, value in var.tags : { key = key, value = value }]

  redis_container_name = "redis-stack"
  lambda_timeout       = 180

  monitoring_host          = aws_route53_record.monitoring.fqdn
  priv_monitoring_host     = aws_route53_record.internal_monitoring.fqdn
  monitoring_database_name = "monitoring"
  langfuse_master_email    = "devportal@pagopa.it"
}