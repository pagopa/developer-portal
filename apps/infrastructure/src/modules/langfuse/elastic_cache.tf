resource "aws_elasticache_subnet_group" "langfuse_cache_subnet_group" {
  name       = "${local.prefix}-cache-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name = "langfuse_cache_subnet_group"
  }
  description = "Langfuse Cache/Queue Subnet Group"
}

resource "aws_elasticache_replication_group" "langfuse_cache" {
  replication_group_id       = "${local.prefix}-cache"
  description                = "Langfuse Cache/Queue Replication Group"
  engine                     = "valkey"
  node_type                  = var.cache_node_type
  num_cache_clusters         = 1
  engine_version             = "8.2"
  subnet_group_name          = aws_elasticache_subnet_group.langfuse_cache_subnet_group.name
  security_group_ids         = [aws_security_group.langfuse_cache.id]
  apply_immediately          = true
  parameter_group_name       = "default.valkey8"
  port                       = 6379
  transit_encryption_enabled = true
  transit_encryption_mode    = "preferred"

  log_delivery_configuration {
    destination      = aws_cloudwatch_log_group.langfuse_cache_slow_log.name
    destination_type = "cloudwatch-logs"
    log_format       = "json"
    log_type         = "slow-log"
  }

  log_delivery_configuration {
    destination      = aws_cloudwatch_log_group.langfuse_cache_engine_log.name
    destination_type = "cloudwatch-logs"
    log_format       = "json"
    log_type         = "engine-log"
  }

  tags = {
    Name = "langfuse_cache"
  }
}
