locals {
  clickhouse_db       = "default"
  clickhouse_user     = "clickhouse"
  clickhouse_password = random_password.clickhouse_password.result
}

resource "aws_ecs_cluster" "langfuse" {
  name = local.prefix

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  configuration {
    execute_command_configuration {
      logging = "OVERRIDE"

      log_configuration {
        cloud_watch_log_group_name = aws_cloudwatch_log_group.langfuse_worker.name
        s3_key_prefix              = "/aws/ecs/langfuse/logs"
      }
    }
  }

  service_connect_defaults {
    namespace = aws_service_discovery_private_dns_namespace.langfuse.arn
  }
  tags = {
    Name = "langfuse"
  }
}

# resource "aws_ecs_cluster_capacity_providers" "langfuse" {
#   cluster_name       = aws_ecs_cluster.langfuse.name
#   capacity_providers = [var.is_spot_instance ? "FARGATE_SPOT" : "FARGATE"]
#   default_capacity_provider_strategy {
#     capacity_provider = var.is_spot_instance ? "FARGATE_SPOT" : "FARGATE"
#   }
# }

resource "aws_ecs_task_definition" "clickhouse" {
  family                   = "${local.prefix}-clickhouse"
  cpu                      = 512
  memory                   = 4096
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]

  execution_role_arn = aws_iam_role.langfuse_ecs_task_execute_role.arn
  task_role_arn      = aws_iam_role.langfuse_task_role.arn

  volume {
    name = "${local.prefix}-clickhouse_data"

    efs_volume_configuration {
      file_system_id = aws_efs_file_system.clickhouse_data.id
      root_directory = "/"
    }
  }

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }

  container_definitions = jsonencode([
    {
      name      = "clickhouse"
      image     = "docker.io/clickhouse/clickhouse-server:25.8.8.26-alpine"
      cpu       = 512
      memory    = 4096
      essential = true

      ulimits = [
        {
          name      = "nofile"
          softLimit = 65535
          hardLimit = 65535
        }
      ]

      portMappings = [
        {
          // ClickHouse HTTP interface
          containerPort = 8123
          hostPort      = 8123
          protocol      = "tcp"
        },
        {
          // ClickHouse native interface
          containerPort = 9000
          hostPort      = 9000
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "CLICKHOUSE_DB"
          value = local.clickhouse_db
        },
        {
          name  = "CLICKHOUSE_USER"
          value = local.clickhouse_user
        },
        {
          name  = "CLICKHOUSE_PASSWORD"
          value = local.clickhouse_password
        },
        {
          name  = "AWS_REGION"
          value = var.region
        },
        # {
        #   name = "S3_BUCKET"
        #   value = aws_s3_bucket.langfuse_clickhouse.id
        # }
      ]

      healthCheck = {
        command     = ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:8123/ping || exit 1"]
        interval    = 5
        timeout     = 5
        retries     = 10
        startPeriod = 1
      }

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-stream-prefix = "${local.prefix}-clickhouse"
          awslogs-region        = var.region
          awslogs-group         = aws_cloudwatch_log_group.clickhouse.name
          mode                  = "non-blocking",
        }
      }

      mountPoints = [
        {
          sourceVolume  = "${local.prefix}-clickhouse_data"
          containerPath = "/var/lib/clickhouse"
          readOnly      = false
        },
      ]
    }
  ])
}

resource "aws_ecs_task_definition" "langfuse_worker" {
  family                   = "langfuse-worker"
  cpu                      = 2048
  memory                   = 4096
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]

  execution_role_arn = aws_iam_role.langfuse_ecs_task_execute_role.arn
  task_role_arn      = aws_iam_role.langfuse_task_role.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }

  container_definitions = jsonencode([
    {
      name      = "worker"
      image     = "docker.io/langfuse/langfuse-worker:3.115"
      cpu       = 2048
      memory    = 4096
      essential = true
      linuxParameters = {
        initProcessEnabled = true
      }
      portMappings = [{ containerPort : 3030 }]
      environment = [
        {
          name  = "SALT"
          value = var.web_salt
        },
        {
          name  = "ENCRIPTION_KEY"
          value = var.encryption_key
        },
        {
          name  = "TELEMETRY_ENABLED"
          value = "true"
        },
        {
          name  = "LANGFUSE_ENABLE_EXPERIMENTAL_FEATURES"
          value = "true"
        },
        {
          name  = "CLICKHOUSE_MIGRATION_URL"
          value = "clickhouse://${aws_service_discovery_service.clickhouse.name}.${aws_service_discovery_private_dns_namespace.langfuse.name}:9000"
        },
        {
          name  = "CLICKHOUSE_URL"
          value = "http://${aws_service_discovery_service.clickhouse.name}.${aws_service_discovery_private_dns_namespace.langfuse.name}:8123"
        },
        {
          name  = "CLICKHOUSE_USER"
          value = local.clickhouse_user
        },
        {
          name  = "CLICKHOUSE_CLUSTER_ENABLED"
          value = "false"
        },
        {
          name  = "LANGFUSE_S3_EVENT_UPLOAD_BUCKET"
          value = aws_s3_bucket.langfuse_event.id
        },
        {
          name  = "LANGFUSE_S3_EVENT_UPLOAD_REGION"
          value = var.region
        },
        {
          name  = "LANGFUSE_S3_EVENT_UPLOAD_PREFIX"
          value = "events/"
        },
        {
          name  = "LANGFUSE_S3_MEDIA_UPLOAD_BUCKET"
          value = aws_s3_bucket.langfuse_blob.id
        },
        {
          name  = "LANGFUSE_S3_MEDIA_UPLOAD_ENABLED"
          value = "true"
        },
        {
          name  = "REDIS_HOST"
          value = aws_elasticache_replication_group.langfuse_cache.primary_endpoint_address
        },
        {
          name  = "REDIS_PORT"
          value = "6379"
        },
        {
          name  = "REDIS_AUTH"
          value = aws_elasticache_replication_group.langfuse_cache.auth_token
        },
        {
          name  = "NODE_OPTIONS"
          value = "--max-old-space-size=4096"
        }
      ]
      secrets = [
        {
          name      = "DATABASE_URL"
          valueFrom = aws_secretsmanager_secret.langfuse_database_url.arn
        },
        {
          name      = "CLICKHOUSE_PASSWORD"
          valueFrom = aws_secretsmanager_secret.clickhouse_password.arn
        },
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-stream-prefix = "langfuse-worker"
          awslogs-region        = var.region
          awslogs-group         = aws_cloudwatch_log_group.langfuse_worker.name
        }
      }

    },
  ])
}

resource "aws_ecs_service" "langfuse_worker" {
  name            = "langfuse_worker"
  cluster         = aws_ecs_cluster.langfuse.arn
  task_definition = aws_ecs_task_definition.langfuse_worker.arn
  desired_count   = var.worker_desire_count
  launch_type     = "FARGATE"

  network_configuration {
    security_groups = [aws_security_group.langfuse_worker.id]
    subnets         = var.private_subnet_ids
  }
  tags = {
    Name = "langfuse_worker"
  }

  service_connect_configuration {
    enabled = true
  }
}

resource "aws_ecs_service" "clickhouse" {
  name            = "clickhouse"
  cluster         = aws_ecs_cluster.langfuse.arn
  task_definition = aws_ecs_task_definition.clickhouse.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    security_groups = [aws_security_group.clickhouse.id]
    subnets         = var.private_subnet_ids
  }

  service_registries {
    registry_arn = aws_service_discovery_service.clickhouse.arn
  }

  tags = {
    Name = "langfuse_clickhouse"
  }
}
