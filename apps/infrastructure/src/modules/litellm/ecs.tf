resource "aws_ecs_cluster" "this" {
  name = local.name

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = local.tags
}

resource "aws_cloudwatch_log_group" "gateway" {
  name              = "/ecs/${local.name}/gateway"
  retention_in_days = var.log_retention_days
  tags              = local.tags
}

locals {
  otel_enabled          = var.otel_endpoint != ""
  otel_environment_name = var.otel_environment_name != "" ? var.otel_environment_name : var.env
  otel_env = local.otel_enabled ? {
    LITELLM_OTEL_V2                                    = "true"
    OTEL_EXPORTER                                      = var.otel_exporter
    OTEL_ENDPOINT                                      = var.otel_endpoint
    OTEL_ENVIRONMENT_NAME                              = local.otel_environment_name
    OTEL_SERVICE_NAME                                  = local.name
    OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT = var.otel_capture_message_content
  } : {}
  otel_secrets = local.otel_enabled && var.otel_headers_secret_arn != "" ? {
    OTEL_HEADERS = var.otel_headers_secret_arn
  } : {}

  billing_metrics_enabled             = var.billing_metrics_endpoint != ""
  billing_metrics_client_cert_enabled = local.billing_metrics_enabled && nonsensitive(var.billing_metrics_client_cert_pem != "")
  billing_metrics_client_key_enabled  = local.billing_metrics_enabled && nonsensitive(var.billing_metrics_client_key_pem != "")
  billing_metrics_ca_cert_enabled     = local.billing_metrics_enabled && nonsensitive(var.billing_metrics_ca_cert_pem != "")

  billing_metrics_env = local.billing_metrics_enabled ? {
    LITELLM_BILLING_METRICS_ENDPOINT = var.billing_metrics_endpoint
  } : {}
  billing_metrics_secrets = merge(
    local.billing_metrics_client_cert_enabled ? {
      LITELLM_BILLING_METRICS_CLIENT_CERT = aws_secretsmanager_secret.billing_metrics_client_cert[0].arn
    } : {},
    local.billing_metrics_client_key_enabled ? {
      LITELLM_BILLING_METRICS_CLIENT_KEY = aws_secretsmanager_secret.billing_metrics_client_key[0].arn
    } : {},
    local.billing_metrics_ca_cert_enabled ? {
      LITELLM_BILLING_METRICS_CA_CERT = aws_secretsmanager_secret.billing_metrics_ca_cert[0].arn
    } : {},
  )

  managed_redis_env = var.create_redis ? {
    REDIS_HOST = aws_elasticache_replication_group.this[0].primary_endpoint_address
    REDIS_PORT = "6379"
    REDIS_SSL  = "true"
  } : {}

  proxy_config_enabled = length(keys(var.proxy_config)) > 0
  proxy_config_path    = "/tmp/litellm-config.yaml"
  proxy_config_env = local.proxy_config_enabled ? {
    CONFIG_FILE_PATH               = local.proxy_config_path
    LITELLM_PROXY_CONFIG_S3_BUCKET = aws_s3_bucket.this.bucket
    LITELLM_PROXY_CONFIG_S3_KEY    = aws_s3_object.proxy_config[0].key
    LITELLM_PROXY_CONFIG_S3_ETAG   = aws_s3_object.proxy_config[0].etag
  } : {}
  proxy_config_fetch_cmd = "python -c \"import os, boto3; boto3.client('s3', region_name=os.environ['AWS_REGION']).download_file(os.environ['LITELLM_PROXY_CONFIG_S3_BUCKET'], os.environ['LITELLM_PROXY_CONFIG_S3_KEY'], os.environ['CONFIG_FILE_PATH'])\""
  proxy_args             = ["--host", "0.0.0.0", "--port", "4000", "--num_workers", tostring(var.gateway_num_workers)]

  # Keep both existing extra-input maps; gateway values win on a name collision.
  extra_env     = merge(var.backend_extra_env, var.gateway_extra_env)
  extra_secrets = merge(var.backend_extra_secrets, var.gateway_extra_secrets)
  environment = merge(
    {
      AWS_REGION        = var.region
      AWS_REGION_NAME   = var.region
      S3_BUCKET_NAME    = aws_s3_bucket.this.bucket
      S3_REGION_NAME    = var.region
      STORE_MODEL_IN_DB = tostring(local.database_enabled)
    },
    local.managed_redis_env,
    local.otel_env,
    local.billing_metrics_env,
    local.proxy_config_env,
    local.extra_env,
  )
  container_secrets = merge(
    { LITELLM_MASTER_KEY = aws_secretsmanager_secret.master_key.arn },
    nonsensitive(var.litellm_license != "") ? { LITELLM_LICENSE = aws_secretsmanager_secret.license[0].arn } : {},
    nonsensitive(var.ui_password != "") ? { UI_PASSWORD = aws_secretsmanager_secret.ui_password[0].arn } : {},
    local.database_enabled ? { DATABASE_URL = local.database_url_secret_arn } : {},
    local.byo_redis ? { REDIS_URL = aws_secretsmanager_secret.redis_url[0].arn } : {},
    local.otel_secrets,
    local.billing_metrics_secrets,
    local.extra_secrets,
  )
  container = merge(
    {
      name         = "gateway"
      image        = var.gateway_image
      essential    = true
      portMappings = [{ containerPort = 4000, protocol = "tcp" }]
      environment  = [for name, value in local.environment : { name = name, value = value } if !contains(keys(local.container_secrets), name)]
      secrets      = [for name, arn in local.container_secrets : { name = name, valueFrom = arn }]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.gateway.name
          awslogs-region        = var.region
          awslogs-stream-prefix = "litellm"
        }
      }
    },
    local.proxy_config_enabled ? {
      entryPoint = ["sh", "-c"]
      command    = ["${local.proxy_config_fetch_cmd} && exec /app/docker/prod_entrypoint.sh ${join(" ", local.proxy_args)} --config \"$CONFIG_FILE_PATH\""]
      } : {
      command = local.proxy_args
    },
  )
}

# Retain the gateway resource addresses to update the existing service in place.
resource "aws_ecs_task_definition" "gateway" {
  family                   = "${local.name}-gateway"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.gateway_cpu
  memory                   = var.gateway_memory
  execution_role_arn       = aws_iam_role.task_execution.arn
  task_role_arn            = aws_iam_role.task.arn
  container_definitions    = jsonencode([local.container])

  lifecycle {
    precondition {
      condition     = !var.create_database || (var.database_url_secret_arn == "" && nonsensitive(var.database_url == ""))
      error_message = "Set create_database = false when supplying database_url or database_url_secret_arn."
    }

    precondition {
      condition     = var.database_url_secret_arn == "" || nonsensitive(var.database_url == "")
      error_message = "Supply either database_url or database_url_secret_arn, not both."
    }

    precondition {
      condition = var.billing_metrics_endpoint == "" || (
        var.billing_metrics_client_cert_pem != "" && var.billing_metrics_client_key_pem != ""
      )
      error_message = "billing_metrics_client_cert_pem and billing_metrics_client_key_pem are both required when billing_metrics_endpoint is set."
    }
  }

  tags = local.tags
}

resource "aws_ecs_service" "gateway" {
  name                              = "${local.name}-gateway"
  cluster                           = aws_ecs_cluster.this.id
  task_definition                   = aws_ecs_task_definition.gateway.arn
  desired_count                     = var.gateway_desired_count
  launch_type                       = "FARGATE"
  platform_version                  = "LATEST"
  health_check_grace_period_seconds = 300

  network_configuration {
    subnets          = local.private_subnet_ids
    security_groups  = local.task_security_group_ids
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.gateway.arn
    container_name   = "gateway"
    container_port   = 4000
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200

  lifecycle {
    ignore_changes = [desired_count]
  }

  depends_on = [
    aws_lb_listener.http,
    aws_lb_listener.https,
    aws_rds_cluster_instance.writer,
    aws_elasticache_replication_group.this,
    aws_iam_role_policy_attachment.task_execution,
    aws_iam_role_policy_attachment.task_execution_secrets,
    aws_iam_role_policy_attachment.task_s3_access,
    aws_route_table_association.private,
    aws_secretsmanager_secret_version.master_key,
    aws_secretsmanager_secret_version.license,
    aws_secretsmanager_secret_version.ui_password,
    aws_secretsmanager_secret_version.database_url,
    aws_secretsmanager_secret_version.redis_url,
    aws_secretsmanager_secret_version.billing_metrics_client_cert,
    aws_secretsmanager_secret_version.billing_metrics_client_key,
    aws_secretsmanager_secret_version.billing_metrics_ca_cert,
  ]

  tags = local.tags
}
