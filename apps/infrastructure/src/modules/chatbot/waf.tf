resource "aws_wafv2_web_acl" "chatbot" {
  name        = "${local.prefix}-waf"
  description = "Web ACL Rule for Chatbot in ${var.environment}"
  scope       = "REGIONAL"

  default_action {
    allow {}
  }

  visibility_config {
    cloudwatch_metrics_enabled = false
    metric_name                = "${local.prefix}-waf"
    sampled_requests_enabled   = false
  }

  association_config {
    request_body {
      api_gateway {
        default_size_inspection_limit = "KB_16"
      }
    }
  }

  # The following rule blocks requests that arrive in POST on the API Gateway
  # with route "/queries" when their number is greater than 10 per minute
  rule {
    name     = "block-requests-to-queries"
    priority = 0

    action {
      count {} # To test with use `count {}` instead of `block {}`
    }

    statement {
      rate_based_statement {
        aggregate_key_type    = "CONSTANT"
        limit                 = var.waf_block_requests_to_queries_limit
        evaluation_window_sec = var.waf_block_requests_to_queries_evaluation_window_sec

        scope_down_statement {
          byte_match_statement {
            field_to_match {
              uri_path {}
            }

            positional_constraint = "STARTS_WITH"
            search_string         = "/queries"

            text_transformation {
              priority = 1
              type     = "NONE"
            }
          }
        }
      }
    }

    visibility_config {
      sampled_requests_enabled   = true
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.prefix}-waf-metric-block-requests-to-queries"
    }
  }

  # The following rule apply a rate limit of N requests from the same IP
  rule {
    name     = "ip-rate-limit"
    priority = 1

    action {
      count {} # To test with use `count {}` instead of `block {}`
    }

    statement {
      rate_based_statement {
        limit                 = var.waf_ip_rate_limit_limit
        aggregate_key_type    = "IP"
        evaluation_window_sec = var.waf_ip_rate_limit_evaluation_window_sec
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.prefix}-waf-metric-ip-rate-limit"
      sampled_requests_enabled   = false
    }
  }

  # The following rule blocks requests that are identified as bot control
  rule {
    name     = "block-bot-control-requests"
    priority = 2

    override_action {
      count {} # To test with use `count {}` instead of `block {}`
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesBotControlRuleSet"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.prefix}-waf-metric-bot-control"
      sampled_requests_enabled   = false
    }
  }
}

resource "aws_wafv2_web_acl_association" "chatbot" {
  resource_arn = "${aws_api_gateway_rest_api.api.arn}/stages/${aws_api_gateway_stage.api_stage.stage_name}"
  web_acl_arn  = aws_wafv2_web_acl.chatbot.arn


  depends_on = [
    aws_api_gateway_deployment.stage,
    aws_wafv2_web_acl.chatbot
  ]
}
