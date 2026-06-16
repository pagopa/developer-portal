data "aws_caller_identity" "current" {}

resource "aws_ssm_parameter" "alerting_email" {
  name  = "/alerting/email"
  type  = "String"
  value = "placeholder"

  lifecycle {
    ignore_changes = [value]
  }
}

# Single shared SNS topic for all CloudWatch alarms
resource "aws_sns_topic" "cloudwatch_alarms" {
  name         = "devportal-cloudwatch-alarms"
  display_name = "DevPortal Alarms"
}

resource "aws_sns_topic_subscription" "cloudwatch_alarms_email" {
  topic_arn = aws_sns_topic.cloudwatch_alarms.arn
  protocol  = "email"
  endpoint  = aws_ssm_parameter.alerting_email.value

  lifecycle {
    ignore_changes = [endpoint]
  }
}

resource "aws_sns_topic_policy" "cloudwatch_alarms" {
  arn = aws_sns_topic.cloudwatch_alarms.arn
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
        Resource = aws_sns_topic.cloudwatch_alarms.arn
        Condition = {
          StringEquals = {
            "aws:SourceAccount" = data.aws_caller_identity.current.account_id
          }
        }
      }
    ]
  })
}