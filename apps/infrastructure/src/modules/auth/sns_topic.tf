resource "aws_sns_topic" "cognito_alarms" {
  name         = "cognito_cloudwatch_metric_alarms"
  display_name = "DevPortal Cognito Alarms"
}

resource "aws_sns_topic_subscription" "cognito_alarms" {
  protocol  = "email"
  endpoint  = format("devportal-alerts+%s@pagopa.it", var.environment)
  topic_arn = aws_sns_topic.cognito_alarms.arn
}
