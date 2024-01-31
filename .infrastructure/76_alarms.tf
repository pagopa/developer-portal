# SES

## Bounce rate alarm
module "ses_bounce_rate_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | SES | Bounce Rate"
  actions_enabled   = true
  alarm_description = "Alarm to monitor the bounce rate"
  metric_name       = "Bounce"
  namespace         = "AWS/SES"

  comparison_operator = "GreaterThanOrEqualToThreshold"
  threshold           = "0.05" # 5%
  statistic           = "Average"
  unit                = "Count"
  period              = 300 # 5 minutes
  evaluation_periods  = 1
}
