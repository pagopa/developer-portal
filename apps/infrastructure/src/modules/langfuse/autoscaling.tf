locals {
  is_production = var.environment == "prod"

  ecs_services = {
    clickhouse = {
      service_name    = aws_ecs_service.clickhouse.name
      desired_count   = 1
      scale_up_minute = 0 # 09:00
    }
    worker = {
      service_name    = aws_ecs_service.langfuse_worker.name
      desired_count   = var.worker_desire_count
      scale_up_minute = 5 # 09:05
    }
    web = {
      service_name    = aws_ecs_service.langfuse_web.name
      desired_count   = var.web_desire_count
      scale_up_minute = 10 # 09:10
    }
  }
}

resource "aws_appautoscaling_target" "ecs_services" {
  for_each = local.is_production ? {} : local.ecs_services

  max_capacity       = each.value.desired_count
  min_capacity       = 0
  resource_id        = "service/${aws_ecs_cluster.langfuse.name}/${each.value.service_name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

# Scale up Mon-Fri at 09:00 CET
resource "aws_appautoscaling_scheduled_action" "scale_up" {
  for_each = local.is_production ? {} : local.ecs_services

  name               = "langfuse-${each.key}-scale-up"
  service_namespace  = aws_appautoscaling_target.ecs_services[each.key].service_namespace
  resource_id        = aws_appautoscaling_target.ecs_services[each.key].resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_services[each.key].scalable_dimension
  schedule           = "cron(${each.value.scale_up_minute} 9 ? * MON-FRI *)"
  timezone           = "Europe/Rome"

  scalable_target_action {
    min_capacity = each.value.desired_count
    max_capacity = each.value.desired_count
  }
}

# Scale down Mon-Fri at 18:00 CET
resource "aws_appautoscaling_scheduled_action" "scale_down" {
  for_each = local.is_production ? {} : local.ecs_services

  name               = "langfuse-${each.key}-scale-down"
  service_namespace  = aws_appautoscaling_target.ecs_services[each.key].service_namespace
  resource_id        = aws_appautoscaling_target.ecs_services[each.key].resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_services[each.key].scalable_dimension
  schedule           = "cron(0 18 ? * MON-FRI *)"
  timezone           = "Europe/Rome"

  scalable_target_action {
    min_capacity = 0
    max_capacity = 0
  }
}
