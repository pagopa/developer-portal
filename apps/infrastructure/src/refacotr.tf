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

# ============================================================================
# Cognito resources moved from module.website to module.auth
# ============================================================================

# Cognito User Pool
moved {
  from = module.website.aws_cognito_user_pool.devportal
  to   = module.auth.aws_cognito_user_pool.devportal
}

# Cognito User Pool Client
moved {
  from = module.website.aws_cognito_user_pool_client.devportal_website
  to   = module.auth.aws_cognito_user_pool_client.devportal_website
}

# Cognito User Pool Domain
moved {
  from = module.website.aws_cognito_user_pool_domain.devportal
  to   = module.auth.aws_cognito_user_pool_domain.devportal
}

# Cognito User Group
moved {
  from = module.website.aws_cognito_user_group.hosts
  to   = module.auth.aws_cognito_user_group.hosts
}

# Cognito Identity Pool
moved {
  from = module.website.aws_cognito_identity_pool.devportal
  to   = module.auth.aws_cognito_identity_pool.devportal
}

# Cognito Identity Pool Roles Attachment
moved {
  from = module.website.aws_cognito_identity_pool_roles_attachment.main
  to   = module.auth.aws_cognito_identity_pool_roles_attachment.main
}

# IAM Roles for authenticated users
moved {
  from = module.website.aws_iam_role.devportal_authenticated_user
  to   = module.auth.aws_iam_role.devportal_authenticated_user
}

moved {
  from = module.website.aws_iam_role.devportal_authenticated_host_user
  to   = module.auth.aws_iam_role.devportal_authenticated_host_user
}

# ACM Certificate for auth domain
moved {
  from = module.website.aws_acm_certificate.auth
  to   = module.auth.aws_acm_certificate.auth
}

# Route53 record for Cognito UI domain
moved {
  from = module.website.aws_route53_record.devportal_cognito_A
  to   = module.auth.aws_route53_record.devportal_cognito_A
}

# Cognito Lambda functions
moved {
  from = module.website.module.cognito_custom_message_function
  to   = module.auth.module.cognito_custom_message_function
}

moved {
  from = module.website.module.cognito_post_confirmation_function
  to   = module.auth.module.cognito_post_confirmation_function
}

moved {
  from = module.website.module.cognito_define_auth_challenge_function
  to   = module.auth.module.cognito_define_auth_challenge_function
}

moved {
  from = module.website.module.cognito_create_auth_challenge_function
  to   = module.auth.module.cognito_create_auth_challenge_function
}

moved {
  from = module.website.module.cognito_verify_auth_challenge_function
  to   = module.auth.module.cognito_verify_auth_challenge_function
}

moved {
  from = module.website.module.cognito_pre_sign_up_function
  to   = module.auth.module.cognito_pre_sign_up_function
}

# Cognito CloudWatch alarms
moved {
  from = module.website.module.cognito_user_pool_sign_up_throttles_alarm
  to   = module.auth.module.cognito_user_pool_sign_up_throttles_alarm
}

moved {
  from = module.website.module.cognito_user_pool_sign_in_throttles_alarm
  to   = module.auth.module.cognito_user_pool_sign_in_throttles_alarm
}

moved {
  from = module.website.module.cognito_user_pool_token_refresh_throttles_alarm
  to   = module.auth.module.cognito_user_pool_token_refresh_throttles_alarm
}

moved {
  from = module.website.module.cognito_custom_message_lambda_errors_alarm
  to   = module.auth.module.cognito_custom_message_lambda_errors_alarm
}

moved {
  from = module.website.module.cognito_custom_message_lambda_throttles_alarm
  to   = module.auth.module.cognito_custom_message_lambda_throttles_alarm
}

moved {
  from = module.website.module.cognito_custom_message_lambda_duration_alarm
  to   = module.auth.module.cognito_custom_message_lambda_duration_alarm
}

moved {
  from = module.website.module.cognito_custom_message_lambda_concurrent_executions_alarm
  to   = module.auth.module.cognito_custom_message_lambda_concurrent_executions_alarm
}

moved {
  from = module.website.module.cognito_post_confirmation_lambda_errors_alarm
  to   = module.auth.module.cognito_post_confirmation_lambda_errors_alarm
}

moved {
  from = module.website.module.cognito_post_confirmation_lambda_throttles_alarm
  to   = module.auth.module.cognito_post_confirmation_lambda_throttles_alarm
}

moved {
  from = module.website.module.cognito_post_confirmation_lambda_duration_alarm
  to   = module.auth.module.cognito_post_confirmation_lambda_duration_alarm
}

moved {
  from = module.website.module.cognito_post_confirmation_lambda_concurrent_executions_alarm
  to   = module.auth.module.cognito_post_confirmation_lambda_concurrent_executions_alarm
}

moved {
  from = module.website.module.cognito_define_auth_challenge_lambda_errors_alarm
  to   = module.auth.module.cognito_define_auth_challenge_lambda_errors_alarm
}

moved {
  from = module.website.module.cognito_define_auth_challenge_lambda_throttles_alarm
  to   = module.auth.module.cognito_define_auth_challenge_lambda_throttles_alarm
}

moved {
  from = module.website.module.cognito_define_auth_challenge_lambda_duration_alarm
  to   = module.auth.module.cognito_define_auth_challenge_lambda_duration_alarm
}

moved {
  from = module.website.module.cognito_define_auth_challenge_lambda_concurrent_executions_alarm
  to   = module.auth.module.cognito_define_auth_challenge_lambda_concurrent_executions_alarm
}

moved {
  from = module.website.module.cognito_create_auth_challenge_lambda_errors_alarm
  to   = module.auth.module.cognito_create_auth_challenge_lambda_errors_alarm
}

moved {
  from = module.website.module.cognito_create_auth_challenge_lambda_throttles_alarm
  to   = module.auth.module.cognito_create_auth_challenge_lambda_throttles_alarm
}

moved {
  from = module.website.module.cognito_create_auth_challenge_lambda_duration_alarm
  to   = module.auth.module.cognito_create_auth_challenge_lambda_duration_alarm
}

moved {
  from = module.website.module.cognito_create_auth_challenge_lambda_concurrent_executions_alarm
  to   = module.auth.module.cognito_create_auth_challenge_lambda_concurrent_executions_alarm
}

moved {
  from = module.website.module.cognito_verify_auth_challenge_lambda_errors_alarm
  to   = module.auth.module.cognito_verify_auth_challenge_lambda_errors_alarm
}

moved {
  from = module.website.module.cognito_verify_auth_challenge_lambda_throttles_alarm
  to   = module.auth.module.cognito_verify_auth_challenge_lambda_throttles_alarm
}

moved {
  from = module.website.module.cognito_verify_auth_challenge_lambda_duration_alarm
  to   = module.auth.module.cognito_verify_auth_challenge_lambda_duration_alarm
}

moved {
  from = module.website.module.cognito_verify_auth_challenge_lambda_concurrent_executions_alarm
  to   = module.auth.module.cognito_verify_auth_challenge_lambda_concurrent_executions_alarm
}

moved {
  from = module.website.module.cognito_pre_sign_up_lambda_concurrent_executions_alarm
  to   = module.auth.module.cognito_pre_sign_up_lambda_concurrent_executions_alarm
}

moved {
  from = module.website.aws_route53_record.certificate["auth.dev.developer.pagopa.it"]
  to   = module.auth.aws_route53_record.auth_certificate["auth.dev.developer.pagopa.it"]
}

moved {
  from = module.website.aws_sns_topic_subscription.cognito_alarms
  to   = module.auth.aws_sns_topic_subscription.cognito_alarms
}

moved {
  from = module.website.aws_sns_topic.cognito_alarms
  to   = module.auth.aws_sns_topic.cognito_alarms
}

moved {
  from = module.video_streaming.aws_cloudfront_distribution.s3_distribution
  to   = module.video_streaming.aws_cloudfront_distribution.vod
}