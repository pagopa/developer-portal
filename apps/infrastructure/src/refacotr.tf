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

moved {
  to   = module.chatbot[0].module.ecr["chatbot"]
  from = module.chatbot[0].module.ecr
}

moved {
  from = module.chatbot[0].aws_iam_policy.lambda_s3_bedrock_policy
  to   = module.chatbot[0].aws_iam_policy.lambda_s3_chatbot_policy
}

moved {
  from = module.chatbot[0].aws_iam_role_policy_attachment.lambda_s3_bedrock_policy_attachment
  to   = module.chatbot[0].aws_iam_role_policy_attachment.lambda_s3_chatbot_policy_attachment
}

moved {
  from = module.langfuse
  to   = module.langfuse[0]
}

locals {
  api_stages = {
    dev = {
      api_id     = "alhaa4pmf0"
      stage_name = "dev"
    }
    uat = {
      api_id     = "vy3s5vbpn8" # Replace with actual UAT API ID if different
      stage_name = "uat"
    }
    prod = {
      api_id     = "35z2b93836" # Replace with actual PROD API ID if different
      stage_name = "prod"
    }
  }
}

moved {
  from = module.chatbot[0].aws_sqs_queue.chatbot_evaluate_queue
  to   = module.chatbot[0].aws_sqs_queue.chatbot_queue["evaluate"]
}


moved {
  from = module.chatbot[0].aws_sqs_queue.chatbot_evaluate_queue_dlq
  to   = module.chatbot[0].aws_sqs_queue.chatbot_dlq["evaluate"]
}


import {
  to = module.chatbot[0].aws_api_gateway_stage.api_stage
  id = "${local.api_stages[var.environment].api_id}/${var.environment}"
}

removed {
  from = module.website.aws_s3_bucket.website
  lifecycle {
    destroy = false
  }
}