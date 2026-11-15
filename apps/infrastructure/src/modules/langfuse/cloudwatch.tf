resource "aws_cloudwatch_log_group" "langfuse_web" {
  name              = "/aws/ecs/langfuse_web_log"
  retention_in_days = 14
  tags = {
    Name = "langfuse_web"
  }
}

resource "aws_cloudwatch_log_group" "langfuse_worker" {
  name              = "/aws/ecs/langfuse_worker_log"
  retention_in_days = 14
  tags = {
    Name = "langfuse_worker"
  }
}

resource "aws_cloudwatch_log_group" "clickhouse" {
  name              = "/aws/ecs/langfuse_clickhouse_log"
  retention_in_days = 14
  tags = {
    Name = "langfuse_clickhouse"
  }
}

resource "aws_cloudwatch_log_group" "langfuse_cache_slow_log" {
  name              = "/aws/redis/langfuse_cache_slow_log"
  retention_in_days = 14
  tags = {
    Name = "langfuse_cache_slow_log"
  }
}

resource "aws_cloudwatch_log_group" "langfuse_cache_engine_log" {
  name              = "/aws/ecs/langfuse_cache_engine_log"
  retention_in_days = 14
  tags = {
    Name = "langfuse_cache_engine_log"
  }
}

resource "aws_cloudwatch_metric_alarm" "clickhouse_running_tasks_low" {
  count = local.is_production ? 1 : 0

  alarm_name          = "${local.prefix}-clickhouse-running-tasks-low"
  alarm_description   = "ClickHouse has no running tasks or task count metrics are missing"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 2
  datapoints_to_alarm = 1
  threshold           = 1
  treat_missing_data  = "breaching"
  alarm_actions       = [var.alerting_topic_arn]

  namespace   = "ECS/ContainerInsights"
  metric_name = "RunningTaskCount"
  period      = 60
  statistic   = "Minimum"
  dimensions = {
    ClusterName = aws_ecs_cluster.langfuse.name
    ServiceName = aws_ecs_service.clickhouse.name
  }
}

resource "aws_cloudwatch_metric_alarm" "clickhouse_running_tasks_high" {
  alarm_name          = "${local.prefix}-clickhouse-running-tasks-high"
  alarm_description   = "ClickHouse has more than one running task"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  datapoints_to_alarm = 1
  threshold           = 1
  treat_missing_data  = "notBreaching"
  alarm_actions       = [var.alerting_topic_arn]

  namespace   = "ECS/ContainerInsights"
  metric_name = "RunningTaskCount"
  period      = 60
  statistic   = "Maximum"
  dimensions = {
    ClusterName = aws_ecs_cluster.langfuse.name
    ServiceName = aws_ecs_service.clickhouse.name
  }
}
