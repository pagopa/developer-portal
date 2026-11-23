# CSP entries
locals {
  script_src  = "'self' 'unsafe-inline' www.youtube.com https://*.cookielaw.org/ https://*.onetrust.com https://www.google-analytics.com https://recaptcha.net https://www.gstatic.com https://www.google.com https://www.googletagmanager.com"
  style_src   = "'self' 'unsafe-inline' recaptcha.net https://privacyportalde-cdn.onetrust.com/privacy-notice-scripts/css/"
  object_src  = "'none'"
  form_action = "'self'"
  font_src    = "data: 'self' https://privacyportalde-cdn.onetrust.com/privacy-notice-scripts/icons/"
  connect_src = "'self' https://cognito-identity.eu-south-1.amazonaws.com/ https://dynamodb.eu-south-1.amazonaws.com/ https://cognito-idp.eu-south-1.amazonaws.com/ https://raw.githubusercontent.com/pagopa/ https://raw.githubusercontent.com/teamdigitale/ https://*.cookielaw.org https://*.onetrust.com https://www.google-analytics.com https://api.io.italia.it *.google-analytics.com https://*.${var.dns_domain_name}"
  img_src     = "data: 'self' https://io.italia.it/assets/ https://raw.githubusercontent.com/pagopa/ https://www.pagopa.gov.it/assets/ https://*.cookielaw.org/logos/ recaptcha.net  https://*.googleusercontent.com https://*.dev.developer.pagopa.it https://*.developer.pagopa.it"
  frame_src   = "https://demo.arcade.software/ https://www.google.com https://recaptcha.net https://www.youtube.com https://pagopa.applytojob.com https://www.figma.com/ https://codepen.io/ https://static-contents.${var.dns_domain_name}"
}

resource "aws_cloudfront_origin_access_identity" "main" {
  comment = "Identity to access S3 bucket."
}

resource "aws_cloudfront_response_headers_policy" "websites" {
  name    = "websites"
  comment = "Response custom headers for public static website"

  custom_headers_config {
    items {
      header   = "Server"
      override = true
      value    = "None"
    }

    dynamic "items" {
      for_each = var.cdn_custom_headers
      content {
        header   = items.value.header
        override = items.value.override
        value    = items.value.value
      }
    }
  }

  security_headers_config {
    content_security_policy {
      content_security_policy = format("script-src %s; style-src %s; object-src %s; form-action %s; font-src %s; connect-src %s; img-src %s; frame-src %s", local.script_src, local.style_src, local.object_src, local.form_action, local.font_src, local.connect_src, local.img_src, local.frame_src)
      override                = true
    }
    frame_options {
      frame_option = "SAMEORIGIN"
      override     = true
    }
  }
}

## Function to manipulate the request
resource "aws_cloudfront_function" "website_viewer_request_handler" {
  name    = "website-viewer-request-handler"
  runtime = "cloudfront-js-1.0"
  # publish this version only if the env is true
  publish = var.publish_cloudfront_functions
  code    = file("${path.root}/../../cloudfront-functions/src/viewer-request-handler.js")
}


# cloudfront distribution for standalone static content

resource "aws_cloudfront_response_headers_policy" "static_content_cors" {
  name    = "cors-policy"
  comment = "Cors policy for static contents"

  custom_headers_config {
    items {
      header   = "Server"
      override = true
      value    = "None"
    }
  }

  security_headers_config {
    content_security_policy {
      content_security_policy = "frame-ancestors 'self' https://${var.dns_domain_name} https://www.${var.dns_domain_name}"
      override                = true
    }
  }

  cors_config {
    access_control_allow_credentials = false

    access_control_allow_headers {
      items = ["*"]
    }


    access_control_allow_methods {
      items = ["GET", "HEAD"]
    }


    access_control_allow_origins {
      items = ["https://${var.dns_domain_name}"]
    }

    origin_override = true
  }
}


## Static website CDN
resource "aws_cloudfront_distribution" "static_contents" {

  origin {
    domain_name = aws_s3_bucket.website_standalone.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.website_standalone.bucket
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path
    }
  }


  enabled         = true # enable CloudFront distribution
  is_ipv6_enabled = true
  comment         = "CloudFront distribution for the static contetnts."


  aliases = [local.dns_domain_name_static_contents]


  default_cache_behavior {
    # HTTPS requests we permit the distribution to serve
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = aws_s3_bucket.website_standalone.bucket
    response_headers_policy_id = aws_cloudfront_response_headers_policy.static_content_cors.id

    forwarded_values {
      query_string = false
      headers      = []
      cookies {
        forward = "none"
      }
    }


    viewer_protocol_policy = "redirect-to-https"
    # aggerssive caching for versioned static contents
    min_ttl     = 3600
    default_ttl = 86400
    max_ttl     = 31536000

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.website_viewer_request_handler.arn
    }
  }

  # S3 returns 403 for missing objects when accessed via OAI (no ListBucket permission).
  # Map it to 404 so browsers receive the semantically correct response.
  custom_error_response {
    error_code            = 403
    response_code         = 404
    response_page_path    = "/404.html"
    error_caching_min_ttl = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = false
    acm_certificate_arn            = aws_acm_certificate.static_contents.arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2021"
  }
}

# CloudFront-scoped WAF metrics are published in us-east-1. The ACL-level
# metric is disabled, so alarm on the metrics emitted by each managed rule.
locals {
  cloudfront_waf_rule_metrics = var.enable_regional_waf ? {
    common_rule_set_blocked_requests = {
      rule_metric_name = "${trimsuffix(module.opennext.cloudfront.waf.name, "-waf")}-WAF-AWSManagedRulesCommonRuleSet"
      metric_name      = "BlockedRequests"
    }
    known_bad_inputs_blocked_requests = {
      rule_metric_name = "${trimsuffix(module.opennext.cloudfront.waf.name, "-waf")}-WAF-AWSManagedRulesKnownBadInputsRuleSet"
      metric_name      = "BlockedRequests"
    }
    linux_rule_set_blocked_requests = {
      rule_metric_name = "${trimsuffix(module.opennext.cloudfront.waf.name, "-waf")}-WAF-AWSManagedRulesLinuxRuleSet"
      metric_name      = "BlockedRequests"
    }
    unix_rule_set_blocked_requests = {
      rule_metric_name = "${trimsuffix(module.opennext.cloudfront.waf.name, "-waf")}-WAF-AWSManagedRulesUnixRuleSet"
      metric_name      = "BlockedRequests"
    }
    common_rule_set_counted_requests = {
      rule_metric_name = "${trimsuffix(module.opennext.cloudfront.waf.name, "-waf")}-WAF-AWSManagedRulesCommonRuleSet"
      metric_name      = "CountedRequests"
    }
  } : {}

  cloudfront_waf_alarm_name_prefix = "DevPortal | Website | CloudFront | WAF |"
}

resource "aws_cloudwatch_metric_alarm" "cloudfront_waf_requests" {
  provider = aws.us-east-1
  for_each = local.cloudfront_waf_rule_metrics

  alarm_name          = "${local.cloudfront_waf_alarm_name_prefix} ${replace(each.key, "_", " ")}"
  alarm_description   = "Detects anomalous ${each.value.metric_name} activity for the CloudFront WAF managed rule ${each.value.rule_metric_name}."
  comparison_operator = "GreaterThanUpperThreshold"
  evaluation_periods  = 5
  datapoints_to_alarm = 3
  threshold_metric_id = "e1"
  treat_missing_data  = "notBreaching"
  tags                = var.tags

  metric_query {
    id          = "m1"
    return_data = true

    metric {
      metric_name = each.value.metric_name
      namespace   = "AWS/WAFV2"
      period      = 60
      stat        = "Sum"

      dimensions = {
        Region = "Global"
        Rule   = each.value.rule_metric_name
        WebACL = module.opennext.cloudfront.waf.name
      }
    }
  }

  metric_query {
    id          = "e1"
    expression  = "ANOMALY_DETECTION_BAND(m1, 2)"
    label       = "${each.value.metric_name} expected range"
    return_data = true
  }
}

# Forward matching WAF alarm state changes from the alarm region to the
# eu-south-1 default event bus, where they can be delivered to the shared SNS topic.
data "aws_partition" "current" {}

resource "aws_iam_role" "cloudfront_waf_eventbridge_forwarder" {
  count = var.enable_regional_waf ? 1 : 0

  name = "devportal-cloudfront-waf-eventbridge-forwarder"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "events.amazonaws.com" }
      Action    = "sts:AssumeRole"
      Condition = {
        ArnEquals = {
          "aws:SourceArn" = "arn:${data.aws_partition.current.partition}:events:us-east-1:${data.aws_caller_identity.current.account_id}:rule/devportal-cloudfront-waf-alarm-forwarder"
        }
        StringEquals = {
          "aws:SourceAccount" = data.aws_caller_identity.current.account_id
        }
      }
    }]
  })
}

resource "aws_iam_role_policy" "cloudfront_waf_eventbridge_forwarder" {
  count = var.enable_regional_waf ? 1 : 0

  name = "devportal-cloudfront-waf-eventbridge-forwarder"
  role = aws_iam_role.cloudfront_waf_eventbridge_forwarder[0].id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = "events:PutEvents"
      Resource = "arn:${data.aws_partition.current.partition}:events:eu-south-1:${data.aws_caller_identity.current.account_id}:event-bus/default"
    }]
  })
}

resource "aws_cloudwatch_event_rule" "cloudfront_waf_alarm_forwarder" {
  provider = aws.us-east-1
  count    = var.enable_regional_waf ? 1 : 0

  name = "devportal-cloudfront-waf-alarm-forwarder"
  event_pattern = jsonencode({
    source      = ["aws.cloudwatch"]
    detail-type = ["CloudWatch Alarm State Change"]
    detail = {
      alarmName = [{ prefix = local.cloudfront_waf_alarm_name_prefix }]
    }
  })
}

resource "aws_cloudwatch_event_target" "cloudfront_waf_alarm_forwarder" {
  provider = aws.us-east-1
  count    = var.enable_regional_waf ? 1 : 0

  rule      = aws_cloudwatch_event_rule.cloudfront_waf_alarm_forwarder[0].name
  target_id = "eu-south-1-default-event-bus"
  arn       = "arn:${data.aws_partition.current.partition}:events:eu-south-1:${data.aws_caller_identity.current.account_id}:event-bus/default"
  role_arn  = aws_iam_role.cloudfront_waf_eventbridge_forwarder[0].arn

  depends_on = [aws_iam_role_policy.cloudfront_waf_eventbridge_forwarder]
}

resource "aws_cloudwatch_event_rule" "cloudfront_waf_alarm_state_changes" {
  count = var.enable_regional_waf ? 1 : 0
  name  = "devportal-cloudfront-waf-alarm-state-changes"
  event_pattern = jsonencode({
    source      = ["aws.cloudwatch"]
    detail-type = ["CloudWatch Alarm State Change"]
    detail = {
      alarmName = [{ prefix = local.cloudfront_waf_alarm_name_prefix }]
    }
  })
}

resource "aws_cloudwatch_event_target" "cloudfront_waf_alarm_notifications" {
  count     = var.enable_regional_waf ? 1 : 0
  rule      = aws_cloudwatch_event_rule.cloudfront_waf_alarm_state_changes[0].name
  target_id = "devportal-cloudwatch-alarms"
  arn       = var.alerting_topic_arn
}
