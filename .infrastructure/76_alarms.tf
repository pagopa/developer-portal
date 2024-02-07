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
  treat_missing_data  = "notBreaching" # No data in the period is considered as good.
}

## Reputation complaint rate alarm
module "ses_reputation_complaint_rate_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | SES | Complaint Rate"
  actions_enabled   = true
  alarm_description = "Alarm to monitor the reputation complaint rate"
  metric_name       = "Complaint"
  namespace         = "AWS/SES"

  comparison_operator = "GreaterThanOrEqualToThreshold"
  threshold           = "0.001" # 0.1%
  statistic           = "Average"
  unit                = "Count"
  period              = 300 # 5 minutes
  evaluation_periods  = 1
  treat_missing_data  = "notBreaching" # No data in the period is considered as good.
}

## Daily sending quota alarm
module "ses_daily_sending_quota_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | SES | Send Daily Quota"
  actions_enabled   = true
  alarm_description = "Alarm to monitor the daily sending quota limit"
  metric_name       = "Send"
  namespace         = "AWS/SES"

  comparison_operator = "GreaterThanOrEqualToThreshold"
  threshold           = "40000"
  statistic           = "Sum"
  unit                = "Count"
  period              = 3600 # 1 hour
  evaluation_periods  = 1
}

## Send rate limit alarm
module "ses_sending_rate_limit_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | SES | Send Rate"
  actions_enabled   = true
  alarm_description = "Alarm to monitor the rate limit per second"
  metric_name       = "Send"
  namespace         = "AWS/SES"

  comparison_operator = "GreaterThanOrEqualToThreshold"
  threshold           = "140" # At the moment we can send 14 emails/second, so 140 in 10 seconds
  statistic           = "Sum"
  unit                = "Count"
  period              = 10 # 10 seconds
  evaluation_periods  = 1
  treat_missing_data  = "notBreaching" # No data in the period is considered as good.
}

# Cognito

## Cognito User Pool Sign Up Throttles
module "cognito_user_pool_sign_up_throttles" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | SignUp Throttles"
  actions_enabled   = true
  alarm_description = "This alarm helps to monitor the occurrence of throttled sign-up requests"
  metric_name       = "SignUpThrottles"
  namespace         = "AWS/Cognito"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 0
  statistic           = "Sum"
  unit                = "Count"
  period              = 60
  evaluation_periods  = 5
  datapoints_to_alarm = 5
  treat_missing_data  = "notBreaching" # No data in the period is considered as good.

  dimensions = {
    UserPool       = aws_cognito_user_pool.devportal.id
    UserPoolClient = aws_cognito_user_pool_client.devportal_website.id
  }
}

## Cognito User Pool Sign In Throttles
module "cognito_user_pool_sign_in_throttles" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | SignIn Throttles"
  actions_enabled   = true
  alarm_description = "This alarm helps to monitor the occurrence of throttled sign-in requests"
  metric_name       = "SignInThrottles"
  namespace         = "AWS/Cognito"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 0
  statistic           = "Sum"
  unit                = "Count"
  period              = 60
  evaluation_periods  = 5
  datapoints_to_alarm = 5
  treat_missing_data  = "notBreaching" # No data in the period is considered as good.

  dimensions = {
    UserPool       = aws_cognito_user_pool.devportal.id
    UserPoolClient = aws_cognito_user_pool_client.devportal_website.id
  }
}
