locals {
  name = var.name != null ? var.name : "devportal-${var.environment}-public-waf"

  metric_name_prefix = var.metric_name_prefix != null ? var.metric_name_prefix : local.name

  ip_rate_limit_metric_name    = "${local.metric_name_prefix}-ip-rate-limit"
  known_bad_inputs_metric_name = "${local.metric_name_prefix}-known-bad-inputs"
}

resource "aws_wafv2_web_acl" "public_endpoints" {
  name        = local.name
  description = "Count-only WAF protections for public Developer Portal endpoints"
  scope       = var.scope
  tags        = var.tags

  default_action {
    allow {}
  }

  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 0

    override_action {
      count {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.metric_name_prefix}-common-rules"
      sampled_requests_enabled   = var.sampled_requests_enabled
    }
  }

  rule {
    name     = "AWSManagedRulesKnownBadInputsRuleSet"
    priority = 1

    override_action {
      count {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = local.known_bad_inputs_metric_name
      sampled_requests_enabled   = var.sampled_requests_enabled
    }
  }

  rule {
    name     = "ip-rate-limit"
    priority = 2

    action {
      count {}
    }

    statement {
      rate_based_statement {
        limit                 = var.rate_limit
        aggregate_key_type    = "IP"
        evaluation_window_sec = 60
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = local.ip_rate_limit_metric_name
      sampled_requests_enabled   = var.sampled_requests_enabled
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = local.name
    sampled_requests_enabled   = var.sampled_requests_enabled
  }
}

resource "aws_wafv2_web_acl_association" "regional" {
  for_each = var.scope == "REGIONAL" ? var.associated_resource_arns : {}

  resource_arn = each.value
  web_acl_arn  = aws_wafv2_web_acl.public_endpoints.arn
}
