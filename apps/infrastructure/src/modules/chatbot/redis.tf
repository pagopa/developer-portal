# ################################################################################
# # ElastiCache - Redis
# ################################################################################
# module "redis" {
#   source  = "git::https://github.com/cloudposse/terraform-aws-elasticache-redis.git?ref=4b296b84f68228e6db25ba1c0a8cb5f7f2ba9780" # v1.4.1

#   name                             = "${local.prefix}-redis"
#   availability_zones               = slice(data.aws_availability_zones.current.names, 0, 3)
#   vpc_id                           = data.tfe_outputs.network.values.vpc_id
#   subnets                          = data.tfe_outputs.network.values.elasticache_subnets
#   cluster_size                     = var.redis_cluster_size
#   instance_type                    = var.redis_instance_type
#   engine_version                   = var.redis_engine_version
#   family                           = var.redis_family
#   at_rest_encryption_enabled       = var.redis_at_rest_encryption_enabled
#   transit_encryption_enabled       = var.redis_transit_encryption_enabled
#   create_security_group            = false
#   associated_security_group_ids    = [data.tfe_outputs.network.values.elasticache_redis_sg_id]
#   automatic_failover_enabled       = var.redis_automatic_failover
#   multi_az_enabled                 = var.redis_multi_az
#   snapshot_retention_limit         = var.redis_snapshot_retention_limit
#   snapshot_window                  = var.redis_snapshot_windows
#   apply_immediately                = true
#   cloudwatch_metric_alarms_enabled = var.redis_cloudwatch_metric_alarms_enabled
#   auto_minor_version_upgrade       = var.redis_auto_minor_version_upgrade
# }