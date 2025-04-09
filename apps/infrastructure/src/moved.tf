# This file contains moved blocks to handle resources that are changing from regular resources
# to count/for_each resources without destroying and recreating them.

# CloudFront Distribution
moved {
  from = module.website.aws_cloudfront_distribution.website
  to   = module.website.aws_cloudfront_distribution.website["static"]
}

# CloudFront Function
moved {
  from = module.website.aws_cloudfront_function.website_viewer_request_handler
  to   = module.website.aws_cloudfront_function.website_viewer_request_handler["static"]
}

# CloudFront Origin Access Identity
moved {
  from = module.website.aws_cloudfront_origin_access_identity.main
  to   = module.website.aws_cloudfront_origin_access_identity.main["static"]
}

# CloudFront Response Headers Policy
moved {
  from = module.website.aws_cloudfront_response_headers_policy.websites
  to   = module.website.aws_cloudfront_response_headers_policy.websites["static"]
}

# CloudWatch Dashboard
moved {
  from = module.website.aws_cloudwatch_dashboard.main
  to   = module.website.aws_cloudwatch_dashboard.main["static"]
}

# Route53 Records
moved {
  from = module.website.aws_route53_record.website
  to   = module.website.aws_route53_record.website["static"]
}

moved {
  from = module.website.aws_route53_record.www_website
  to   = module.website.aws_route53_record.www_website["static"]
}

moved {
  from = module.website.aws_s3_bucket_policy.cloudfront
  to   = module.website.aws_s3_bucket_policy.cloudfront["static"]
}

moved {
  from = module.website.module.cloudfront_5xx_error_rate_alarm
  to   = module.website.module.cloudfront_5xx_error_rate_alarm["static"]
}

moved {
  from = module.website.module.cloudfront_function_execution_errors_alarm
  to   = module.website.module.cloudfront_function_execution_errors_alarm["static"]
}

moved {
  from = module.website.module.cloudfront_function_throttled_alarm
  to   = module.website.module.cloudfront_function_throttled_alarm["static"]
}

moved {
  from = module.website.module.cloudfront_function_validation_errors_alarm
  to = module.website.module.cloudfront_function_validation_errors_alarm["static"]
}

moved {
  from = module.website.module.cloudfront_origin_latency_alarm
  to   = module.website.module.cloudfront_origin_latency_alarm["static"]
}