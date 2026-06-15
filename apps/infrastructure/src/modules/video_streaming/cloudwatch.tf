# CloudWatch Metrics and Alarms for Video Streaming Resources

data "aws_caller_identity" "current" {}

# Lambda Function Metrics and Alarms
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "${var.project_name}-ivs-video-processing-lambda-errors"
  comparison_operator = "GreaterThanUpperThreshold"
  evaluation_periods  = "5"
  threshold_metric_id = "e1"
  alarm_description   = "This metric monitors Lambda function errors using anomaly detection"
  alarm_actions       = [var.alerting_topic_arn]

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
