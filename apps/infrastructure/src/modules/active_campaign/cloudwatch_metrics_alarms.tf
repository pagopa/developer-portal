# CloudWatch Metrics and Alarms for Active Campaign Sync Resources

resource "aws_cloudwatch_metric_alarm" "pipe_failed" {
  alarm_name          = "${local.prefix}-webinar-subs-pipe-errors"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  period              = 60
  statistic           = "Sum"
  threshold           = 1
  metric_name         = "ExecutionFailed"
  namespace           = "AWS/EventBridge/Pipes"
  dimensions = {
    PipeName = aws_pipes_pipe.dynamodb_to_sqs.name
  }
  alarm_description         = "This metric monitors the webinar subscriptions eventbridge pipe failures"
  insufficient_data_actions = []
  alarm_actions             = [var.alerting_topic_arn]
}

resource "aws_cloudwatch_metric_alarm" "resync_dlq" {
  alarm_name          = "${local.prefix}-sqs-messages-in-resync-dlq"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  period              = 60
  statistic           = "Sum"
  threshold           = 1
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  dimensions = {
    QueueName = aws_sqs_queue.fifo_resync_dlq_queue.name
  }
  alarm_description         = "This metric monitors messages put in the dead letter queue"
  insufficient_data_actions = []
  alarm_actions             = [var.alerting_topic_arn]
}
