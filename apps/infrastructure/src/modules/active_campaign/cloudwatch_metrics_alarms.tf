# CloudWatch Metrics and Alarms for Active Campaign Sync Resources

resource "aws_cloudwatch_metric_alarm" "pipe_failed" {
  alarm_name                = "${local.prefix}-webinar-subs-pipe-errors"
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  evaluation_periods        = 1
  period                    = 60
  statistic                 = "Sum"
  threshold                 = 0
  metric_name               = "ExecutionFailed"
  namespace                 = "AWS/EventBridge/Pipes"
  dimensions = {
    PipeName = aws_pipes_pipe.dynamodb_to_sqs.name
  }
  alarm_description         = "This metric monitors the webinar subscriptions eventbridge pipe failures"
  insufficient_data_actions = []
  alarm_actions       = [aws_sns_topic.alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "dlq" {
  alarm_name                = "${local.prefix}-sqs-messages-in-dlq"
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  evaluation_periods        = 1
  period                    = 60
  statistic                 = "Sum"
  threshold                 = 0
  metric_name               = "ApproximateNumberOfMessagesVisible"
  namespace                 = "AWS/SQS"
  dimensions = {
    QueueName = aws_sqs_queue.fifo_dlq_queue.name
  }
  alarm_description         = "This metric monitors messages put in the dead letter queue"
  insufficient_data_actions = []
  alarm_actions       = [aws_sns_topic.alerts.arn]
}

# SNS Topic for Alarms
resource "aws_sns_topic" "alerts" {
  name = "${local.prefix}-cloudwatch-alarms"
}

resource "aws_sns_topic_policy" "alerts" {
  arn = aws_sns_topic.alerts.arn
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudWatchAlarms"
        Effect = "Allow"
        Principal = {
          Service = "cloudwatch.amazonaws.com"
        }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.alerts.arn
        Condition = {
          ArnLike = {
            "aws:SourceArn" = "arn:aws:cloudwatch:${var.aws_region}:${data.aws_caller_identity.current.account_id}:alarm:*"
          }
          StringEquals = {
            "aws:SourceAccount" = data.aws_caller_identity.current.account_id
          }
        }
      }
    ]
  })
}