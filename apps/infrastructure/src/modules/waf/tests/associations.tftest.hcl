mock_provider "aws" {}

run "plan_cms_with_unknown_arn" {
  command = plan

  module {
    source = "./tests/fixtures/unknown_arns"
  }

  variables {
    include_langfuse = false
  }
}

run "plan_cms_and_langfuse_with_unknown_arns" {
  command = plan

  module {
    source = "./tests/fixtures/unknown_arns"
  }

  variables {
    include_langfuse = true
  }
}

run "plan_regional_waf_alerts" {
  command = plan

  variables {
    environment = "prod"
    alerting = {
      topic_arn = "arn:aws:sns:eu-south-1:123456789012:alerts"
    }
  }

  assert {
    condition = (
      toset(keys(aws_cloudwatch_metric_alarm.counted_requests)) == toset(["ip_rate_limit", "known_bad_inputs"]) &&
      alltrue([
        for alarm in aws_cloudwatch_metric_alarm.counted_requests :
        alarm.alarm_actions == toset([var.alerting.topic_arn])
      ])
    )
    error_message = "Both WAF count alarms must notify the configured SNS topic."
  }
}
