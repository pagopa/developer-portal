# CloudWatch Metrics and Alarms for Video Streaming Resources

data "aws_caller_identity" "current" {}

# Lambda Function Metrics and Alarms
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "${var.project_name}-ivs-video-processing-lambda-errors"
  comparison_operator = "GreaterThanUpperThreshold"
  evaluation_periods  = "5"
  threshold_metric_id = "e1"
  alarm_description   = "This metric monitors Lambda function errors using anomaly detection"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  metric_query {
    id          = "m1"
    return_data = true
    metric {
      metric_name = "Errors"
      namespace   = "AWS/Lambda"
      period      = "60"
      stat        = "Sum"
      dimensions = {
        FunctionName = aws_lambda_function.ivs_video_processing_function.function_name
      }
    }
  }

  metric_query {
    id          = "e1"
    expression  = "ANOMALY_DETECTION_BAND(m1, 2)"
    label       = "Lambda Errors (expected)"
    return_data = true
  }
}

# SNS Topic for Alarms
resource "aws_sns_topic" "alerts" {
  name = "${var.project_name}-cloudwatch-alarms"
}

resource "aws_sns_topic_subscription" "alerts" {
  protocol  = "email"
  endpoint  = format("devportal-alerts+%s@pagopa.it", var.environment)
  topic_arn = aws_sns_topic.alerts.arn
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
