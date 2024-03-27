resource "aws_sns_topic" "metric_alarm" {
  name         = "cloudwatch_metric_alarms"
  display_name = "DevPortal Alarms"
}

resource "aws_sns_topic_subscription" "metric_alarm" {
  protocol  = "email"
  endpoint  = format("devportal-alerts+%s@pagopa.it", var.environment)
  topic_arn = aws_sns_topic.metric_alarm.arn
}
