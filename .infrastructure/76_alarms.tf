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
module "cognito_user_pool_sign_up_throttles_alarm" {
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
module "cognito_user_pool_sign_in_throttles_alarm" {
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

## Cognito User Pool Token Refresh Throttles
module "cognito_user_pool_token_refresh_throttles_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | TokenRefresh Throttles"
  actions_enabled   = true
  alarm_description = "This alarm helps to monitor the occurrence of throttled token refresh requests"
  metric_name       = "TokenRefreshThrottles"
  namespace         = "AWS/Cognito"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 30 # TODO: change this after an analysis of historic data for this alarm
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

## Cognito Lambdas

### Custom message errors
module "cognito_custom_message_lambda_errors_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | Lambda | CustomMessage | Errors"
  actions_enabled   = true
  alarm_description = "The alarm helps detect high error counts in function invocations"
  metric_name       = "Errors"
  namespace         = "AWS/Lambda"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 10 # TODO: change this after an analysis of historic data for this alarm
  statistic           = "Sum"
  period              = 60
  evaluation_periods  = 3
  datapoints_to_alarm = 3
  treat_missing_data  = "notBreaching" # No data in the period is considered as good.

  dimensions = {
    FunctionName = module.cognito_custom_message_function.lambda_function_name
  }
}

### Custom message throttles
module "cognito_custom_message_lambda_throttles_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | Lambda | CustomMessage | Throttles"
  actions_enabled   = true
  alarm_description = "The alarm helps detect a high number of throttled invocation requests for a Lambda function"
  metric_name       = "Throttles"
  namespace         = "AWS/Lambda"

  comparison_operator = "GreaterThanOrEqualToThreshold"
  threshold           = 10 # TODO: change this after an analysis of historic data for this alarm
  statistic           = "Sum"
  period              = 60
  evaluation_periods  = 5
  datapoints_to_alarm = 5
  treat_missing_data  = "notBreaching" # No data in the period is considered as good.

  dimensions = {
    FunctionName = module.cognito_custom_message_function.lambda_function_name
  }
}

### Custom message duration
module "cognito_custom_message_lambda_duration_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | Lambda | CustomMessage | Duration"
  actions_enabled   = true
  alarm_description = "This alarm can detect a long running duration of a Lambda function"
  metric_name       = "Duration"
  namespace         = "AWS/Lambda"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 7 # This must be lower than the Lambda function timeout. At the moment is less than the 50% of the timeout
  extended_statistic  = "p90"
  period              = 60
  evaluation_periods  = 15
  datapoints_to_alarm = 15
  treat_missing_data  = "notBreaching" # No data in the period is considered as good.

  dimensions = {
    FunctionName = module.cognito_custom_message_function.lambda_function_name
  }
}

### Custom message concurrent executions
module "cognito_custom_message_lambda_concurrent_executions_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | Lambda | CustomMessage | ConcurrentExecutions"
  actions_enabled   = true
  alarm_description = "This alarm can proactively detect if the concurrency of the function is approaching the Region-level concurrency quota of the account"
  metric_name       = "ConcurrentExecutions"
  namespace         = "AWS/Lambda"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 90 # 90% of the concurrency quota
  statistic           = "Maximum"
  period              = 60
  evaluation_periods  = 10
  datapoints_to_alarm = 10
  treat_missing_data  = "notBreaching" # No data in the period is considered as good.

  dimensions = {
    FunctionName = module.cognito_custom_message_function.lambda_function_name
  }
}
