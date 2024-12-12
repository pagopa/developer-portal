resource "aws_wafv2_web_acl" "chatbot" {
  name        = "${local.prefix}-waf"
  scope       = "REGIONAL"

  default_action {
    allow {}
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${local.prefix}-waf"
    sampled_requests_enabled    = true
  }

  association_config {
    request_body {
      api_gateway {
        default_size_inspection_limit = "KB_16"
      }
    }
  }
}
