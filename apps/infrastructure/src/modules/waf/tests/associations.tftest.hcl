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

run "plan_shared_alb_and_rest_api_stage_associations" {
  command = plan

  variables {
    environment              = "prod"
    sampled_requests_enabled = false
    associated_resource_arns = {
      cms             = "arn:aws:elasticloadbalancing:eu-south-1:123456789012:loadbalancer/app/cms/1234567890abcdef"
      webinar_metrics = "arn:aws:apigateway:eu-south-1::/restapis/exampleapi/stages/v1"
    }
  }

  assert {
    condition = tomap({
      for key, association in aws_wafv2_web_acl_association.public_albs : key => association.resource_arn
    }) == var.associated_resource_arns
    error_message = "The shared regional ACL must keep the ALB association and add the REST API stage association."
  }

  assert {
    condition = (
      !aws_wafv2_web_acl.public_albs.visibility_config[0].sampled_requests_enabled &&
      alltrue([for rule in aws_wafv2_web_acl.public_albs.rule : !rule.visibility_config[0].sampled_requests_enabled])
    )
    error_message = "Disabling sampling must prevent both ACL and rule request samples."
  }
}

run "plan_cloudfront_waf_without_regional_association" {
  command = plan

  variables {
    environment = "prod"
    scope       = "CLOUDFRONT"
  }

  assert {
    condition     = length(aws_wafv2_web_acl_association.public_albs) == 0
    error_message = "CloudFront must be associated through the distribution, not a regional association."
  }
}
