locals {
  prefix = "${var.module}-${var.environment}"
  # awscc provider sorts tags by key, to avoid unexpected drifts
  # we sort the keys of the tags map before passing it to the resources
  kv_tags_keys = sort(keys(var.tags))
  kv_tags      = [for key in local.kv_tags_keys : { key = key, value = var.tags[key] }]

  redis_container_name = "redis-stack"
  lambda_timeout       = 180

  monitoring_host          = aws_route53_record.monitoring.fqdn
  priv_monitoring_host     = aws_route53_record.internal_monitoring.fqdn
  monitoring_database_name = "monitoring"
  langfuse_master_email    = "devportal@pagopa.it"
}