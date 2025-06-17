# This file contains moved blocks from handle resources that are changing to regular resources
# from count/for_each resources without destroying and recreating them.

# CloudFront Distribution
moved {
  to   = module.website.aws_cloudfront_distribution.website
  from = module.website.aws_cloudfront_distribution.website["static"]
}

# CloudFront Function
moved {
  to   = module.website.aws_cloudfront_function.website_viewer_request_handler
  from = module.website.aws_cloudfront_function.website_viewer_request_handler["static"]
}

# CloudFront Origin Access Identity
moved {
  to   = module.website.aws_cloudfront_origin_access_identity.main
  from = module.website.aws_cloudfront_origin_access_identity.main["static"]
}

# CloudFront Response Headers Policy
moved {
  to   = module.website.aws_cloudfront_response_headers_policy.websites
  from = module.website.aws_cloudfront_response_headers_policy.websites["static"]
}

# CloudWatch Dashboard
moved {
  to   = module.website.aws_cloudwatch_dashboard.main
  from = module.website.aws_cloudwatch_dashboard.main["static"]
}

# Route53 Records
moved {
  to   = module.website.aws_route53_record.website
  from = module.website.aws_route53_record.website["static"]
}

moved {
  to   = module.website.aws_route53_record.www_website
  from = module.website.aws_route53_record.www_website["static"]
}

moved {
  to   = module.website.aws_s3_bucket_policy.cloudfront
  from = module.website.aws_s3_bucket_policy.cloudfront["static"]
}

moved {
  to   = module.website.module.cloudfront_5xx_error_rate_alarm
  from = module.website.module.cloudfront_5xx_error_rate_alarm["static"]
}

moved {
  to   = module.website.module.cloudfront_function_execution_errors_alarm
  from = module.website.module.cloudfront_function_execution_errors_alarm["static"]
}

moved {
  to   = module.website.module.cloudfront_function_throttled_alarm
  from = module.website.module.cloudfront_function_throttled_alarm["static"]
}

moved {
  to   = module.website.module.cloudfront_function_validation_errors_alarm
  from = module.website.module.cloudfront_function_validation_errors_alarm["static"]
}

moved {
  to   = module.website.module.cloudfront_origin_latency_alarm
  from = module.website.module.cloudfront_origin_latency_alarm["static"]
}

## Import ##
/*
import {
  to = module.website.data.aws_ssm_parameter.cookie_domain_script
  id = "COOKIE_DOMAIN_SCRIPT"
}

import {
  to = module.website.data.aws_ssm_parameter.strapi_api_token
  id = "STRAPI_API_TOKEN"
}

*/