output "alarm_arns" {
  description = "ARNs of the WAF count alarms, keyed by rule."
  value       = { for key, alarm in aws_cloudwatch_metric_alarm.counted_requests : key => alarm.arn }
}

output "web_acl_arn" {
  description = "ARN of the WAF web ACL"
  value       = aws_wafv2_web_acl.public_endpoints.arn
}
