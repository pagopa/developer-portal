locals {
  counted_request_alarms = var.scope == "REGIONAL" && var.alerting != null ? {
    ip_rate_limit = {
      metric_name = local.ip_rate_limit_metric_name
      threshold   = var.alerting.ip_rate_limit_threshold
      description = "Sustained matches on the count-only WAF per-IP rate rule. No requests are blocked by this rule."
    }
    known_bad_inputs = {
      metric_name = local.known_bad_inputs_metric_name
      threshold   = var.alerting.known_bad_inputs_threshold
      description = "Sustained matches on the count-only WAF Known Bad Inputs managed group. Investigate for suspicious traffic or false positives."
    }
  } : {}
}

data "aws_region" "current" {}

resource "aws_cloudwatch_metric_alarm" "counted_requests" {
  for_each = local.counted_request_alarms

  alarm_name          = "${local.name}-${replace(each.key, "_", "-")}-counted-requests"
  alarm_description   = each.value.description
  alarm_actions       = [var.alerting.topic_arn]
  namespace           = "AWS/WAFV2"
  metric_name         = "CountedRequests"
  statistic           = "Sum"
  period              = 60
  evaluation_periods  = 5
  datapoints_to_alarm = 3
  comparison_operator = "GreaterThanOrEqualToThreshold"
  threshold           = each.value.threshold
  treat_missing_data  = "notBreaching"
  tags                = var.tags

  dimensions = {
    Region = data.aws_region.current.region
    Rule   = each.value.metric_name
    WebACL = local.name
  }
}
