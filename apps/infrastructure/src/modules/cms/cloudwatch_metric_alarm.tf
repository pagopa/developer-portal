# CloudWatch Alarms for CMS Module

## CMS media library distribution — 5xx error rate
module "cloudfront_cms_5xx_error_rate_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | CMS | CloudFront | 5xxErrorRate"
  actions_enabled   = true
  alarm_description = "This alarm monitors the percentage of 5xx error responses from the CMS media library CloudFront distribution"
  metric_name       = "5xxErrorRate"
  namespace         = "AWS/CloudFront"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 15 # 15%
  statistic           = "Average"
  period              = 300 # 5 minutes
  evaluation_periods  = 3
  datapoints_to_alarm = 2
  treat_missing_data  = "notBreaching"
  alarm_actions       = [var.alerting_topic_arn]

  dimensions = {
    DistributionId = module.cloudfront_cms.cloudfront_distribution_id
    Region         = "Global" # Global because CloudFront is a global service
  }
}

## CMS media library distribution — 4xx error rate
module "cloudfront_cms_4xx_error_rate_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | CMS | CloudFront | 4xxErrorRate"
  actions_enabled   = true
  alarm_description = "This alarm monitors the percentage of 4xx error responses from the CMS media library CloudFront distribution (S3 403s are mapped to 404)"
  metric_name       = "4xxErrorRate"
  namespace         = "AWS/CloudFront"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 10 # 10%
  statistic           = "Average"
  period              = 300 # 5 minutes
  evaluation_periods  = 3
  datapoints_to_alarm = 2
  treat_missing_data  = "notBreaching"
  alarm_actions       = [var.alerting_topic_arn]

  dimensions = {
    DistributionId = module.cloudfront_cms.cloudfront_distribution_id
    Region         = "Global" # Global because CloudFront is a global service
  }
}

# Application Load Balancer Alarms

## External Load Balancer — ELB 5xx Errors
module "alb_cms_elb_5xx_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | CMS | ALB | External | ELB5XXErrors"
  actions_enabled   = true
  alarm_description = "This alarm monitors ALB-generated 5xx errors (502, 503, 504)"
  metric_name       = "HTTPCode_ELB_5XX_Count"
  namespace         = "AWS/ApplicationELB"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 10
  statistic           = "Sum"
  period              = 60
  evaluation_periods  = 5
  datapoints_to_alarm = 3
  treat_missing_data  = "notBreaching"
  alarm_actions       = [var.alerting_topic_arn]

  dimensions = {
    LoadBalancer = module.cms_load_balancer.arn_suffix
  }
}

## External Load Balancer — Target Response Time (p95)
module "alb_cms_target_response_time_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | CMS | ALB | External | TargetResponseTime"
  actions_enabled   = true
  alarm_description = "This alarm monitors the p95 response time from targets behind the external CMS load balancer"
  metric_name       = "TargetResponseTime"
  namespace         = "AWS/ApplicationELB"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 3.0 # 3.0 seconds
  extended_statistic  = "p95"
  period              = 60
  evaluation_periods  = 1
  treat_missing_data  = "notBreaching"
  alarm_actions       = [var.alerting_topic_arn]

  dimensions = {
    LoadBalancer = module.cms_load_balancer.arn_suffix
  }
}

## External Load Balancer — Target 5xx Errors
module "alb_cms_target_5xx_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | CMS | ALB | External | Target5XXErrors"
  actions_enabled   = true
  alarm_description = "This alarm monitors 5xx errors from targets behind the external CMS load balancer"
  metric_name       = "HTTPCode_Target_5XX_Count"
  namespace         = "AWS/ApplicationELB"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 10
  statistic           = "Sum"
  period              = 60
  evaluation_periods  = 1
  treat_missing_data  = "notBreaching"
  alarm_actions       = [var.alerting_topic_arn]

  dimensions = {
    LoadBalancer = module.cms_load_balancer.arn_suffix
  }
}

## External Load Balancer — Unhealthy Host Count
module "alb_cms_unhealthy_hosts_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | CMS | ALB | External | UnhealthyHosts"
  actions_enabled   = true
  alarm_description = "This alarm monitors unhealthy targets behind the external CMS load balancer"
  metric_name       = "UnHealthyHostCount"
  namespace         = "AWS/ApplicationELB"

  comparison_operator = "GreaterThanOrEqualToThreshold"
  threshold           = 1
  statistic           = "Maximum"
  period              = 60
  evaluation_periods  = 1
  treat_missing_data  = "notBreaching"
  alarm_actions       = [var.alerting_topic_arn]

  dimensions = {
    LoadBalancer = module.cms_load_balancer.arn_suffix
    TargetGroup  = module.cms_load_balancer.target_groups["cms-target-group"].arn_suffix
  }
}

## External Load Balancer — Healthy Host Drop
module "alb_cms_healthy_hosts_drop_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | CMS | ALB | External | HealthyHostsDrop"
  actions_enabled   = true
  alarm_description = "This alarm monitors a complete backend failure by tracking healthy hosts dropping below 1"
  metric_name       = "HealthyHostCount"
  namespace         = "AWS/ApplicationELB"

  comparison_operator = "LessThanThreshold"
  threshold           = 1
  statistic           = "Minimum"
  period              = 60
  evaluation_periods  = 1
  treat_missing_data  = "notBreaching"
  alarm_actions       = [var.alerting_topic_arn]

  dimensions = {
    LoadBalancer = module.cms_load_balancer.arn_suffix
    TargetGroup  = module.cms_load_balancer.target_groups["cms-target-group"].arn_suffix
  }
}

## Internal Load Balancer — ELB 5xx Errors
module "alb_cms_internal_elb_5xx_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | CMS | ALB | Internal | ELB5XXErrors"
  actions_enabled   = true
  alarm_description = "This alarm monitors ALB-generated 5xx errors (502, 503, 504) for the internal load balancer"
  metric_name       = "HTTPCode_ELB_5XX_Count"
  namespace         = "AWS/ApplicationELB"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 10
  statistic           = "Sum"
  period              = 60
  evaluation_periods  = 1
  treat_missing_data  = "notBreaching"
  alarm_actions       = [var.alerting_topic_arn]

  dimensions = {
    LoadBalancer = module.cms_load_balancer_internal.arn_suffix
  }
}

## Internal Load Balancer — Target Response Time (p95)
module "alb_cms_internal_target_response_time_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | CMS | ALB | Internal | TargetResponseTime"
  actions_enabled   = true
  alarm_description = "This alarm monitors the p95 response time from targets behind the internal CMS load balancer"
  metric_name       = "TargetResponseTime"
  namespace         = "AWS/ApplicationELB"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 3.0 # 3.0 seconds
  extended_statistic  = "p95"
  period              = 60
  evaluation_periods  = 1
  treat_missing_data  = "notBreaching"
  alarm_actions       = [var.alerting_topic_arn]

  dimensions = {
    LoadBalancer = module.cms_load_balancer_internal.arn_suffix
  }
}

## Internal Load Balancer — Target 5xx Errors
module "alb_cms_internal_target_5xx_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | CMS | ALB | Internal | Target5XXErrors"
  actions_enabled   = true
  alarm_description = "This alarm monitors 5xx errors from targets behind the internal CMS load balancer"
  metric_name       = "HTTPCode_Target_5XX_Count"
  namespace         = "AWS/ApplicationELB"

  comparison_operator = "GreaterThanThreshold"
  threshold           = 10
  statistic           = "Sum"
  period              = 60
  evaluation_periods  = 1
  treat_missing_data  = "notBreaching"
  alarm_actions       = [var.alerting_topic_arn]

  dimensions = {
    LoadBalancer = module.cms_load_balancer_internal.arn_suffix
  }
}

## Internal Load Balancer — Unhealthy Host Count
module "alb_cms_internal_unhealthy_hosts_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | CMS | ALB | Internal | UnhealthyHosts"
  actions_enabled   = true
  alarm_description = "This alarm monitors unhealthy targets behind the internal CMS load balancer"
  metric_name       = "UnHealthyHostCount"
  namespace         = "AWS/ApplicationELB"

  comparison_operator = "GreaterThanOrEqualToThreshold"
  threshold           = 1
  statistic           = "Maximum"
  period              = 60
  evaluation_periods  = 1
  treat_missing_data  = "notBreaching"
  alarm_actions       = [var.alerting_topic_arn]

  dimensions = {
    LoadBalancer = module.cms_load_balancer_internal.arn_suffix
    TargetGroup  = module.cms_load_balancer_internal.target_groups["cms-target-group-internal"].arn_suffix
  }
}

## Internal Load Balancer — Healthy Host Drop
module "alb_cms_internal_healthy_hosts_drop_alarm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm?ref=0b4aa2b9aa19060205965a938de89a7bf0ff477b" # v5.1.0

  alarm_name        = "DevPortal | CMS | ALB | Internal | HealthyHostsDrop"
  actions_enabled   = true
  alarm_description = "This alarm monitors a complete backend failure by tracking healthy hosts dropping below 1 on the internal load balancer"
  metric_name       = "HealthyHostCount"
  namespace         = "AWS/ApplicationELB"

  comparison_operator = "LessThanThreshold"
  threshold           = 1
  statistic           = "Minimum"
  period              = 60
  evaluation_periods  = 1
  treat_missing_data  = "notBreaching"
  alarm_actions       = [var.alerting_topic_arn]

  dimensions = {
    LoadBalancer = module.cms_load_balancer_internal.arn_suffix
    TargetGroup  = module.cms_load_balancer_internal.target_groups["cms-target-group-internal"].arn_suffix
  }
}
