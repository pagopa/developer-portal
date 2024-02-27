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

### Post confirmation errors
module "cognito_post_confirmation_lambda_errors_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | Lambda | PostConfirmation | Errors"
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
    FunctionName = module.cognito_post_confirmation_function.lambda_function_name
  }
}

### Post confirmation throttles
module "cognito_post_confirmation_lambda_throttles_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | Lambda | PostConfirmation | Throttles"
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
    FunctionName = module.cognito_post_confirmation_function.lambda_function_name
  }
}

### Post confirmation duration
module "cognito_post_confirmation_lambda_duration_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | Lambda | PostConfirmation | Duration"
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
    FunctionName = module.cognito_post_confirmation_function.lambda_function_name
  }
}

### Post confirmation concurrent executions
module "cognito_post_confirmation_lambda_concurrent_executions_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | Lambda | PostConfirmation | ConcurrentExecutions"
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
    FunctionName = module.cognito_post_confirmation_function.lambda_function_name
  }
}

### Define auth challenge errors
module "cognito_define_auth_challenge_lambda_errors_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | Lambda | DefineAuthChallenge | Errors"
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
    FunctionName = module.cognito_define_auth_challenge_function.lambda_function_name
  }
}

### Define auth challenge throttles
module "cognito_define_auth_challenge_lambda_throttles_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | Lambda | DefineAuthChallenge | Throttles"
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
    FunctionName = module.cognito_define_auth_challenge_function.lambda_function_name
  }
}

### Define auth challenge duration
module "cognito_define_auth_challenge_lambda_duration_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | Lambda | DefineAuthChallenge | Duration"
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
    FunctionName = module.cognito_define_auth_challenge_function.lambda_function_name
  }
}

### Define auth challenge concurrent executions
module "cognito_define_auth_challenge_lambda_concurrent_executions_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | Lambda | DefineAuthChallenge | ConcurrentExecutions"
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
    FunctionName = module.cognito_define_auth_challenge_function.lambda_function_name
  }
}

### Create auth challenge errors
module "cognito_create_auth_challenge_lambda_errors_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | Lambda | CreateAuthChallenge | Errors"
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
    FunctionName = module.cognito_create_auth_challenge_function.lambda_function_name
  }
}
### Create auth challenge throttles
module "cognito_create_auth_challenge_lambda_throttles_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | Lambda | CreateAuthChallenge | Throttles"
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
    FunctionName = module.cognito_create_auth_challenge_function.lambda_function_name
  }
}

### Create auth challenge duration
module "cognito_create_auth_challenge_lambda_duration_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | Lambda | CreateAuthChallenge | Duration"
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
    FunctionName = module.cognito_create_auth_challenge_function.lambda_function_name
  }
}

### Create auth challenge concurrent executions
module "cognito_create_auth_challenge_lambda_concurrent_executions_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | Lambda | CreateAuthChallenge | ConcurrentExecutions"
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
    FunctionName = module.cognito_create_auth_challenge_function.lambda_function_name
  }
}

### Verify auth challenge errors
module "cognito_verify_auth_challenge_lambda_errors_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | Lambda | VerifyAuthChallenge | Errors"
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
    FunctionName = module.cognito_verify_auth_challenge_function.lambda_function_name
  }
}

### Verify auth challenge throttles
module "cognito_verify_auth_challenge_lambda_throttles_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | Lambda | VerifyAuthChallenge | Throttles"
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
    FunctionName = module.cognito_verify_auth_challenge_function.lambda_function_name
  }
}

### Verify auth challenge duration
module "cognito_verify_auth_challenge_lambda_duration_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | Lambda | VerifyAuthChallenge | Duration"
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
    FunctionName = module.cognito_verify_auth_challenge_function.lambda_function_name
  }
}

### Verify auth challenge concurrent executions
module "cognito_verify_auth_challenge_lambda_concurrent_executions_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Cognito | Lambda | VerifyAuthChallenge | ConcurrentExecutions"
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
    FunctionName = module.cognito_verify_auth_challenge_function.lambda_function_name
  }
}

# CloudFront

# DynamoDB

## Read capacity utilization
module "dynamodb_read_capacity_utilization_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | DynamoDB | ReadCapacityUtilization"
  actions_enabled   = true
  alarm_description = "This alarm can detect if the account’s read capacity utilization is approaching its provisioned read capacity utilization"
  metric_name       = "AccountProvisionedReadCapacityUtilization"
  namespace         = "AWS/DynamoDB"

  comparison_operator = "GreaterThanThreshold"
  threshold           = "80.0"
  statistic           = "Maximum"
  period              = 300 # 5 minutes
  evaluation_periods  = 2
  datapoints_to_alarm = 2
  treat_missing_data  = "notBreaching" # No data in the period is considered as good.
}

## Write capacity utilization
module "dynamodb_write_capacity_utilization_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | DynamoDB | WriteCapacityUtilization"
  actions_enabled   = true
  alarm_description = "This alarm can detect if the account’s write capacity utilization is approaching its provisioned write capacity utilization"
  metric_name       = "AccountProvisionedWriteCapacityUtilization"
  namespace         = "AWS/DynamoDB"

  comparison_operator = "GreaterThanThreshold"
  threshold           = "80.0"
  statistic           = "Maximum"
  period              = 300 # 5 minutes
  evaluation_periods  = 2
  datapoints_to_alarm = 2
  treat_missing_data  = "notBreaching" # No data in the period is considered as good.
}

## Read throttle event
module "dynamodb_read_throttle_events_webinar_questions_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Webinar | Questions | ReadThrottleEvents"
  actions_enabled   = true
  alarm_description = "This alarm can detect sustained throttling for read requests to the DynamoDB table"
  metric_name       = "ReadThrottleEvents"
  namespace         = "AWS/DynamoDB"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 1
  statistic           = "Sum"
  period              = 60
  evaluation_periods  = 5
  datapoints_to_alarm = 5
  treat_missing_data  = "notBreaching" # No data in the period is considered as good.

  dimensions = {
    TableName = module.dynamodb_webinar_questions.dynamodb_table_id
  }
}

## Write throttle event
module "dynamodb_write_throttle_events_webinar_questions_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Webinar | Questions | WriteThrottleEvents"
  actions_enabled   = true
  alarm_description = "This alarm can detect sustained throttling for write requests to the DynamoDB table"
  metric_name       = "WriteThrottleEvents"
  namespace         = "AWS/DynamoDB"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 1
  statistic           = "Sum"
  period              = 60
  evaluation_periods  = 5
  datapoints_to_alarm = 5
  treat_missing_data  = "notBreaching" # No data in the period is considered as good.

  dimensions = {
    TableName = module.dynamodb_webinar_questions.dynamodb_table_id
  }
}

## User Errors
module "dynamodb_user_errors_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | DynamoDB | UserErrors"
  actions_enabled   = true
  alarm_description = "This alarm can detect sustained user errors for the DynamoDB table requests"
  metric_name       = "UserErrors"
  namespace         = "AWS/DynamoDB"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 0
  statistic           = "Sum"
  period              = 60
  evaluation_periods  = 10
  datapoints_to_alarm = 10
  treat_missing_data  = "notBreaching" # No data in the period is considered as good.

}

module "dynamodb_system_errors_webinar_questions_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Webinar | Questions | SystemErrors"
  actions_enabled   = true
  alarm_description = "This alarm can detect sustained system errors for the DynamoDB table requests"
  metric_name       = "SystemErrors"
  namespace         = "AWS/DynamoDB"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 0
  statistic           = "Sum"
  period              = 60
  evaluation_periods  = 15
  datapoints_to_alarm = 15
  treat_missing_data  = "notBreaching" # No data in the period is considered as good.

  dimensions = {
    TableName = module.dynamodb_webinar_questions.dynamodb_table_id
  }
}

module "dynamodb_successful_request_latency_put_item_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Webinar | Questions | Successful Request Latency | PutItem"
  actions_enabled   = true
  alarm_description = "This alarm can detect a high latency for the DynamoDB table PutItem operation"
  metric_name       = "SuccessfulRequestLatency"
  namespace         = "AWS/DynamoDB"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 50
  statistic           = "Average"
  period              = 60
  evaluation_periods  = 10
  datapoints_to_alarm = 10
  treat_missing_data  = "notBreaching" # No data in the period is considered as good.

  dimensions = {
    TableName = module.dynamodb_webinar_questions.dynamodb_table_id
    Operation = "PutItem"
  }
}

module "dynamodb_successful_request_latency_query_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | Webinar | Questions | Successful Request Latency | Query"
  actions_enabled   = true
  alarm_description = "This alarm can detect a high latency for the DynamoDB table Query operation"
  metric_name       = "SuccessfulRequestLatency"
  namespace         = "AWS/DynamoDB"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 50
  statistic           = "Average"
  period              = 60
  evaluation_periods  = 10
  datapoints_to_alarm = 10
  treat_missing_data  = "notBreaching" # No data in the period is considered as good.

  dimensions = {
    TableName = module.dynamodb_webinar_questions.dynamodb_table_id
    Operation = "Query"
  }
}
