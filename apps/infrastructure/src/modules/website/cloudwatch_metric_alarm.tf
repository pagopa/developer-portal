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
  alarm_actions       = [aws_sns_topic.metric_alarm.arn]
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
  alarm_actions       = [aws_sns_topic.metric_alarm.arn]
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
  alarm_actions       = [aws_sns_topic.metric_alarm.arn]
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
  alarm_actions       = [aws_sns_topic.metric_alarm.arn]
}

# CloudFront

## Number of requests with 5xx status code
module "cloudfront_5xx_error_rate_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | CloudFront 5xxErrorRate"
  actions_enabled   = true
  alarm_description = "This alarm monitors the percentage of 5xx error responses from origin server"
  metric_name       = "5xxErrorRate"
  namespace         = "AWS/CloudFront"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 30 # 30%
  statistic           = "Average"
  period              = 60 # 1 minute
  evaluation_periods  = 5
  datapoints_to_alarm = 5
  treat_missing_data  = "notBreaching" # No data in the period is considered as good.
  alarm_actions       = [aws_sns_topic.metric_alarm.arn]

  dimensions = {
    DistributionId = module.opennext.cloudfront.distribution_id
    Region         = "Global" # Global because CloudFront is a global service
  }
}

## Origin latency
module "cloudfront_origin_latency_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | Website | CloudFront Origin Latency"
  actions_enabled   = true
  alarm_description = "This alarm is used to detect problems with the origin server taking too long to respond"
  metric_name       = "OriginLatency"
  namespace         = "AWS/CloudFront"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 24 # 80% of 30. 30s is the default value. 80% is the threshold suggested by AWS
  extended_statistic  = "p90"
  period              = 60 # 1 minute
  evaluation_periods  = 5
  datapoints_to_alarm = 5
  treat_missing_data  = "notBreaching" # No data in the period is considered as good.
  alarm_actions       = [aws_sns_topic.metric_alarm.arn]

  dimensions = {
    DistributionId = module.opennext.cloudfront.distribution_id
    Region         = "Global" # Global because CloudFront is a global service
  }
}

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
  alarm_actions       = [aws_sns_topic.metric_alarm.arn]
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
  alarm_actions       = [aws_sns_topic.metric_alarm.arn]
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
  alarm_actions       = [aws_sns_topic.metric_alarm.arn]

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
  alarm_actions       = [aws_sns_topic.metric_alarm.arn]

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
  alarm_actions       = [aws_sns_topic.metric_alarm.arn]
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
  alarm_actions       = [aws_sns_topic.metric_alarm.arn]

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
  alarm_actions       = [aws_sns_topic.metric_alarm.arn]

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
  alarm_actions       = [aws_sns_topic.metric_alarm.arn]

  dimensions = {
    TableName = module.dynamodb_webinar_questions.dynamodb_table_id
    Operation = "Query"
  }
}
