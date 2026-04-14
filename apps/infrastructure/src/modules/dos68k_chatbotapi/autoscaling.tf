###############################################################################
#     Scheduled Autoscaling – scale to 0 outside working hours               #
#     Working hours: Mon-Fri 09:00–19:00 CET (Europe/Rome)                   #
###############################################################################

resource "aws_appautoscaling_target" "ecs" {
  count = var.enable_scheduled_scaling ? 1 : 0

  max_capacity       = 1
  min_capacity       = 0
  resource_id        = "service/${module.ecs_cluster.name}/${module.ecs_service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

# Scale up to 1 task at 09:00 CET, Monday through Friday
resource "aws_appautoscaling_scheduled_action" "scale_up" {
  count = var.enable_scheduled_scaling ? 1 : 0

  name               = "${local.prefix}-chatbotapi-scale-up"
  service_namespace  = aws_appautoscaling_target.ecs[0].service_namespace
  resource_id        = aws_appautoscaling_target.ecs[0].resource_id
  scalable_dimension = aws_appautoscaling_target.ecs[0].scalable_dimension
  schedule           = "cron(0 8 ? * MON-FRI *)"
  timezone           = "Europe/Rome"

  scalable_target_action {
    min_capacity = 1
    max_capacity = 1
  }
}

# Scale down to 0 tasks at 19:00 CET, Monday through Friday
resource "aws_appautoscaling_scheduled_action" "scale_down" {
  count = var.enable_scheduled_scaling ? 1 : 0

  name               = "${local.prefix}-chatbotapi-scale-down"
  service_namespace  = aws_appautoscaling_target.ecs[0].service_namespace
  resource_id        = aws_appautoscaling_target.ecs[0].resource_id
  scalable_dimension = aws_appautoscaling_target.ecs[0].scalable_dimension
  schedule           = "cron(0 18 ? * MON-FRI *)"
  timezone           = "Europe/Rome"

  scalable_target_action {
    min_capacity = 0
    max_capacity = 0
  }
}

# Scale down to 0 tasks for the entire weekend (Friday 19:00 already covered above)
resource "aws_appautoscaling_scheduled_action" "scale_down_weekend" {
  count = var.enable_scheduled_scaling ? 1 : 0

  name               = "${local.prefix}-chatbotapi-scale-down-weekend"
  service_namespace  = aws_appautoscaling_target.ecs[0].service_namespace
  resource_id        = aws_appautoscaling_target.ecs[0].resource_id
  scalable_dimension = aws_appautoscaling_target.ecs[0].scalable_dimension
  schedule           = "cron(0 0 ? * SAT-SUN *)"
  timezone           = "Europe/Rome"

  scalable_target_action {
    min_capacity = 0
    max_capacity = 0
  }
}
