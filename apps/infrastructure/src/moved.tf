
moved {
  from = aws_acm_certificate.auth
  to   = module.website.aws_acm_certificate.auth
}

moved {
  from = aws_acm_certificate.website
  to   = module.website.aws_acm_certificate.website
}

moved {
  from = aws_cloudfront_distribution.website
  to   = module.website.aws_cloudfront_distribution.website
}

moved {
  from = aws_cloudfront_function.website_viewer_request_handler
  to   = module.website.aws_cloudfront_function.website_viewer_request_handler
}

moved {
  from = aws_cloudfront_origin_access_identity.main
  to   = module.website.aws_cloudfront_origin_access_identity.main
}

moved {
  from = aws_cloudfront_response_headers_policy.websites
  to   = module.website.aws_cloudfront_response_headers_policy.websites
}

moved {
  from = aws_cloudwatch_dashboard.main
  to   = module.website.aws_cloudwatch_dashboard.main
}

moved {
  from = aws_cognito_identity_pool.devportal
  to   = module.website.aws_cognito_identity_pool.devportal
}

moved {
  from = aws_cognito_identity_pool_roles_attachment.main
  to   = module.website.aws_cognito_identity_pool_roles_attachment.main
}

moved {
  from = aws_cognito_user_group.hosts
  to   = module.website.aws_cognito_user_group.hosts
}

moved {
  from = aws_cognito_user_pool.devportal
  to   = module.website.aws_cognito_user_pool.devportal
}

moved {
  from = aws_cognito_user_pool_client.devportal_website
  to   = module.website.aws_cognito_user_pool_client.devportal_website
}

moved {
  from = aws_cognito_user_pool_domain.devportal
  to   = module.website.aws_cognito_user_pool_domain.devportal
}

moved {
  from = aws_ecs_task_definition.cms_task_def
  to   = module.cms.aws_ecs_task_definition.cms_task_def
}

moved {
  from = aws_iam_group.developers_read_only
  to   = module.core.aws_iam_group.developers_read_only
}

moved {
  from = aws_iam_group_membership.dgs
  to   = module.core.aws_iam_group_membership.dgs
}

moved {
  from = aws_iam_group_policy_attachment.read_only
  to   = module.core.aws_iam_group_policy_attachment.read_only
}

moved {
  from = aws_iam_policy.deploy_cms
  to   = module.cms.aws_iam_policy.deploy_cms
}

moved {
  from = aws_iam_policy.deploy_website
  to   = module.website.aws_iam_policy.deploy_website
}

moved {
  from = aws_iam_role.deploy_cms
  to   = module.cms.aws_iam_role.deploy_cms
}

moved {
  from = aws_iam_role.deploy_website
  to   = module.website.aws_iam_role.deploy_website
}

moved {
  from = aws_iam_role.devportal_authenticated_host_user
  to   = module.website.aws_iam_role.devportal_authenticated_host_user
}

moved {
  from = aws_iam_role.devportal_authenticated_user
  to   = module.website.aws_iam_role.devportal_authenticated_user
}

moved {
  from = aws_iam_role_policy.devportal_authenticated_host_user
  to   = module.website.aws_iam_role_policy.devportal_authenticated_host_user
}

moved {
  from = aws_iam_role_policy.devportal_authenticated_user
  to   = module.website.aws_iam_role_policy.devportal_authenticated_user
}

moved {
  from = aws_iam_role_policy_attachment.deploy_cms
  to   = module.cms.aws_iam_role_policy_attachment.deploy_cms
}

moved {
  from = aws_iam_role_policy_attachment.deploy_website
  to   = module.website.aws_iam_role_policy_attachment.deploy_website
}

moved {
  from = aws_iam_user.mauro_dandrea
  to   = module.core.aws_iam_user.mauro_dandrea
}

moved {
  from = aws_iam_user_policy_attachment.change_password
  to   = module.core.aws_iam_user_policy_attachment.change_password
}

moved {
  from = aws_route53_record.certificate["auth.dev.developer.pagopa.it"]
  to   = module.website.aws_route53_record.certificate["auth.dev.developer.pagopa.it"]
}

moved {
  from = aws_route53_record.certificate["dev.developer.pagopa.it"]
  to   = module.website.aws_route53_record.certificate["dev.developer.pagopa.it"]
}

moved {
  from = aws_route53_record.certificate["www.dev.developer.pagopa.it"]
  to   = module.website.aws_route53_record.certificate["www.dev.developer.pagopa.it"]
}

moved {
  from = aws_route53_record.certificate["auth.developer.pagopa.it"]
  to   = module.website.aws_route53_record.certificate["auth.developer.pagopa.it"]
}

moved {
  from = aws_route53_record.certificate["developer.pagopa.it"]
  to   = module.website.aws_route53_record.certificate["developer.pagopa.it"]
}

moved {
  from = aws_route53_record.certificate["www.developer.pagopa.it"]
  to   = module.website.aws_route53_record.certificate["www.developer.pagopa.it"]
}

moved {
  from = aws_route53_record.devportal_cognito_A
  to   = module.website.aws_route53_record.devportal_cognito_A
}

moved {
  from = aws_route53_record.devportal_ses_dkim_cname[0]
  to   = module.core.aws_route53_record.devportal_ses_dkim_cname[0]
}

moved {
  from = aws_route53_record.devportal_ses_dkim_cname[1]
  to   = module.core.aws_route53_record.devportal_ses_dkim_cname[1]
}

moved {
  from = aws_route53_record.devportal_ses_dkim_cname[2]
  to   = module.core.aws_route53_record.devportal_ses_dkim_cname[2]
}

moved {
  from = aws_route53_record.devportal_ses_dkim_txt
  to   = module.core.aws_route53_record.devportal_ses_dkim_txt
}

moved {
  from = aws_route53_record.strapi_media_library
  to   = module.cms.aws_route53_record.strapi_media_library
}

moved {
  from = aws_route53_record.website
  to   = module.website.aws_route53_record.website
}

moved {
  from = aws_route53_record.www_website
  to   = module.website.aws_route53_record.www_website
}

moved {
  from = aws_route53_zone.dev_portal
  to   = module.core.aws_route53_zone.dev_portal
}

moved {
  from = aws_s3_bucket.website
  to   = module.website.aws_s3_bucket.website
}

moved {
  from = aws_s3_bucket_lifecycle_configuration.website
  to   = module.website.aws_s3_bucket_lifecycle_configuration.website
}

moved {
  from = aws_s3_bucket_policy.cloudfront
  to   = module.website.aws_s3_bucket_policy.cloudfront
}

moved {
  from = aws_s3_bucket_public_access_block.website
  to   = module.website.aws_s3_bucket_public_access_block.website
}

moved {
  from = aws_s3_bucket_versioning.website
  to   = module.website.aws_s3_bucket_versioning.website
}

moved {
  from = aws_security_group.cms_database
  to   = module.cms.aws_security_group.cms_database
}

moved {
  from = aws_security_group.cms_lb
  to   = module.cms.aws_security_group.cms_lb
}

moved {
  from = aws_security_group.ecs_tasks
  to   = module.cms.aws_security_group.ecs_tasks
}

moved {
  from = aws_sns_topic.metric_alarm
  to   = module.website.aws_sns_topic.metric_alarm
}

moved {
  from = aws_sns_topic_subscription.metric_alarm
  to   = module.website.aws_sns_topic_subscription.metric_alarm
}

moved {
  from = random_integer.bucket_random_integer
  to   = module.cms.random_integer.bucket_random_integer
}

moved {
  from = random_integer.website_bucket_random_integer
  to   = module.website.random_integer.website_bucket_random_integer
}

moved {
  from = random_password.cms_admin_jwt_secret
  to   = module.cms.random_password.cms_admin_jwt_secret
}

moved {
  from = random_password.cms_api_token_salt
  to   = module.cms.random_password.cms_api_token_salt
}

moved {
  from = random_password.cms_app_keys
  to   = module.cms.random_password.cms_app_keys
}

moved {
  from = random_password.cms_database_password
  to   = module.cms.random_password.cms_database_password
}

moved {
  from = random_password.cms_github_pat
  to   = module.cms.random_password.cms_github_pat
}

moved {
  from = random_password.cms_jwt_secret
  to   = module.cms.random_password.cms_jwt_secret
}

moved {
  from = random_password.cms_transfer_token_salt
  to   = module.cms.random_password.cms_transfer_token_salt
}

moved {
  from = module.cloudfront_5xx_error_rate_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cloudfront_5xx_error_rate_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cloudfront_cms.aws_cloudfront_distribution.this[0]
  to   = module.cms.module.cloudfront_cms.aws_cloudfront_distribution.this[0]
}

moved {
  from = module.cloudfront_cms.aws_cloudfront_origin_access_identity.this["s3_cms"]
  to   = module.cms.module.cloudfront_cms.aws_cloudfront_origin_access_identity.this["s3_cms"]
}

moved {
  from = module.cloudfront_function_execution_errors_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cloudfront_function_execution_errors_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cloudfront_function_throttled_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cloudfront_function_throttled_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cloudfront_function_validation_errors_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cloudfront_function_validation_errors_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cloudfront_origin_latency_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cloudfront_origin_latency_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cms_ecs_cluster.aws_cloudwatch_log_group.this[0]
  to   = module.cms.module.cms_ecs_cluster.aws_cloudwatch_log_group.this[0]
}

moved {
  from = module.cms_ecs_cluster.aws_ecs_cluster.this[0]
  to   = module.cms.module.cms_ecs_cluster.aws_ecs_cluster.this[0]
}

moved {
  from = module.cms_ecs_service.aws_appautoscaling_policy.this["cpu"]
  to   = module.cms.module.cms_ecs_service.aws_appautoscaling_policy.this["cpu"]
}

moved {
  from = module.cms_ecs_service.aws_appautoscaling_policy.this["memory"]
  to   = module.cms.module.cms_ecs_service.aws_appautoscaling_policy.this["memory"]
}

moved {
  from = module.cms_ecs_service.aws_appautoscaling_target.this[0]
  to   = module.cms.module.cms_ecs_service.aws_appautoscaling_target.this[0]
}

moved {
  from = module.cms_ecs_service.aws_ecs_service.ignore_task_definition[0]
  to   = module.cms.module.cms_ecs_service.aws_ecs_service.ignore_task_definition[0]
}

moved {
  from = module.cms_load_balancer.aws_lb.this[0]
  to   = module.cms.module.cms_load_balancer.aws_lb.this[0]
}

moved {
  from = module.cms_load_balancer.aws_lb_listener.this["front_end_http"]
  to   = module.cms.module.cms_load_balancer.aws_lb_listener.this["front_end_http"]
}

moved {
  from = module.cms_load_balancer.aws_lb_listener.this["front_end_https"]
  to   = module.cms.module.cms_load_balancer.aws_lb_listener.this["front_end_https"]
}

moved {
  from = module.cms_load_balancer.aws_lb_target_group.this["cms-target-group"]
  to   = module.cms.module.cms_load_balancer.aws_lb_target_group.this["cms-target-group"]
}

moved {
  from = module.cms_log_group.aws_cloudwatch_log_group.this[0]
  to   = module.cms.module.cms_log_group.aws_cloudwatch_log_group.this[0]
}

moved {
  from = module.cms_rds.aws_rds_cluster.this[0]
  to   = module.cms.module.cms_rds.aws_rds_cluster.this[0]
}

moved {
  from = module.cms_rds.aws_rds_cluster_instance.this["one"]
  to   = module.cms.module.cms_rds.aws_rds_cluster_instance.this["one"]
}

moved {
  from = module.cms_rds.aws_security_group.this[0]
  to   = module.cms.module.cms_rds.aws_security_group.this[0]
}

moved {
  from = module.cms_ssl_certificate.aws_acm_certificate.this[0]
  to   = module.cms.module.cms_ssl_certificate.aws_acm_certificate.this[0]
}

moved {
  from = module.cms_ssl_certificate.aws_route53_record.validation[0]
  to   = module.cms.module.cms_ssl_certificate.aws_route53_record.validation[0]
}

moved {
  from = module.cms_ssl_certificate.aws_route53_record.validation[1]
  to   = module.cms.module.cms_ssl_certificate.aws_route53_record.validation[1]
}

moved {
  from = module.cognito_create_auth_challenge_function.aws_cloudwatch_log_group.lambda[0]
  to   = module.website.module.cognito_create_auth_challenge_function.aws_cloudwatch_log_group.lambda[0]
}

moved {
  from = module.cognito_create_auth_challenge_function.aws_iam_policy.additional_inline[0]
  to   = module.website.module.cognito_create_auth_challenge_function.aws_iam_policy.additional_inline[0]
}

moved {
  from = module.cognito_create_auth_challenge_function.aws_iam_policy.logs[0]
  to   = module.website.module.cognito_create_auth_challenge_function.aws_iam_policy.logs[0]
}

moved {
  from = module.cognito_create_auth_challenge_function.aws_iam_role.lambda[0]
  to   = module.website.module.cognito_create_auth_challenge_function.aws_iam_role.lambda[0]
}

moved {
  from = module.cognito_create_auth_challenge_function.aws_iam_role_policy_attachment.additional_inline[0]
  to   = module.website.module.cognito_create_auth_challenge_function.aws_iam_role_policy_attachment.additional_inline[0]
}

moved {
  from = module.cognito_create_auth_challenge_function.aws_iam_role_policy_attachment.logs[0]
  to   = module.website.module.cognito_create_auth_challenge_function.aws_iam_role_policy_attachment.logs[0]
}

moved {
  from = module.cognito_create_auth_challenge_function.aws_lambda_function.this[0]
  to   = module.website.module.cognito_create_auth_challenge_function.aws_lambda_function.this[0]
}

moved {
  from = module.cognito_create_auth_challenge_function.aws_lambda_permission.unqualified_alias_triggers["cognito_devportal"]
  to   = module.website.module.cognito_create_auth_challenge_function.aws_lambda_permission.unqualified_alias_triggers["cognito_devportal"]
}

moved {
  from = module.cognito_create_auth_challenge_lambda_concurrent_executions_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_create_auth_challenge_lambda_concurrent_executions_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cognito_create_auth_challenge_lambda_duration_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_create_auth_challenge_lambda_duration_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cognito_create_auth_challenge_lambda_errors_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_create_auth_challenge_lambda_errors_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cognito_create_auth_challenge_lambda_throttles_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_create_auth_challenge_lambda_throttles_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cognito_custom_message_function.aws_cloudwatch_log_group.lambda[0]
  to   = module.website.module.cognito_custom_message_function.aws_cloudwatch_log_group.lambda[0]
}

moved {
  from = module.cognito_custom_message_function.aws_iam_policy.logs[0]
  to   = module.website.module.cognito_custom_message_function.aws_iam_policy.logs[0]
}

moved {
  from = module.cognito_custom_message_function.aws_iam_role.lambda[0]
  to   = module.website.module.cognito_custom_message_function.aws_iam_role.lambda[0]
}

moved {
  from = module.cognito_custom_message_function.aws_iam_role_policy_attachment.logs[0]
  to   = module.website.module.cognito_custom_message_function.aws_iam_role_policy_attachment.logs[0]
}

moved {
  from = module.cognito_custom_message_function.aws_lambda_function.this[0]
  to   = module.website.module.cognito_custom_message_function.aws_lambda_function.this[0]
}

moved {
  from = module.cognito_custom_message_function.aws_lambda_permission.unqualified_alias_triggers["cognito_devportal"]
  to   = module.website.module.cognito_custom_message_function.aws_lambda_permission.unqualified_alias_triggers["cognito_devportal"]
}

moved {
  from = module.cognito_custom_message_lambda_concurrent_executions_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_custom_message_lambda_concurrent_executions_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cognito_custom_message_lambda_duration_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_custom_message_lambda_duration_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cognito_custom_message_lambda_errors_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_custom_message_lambda_errors_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cognito_custom_message_lambda_throttles_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_custom_message_lambda_throttles_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cognito_define_auth_challenge_function.aws_cloudwatch_log_group.lambda[0]
  to   = module.website.module.cognito_define_auth_challenge_function.aws_cloudwatch_log_group.lambda[0]
}

moved {
  from = module.cognito_define_auth_challenge_function.aws_iam_policy.logs[0]
  to   = module.website.module.cognito_define_auth_challenge_function.aws_iam_policy.logs[0]
}

moved {
  from = module.cognito_define_auth_challenge_function.aws_iam_role.lambda[0]
  to   = module.website.module.cognito_define_auth_challenge_function.aws_iam_role.lambda[0]
}

moved {
  from = module.cognito_define_auth_challenge_function.aws_iam_role_policy_attachment.logs[0]
  to   = module.website.module.cognito_define_auth_challenge_function.aws_iam_role_policy_attachment.logs[0]
}

moved {
  from = module.cognito_define_auth_challenge_function.aws_lambda_function.this[0]
  to   = module.website.module.cognito_define_auth_challenge_function.aws_lambda_function.this[0]
}

moved {
  from = module.cognito_define_auth_challenge_function.aws_lambda_permission.unqualified_alias_triggers["cognito_devportal"]
  to   = module.website.module.cognito_define_auth_challenge_function.aws_lambda_permission.unqualified_alias_triggers["cognito_devportal"]
}

moved {
  from = module.cognito_define_auth_challenge_lambda_concurrent_executions_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_define_auth_challenge_lambda_concurrent_executions_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cognito_define_auth_challenge_lambda_duration_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_define_auth_challenge_lambda_duration_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cognito_define_auth_challenge_lambda_errors_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_define_auth_challenge_lambda_errors_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cognito_define_auth_challenge_lambda_throttles_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_define_auth_challenge_lambda_throttles_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cognito_post_confirmation_function.aws_cloudwatch_log_group.lambda[0]
  to   = module.website.module.cognito_post_confirmation_function.aws_cloudwatch_log_group.lambda[0]
}

moved {
  from = module.cognito_post_confirmation_function.aws_iam_policy.additional_inline[0]
  to   = module.website.module.cognito_post_confirmation_function.aws_iam_policy.additional_inline[0]
}

moved {
  from = module.cognito_post_confirmation_function.aws_iam_policy.logs[0]
  to   = module.website.module.cognito_post_confirmation_function.aws_iam_policy.logs[0]
}

moved {
  from = module.cognito_post_confirmation_function.aws_iam_role.lambda[0]
  to   = module.website.module.cognito_post_confirmation_function.aws_iam_role.lambda[0]
}

moved {
  from = module.cognito_post_confirmation_function.aws_iam_role_policy_attachment.additional_inline[0]
  to   = module.website.module.cognito_post_confirmation_function.aws_iam_role_policy_attachment.additional_inline[0]
}

moved {
  from = module.cognito_post_confirmation_function.aws_iam_role_policy_attachment.logs[0]
  to   = module.website.module.cognito_post_confirmation_function.aws_iam_role_policy_attachment.logs[0]
}

moved {
  from = module.cognito_post_confirmation_function.aws_lambda_function.this[0]
  to   = module.website.module.cognito_post_confirmation_function.aws_lambda_function.this[0]
}

moved {
  from = module.cognito_post_confirmation_function.aws_lambda_permission.unqualified_alias_triggers["cognito_devportal"]
  to   = module.website.module.cognito_post_confirmation_function.aws_lambda_permission.unqualified_alias_triggers["cognito_devportal"]
}

moved {
  from = module.cognito_post_confirmation_lambda_concurrent_executions_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_post_confirmation_lambda_concurrent_executions_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cognito_post_confirmation_lambda_duration_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_post_confirmation_lambda_duration_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cognito_post_confirmation_lambda_errors_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_post_confirmation_lambda_errors_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cognito_post_confirmation_lambda_throttles_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_post_confirmation_lambda_throttles_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cognito_user_pool_sign_in_throttles_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_user_pool_sign_in_throttles_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cognito_user_pool_sign_up_throttles_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_user_pool_sign_up_throttles_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cognito_user_pool_token_refresh_throttles_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_user_pool_token_refresh_throttles_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cognito_verify_auth_challenge_function.aws_cloudwatch_log_group.lambda[0]
  to   = module.website.module.cognito_verify_auth_challenge_function.aws_cloudwatch_log_group.lambda[0]
}

moved {
  from = module.cognito_verify_auth_challenge_function.aws_iam_policy.logs[0]
  to   = module.website.module.cognito_verify_auth_challenge_function.aws_iam_policy.logs[0]
}

moved {
  from = module.cognito_verify_auth_challenge_function.aws_iam_role.lambda[0]
  to   = module.website.module.cognito_verify_auth_challenge_function.aws_iam_role.lambda[0]
}

moved {
  from = module.cognito_verify_auth_challenge_function.aws_iam_role_policy_attachment.logs[0]
  to   = module.website.module.cognito_verify_auth_challenge_function.aws_iam_role_policy_attachment.logs[0]
}

moved {
  from = module.cognito_verify_auth_challenge_function.aws_lambda_function.this[0]
  to   = module.website.module.cognito_verify_auth_challenge_function.aws_lambda_function.this[0]
}

moved {
  from = module.cognito_verify_auth_challenge_function.aws_lambda_permission.unqualified_alias_triggers["cognito_devportal"]
  to   = module.website.module.cognito_verify_auth_challenge_function.aws_lambda_permission.unqualified_alias_triggers["cognito_devportal"]
}

moved {
  from = module.cognito_verify_auth_challenge_lambda_concurrent_executions_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_verify_auth_challenge_lambda_concurrent_executions_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cognito_verify_auth_challenge_lambda_duration_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_verify_auth_challenge_lambda_duration_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cognito_verify_auth_challenge_lambda_errors_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_verify_auth_challenge_lambda_errors_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.cognito_verify_auth_challenge_lambda_throttles_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.cognito_verify_auth_challenge_lambda_throttles_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.dynamodb_read_capacity_utilization_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.dynamodb_read_capacity_utilization_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.dynamodb_read_throttle_events_webinar_questions_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.dynamodb_read_throttle_events_webinar_questions_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.dynamodb_successful_request_latency_put_item_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.dynamodb_successful_request_latency_put_item_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.dynamodb_successful_request_latency_query_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.dynamodb_successful_request_latency_query_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.dynamodb_system_errors_webinar_questions_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.dynamodb_system_errors_webinar_questions_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.dynamodb_user_errors_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.dynamodb_user_errors_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.dynamodb_webinar_questions.aws_dynamodb_table.this[0]
  to   = module.website.module.dynamodb_webinar_questions.aws_dynamodb_table.this[0]
}

moved {
  from = module.dynamodb_webinar_subscriptions.aws_dynamodb_table.this[0]
  to   = module.website.module.dynamodb_webinar_subscriptions.aws_dynamodb_table.this[0]
}

moved {
  from = module.dynamodb_write_capacity_utilization_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.dynamodb_write_capacity_utilization_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.dynamodb_write_throttle_events_webinar_questions_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.dynamodb_write_throttle_events_webinar_questions_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.ecr.aws_ecr_lifecycle_policy.this[0]
  to   = module.cms.module.ecr.aws_ecr_lifecycle_policy.this[0]
}

moved {
  from = module.ecr.aws_ecr_repository.this[0]
  to   = module.cms.module.ecr.aws_ecr_repository.this[0]
}

moved {
  from = module.ecr.aws_ecr_repository_policy.this[0]
  to   = module.cms.module.ecr.aws_ecr_repository_policy.this[0]
}

moved {
  from = module.iam_policy_cms.aws_iam_policy.policy[0]
  to   = module.cms.module.iam_policy_cms.aws_iam_policy.policy[0]
}

moved {
  from = module.iam_policy_ecs_task_execution.aws_iam_policy.policy[0]
  to   = module.cms.module.iam_policy_ecs_task_execution.aws_iam_policy.policy[0]
}

moved {
  from = module.iam_policy_ecs_task_role_s3.aws_iam_policy.policy[0]
  to   = module.cms.module.iam_policy_ecs_task_role_s3.aws_iam_policy.policy[0]
}

moved {
  from = module.iam_role_ecs_task_execution.aws_iam_role.this[0]
  to   = module.cms.module.iam_role_ecs_task_execution.aws_iam_role.this[0]
}

moved {
  from = module.iam_role_ecs_task_execution.aws_iam_role_policy_attachment.custom[0]
  to   = module.cms.module.iam_role_ecs_task_execution.aws_iam_role_policy_attachment.custom[0]
}

moved {
  from = module.iam_role_ecs_task_execution.aws_iam_role_policy_attachment.custom[1]
  to   = module.cms.module.iam_role_ecs_task_execution.aws_iam_role_policy_attachment.custom[1]
}

moved {
  from = module.iam_role_ecs_task_execution.aws_iam_role_policy_attachment.custom[2]
  to   = module.cms.module.iam_role_ecs_task_execution.aws_iam_role_policy_attachment.custom[2]
}

moved {
  from = module.iam_role_task_role.aws_iam_role.this[0]
  to   = module.cms.module.iam_role_task_role.aws_iam_role.this[0]
}

moved {
  from = module.iam_role_task_role.aws_iam_role_policy_attachment.custom[0]
  to   = module.cms.module.iam_role_task_role.aws_iam_role_policy_attachment.custom[0]
}

moved {
  from = module.iam_role_task_role.aws_iam_role_policy_attachment.custom[1]
  to   = module.cms.module.iam_role_task_role.aws_iam_role_policy_attachment.custom[1]
}

moved {
  from = module.iam_user_cms.aws_iam_access_key.this_no_pgp[0]
  to   = module.cms.module.iam_user_cms.aws_iam_access_key.this_no_pgp[0]
}

moved {
  from = module.iam_user_cms.aws_iam_user.this[0]
  to   = module.cms.module.iam_user_cms.aws_iam_user.this[0]
}

moved {
  from = module.iam_user_cms.aws_iam_user_policy_attachment.this["0"]
  to   = module.cms.module.iam_user_cms.aws_iam_user_policy_attachment.this["0"]
}

moved {
  from = module.s3_bucket_cms.aws_s3_bucket.this[0]
  to   = module.cms.module.s3_bucket_cms.aws_s3_bucket.this[0]
}

moved {
  from = module.s3_bucket_cms.aws_s3_bucket_policy.this[0]
  to   = module.cms.module.s3_bucket_cms.aws_s3_bucket_policy.this[0]
}

moved {
  from = module.s3_bucket_cms.aws_s3_bucket_public_access_block.this[0]
  to   = module.cms.module.s3_bucket_cms.aws_s3_bucket_public_access_block.this[0]
}

moved {
  from = module.s3_bucket_cms.aws_s3_bucket_versioning.this[0]
  to   = module.cms.module.s3_bucket_cms.aws_s3_bucket_versioning.this[0]
}

moved {
  from = module.secret_cms_access_key_id.aws_ssm_parameter.this[0]
  to   = module.cms.module.secret_cms_access_key_id.aws_ssm_parameter.this[0]
}

moved {
  from = module.secret_cms_access_key_secret.aws_ssm_parameter.this[0]
  to   = module.cms.module.secret_cms_access_key_secret.aws_ssm_parameter.this[0]
}

moved {
  from = module.secret_cms_admin_jwt_secret.aws_ssm_parameter.this[0]
  to   = module.cms.module.secret_cms_admin_jwt_secret.aws_ssm_parameter.this[0]
}

moved {
  from = module.secret_cms_api_token_salt.aws_ssm_parameter.this[0]
  to   = module.cms.module.secret_cms_api_token_salt.aws_ssm_parameter.this[0]
}

moved {
  from = module.secret_cms_app_keys.aws_ssm_parameter.this[0]
  to   = module.cms.module.secret_cms_app_keys.aws_ssm_parameter.this[0]
}

moved {
  from = module.secret_cms_database_password.aws_ssm_parameter.this[0]
  to   = module.cms.module.secret_cms_database_password.aws_ssm_parameter.this[0]
}

moved {
  from = module.secret_cms_github_pat.aws_ssm_parameter.ignore_value[0]
  to   = module.cms.module.secret_cms_github_pat.aws_ssm_parameter.ignore_value[0]
}

moved {
  from = module.secret_cms_google_gsuite_hd.aws_ssm_parameter.ignore_value[0]
  to   = module.cms.module.secret_cms_google_gsuite_hd.aws_ssm_parameter.ignore_value[0]
}

moved {
  from = module.secret_cms_google_oauth_client_id.aws_ssm_parameter.ignore_value[0]
  to   = module.cms.module.secret_cms_google_oauth_client_id.aws_ssm_parameter.ignore_value[0]
}

moved {
  from = module.secret_cms_google_oauth_client_secret.aws_ssm_parameter.ignore_value[0]
  to   = module.cms.module.secret_cms_google_oauth_client_secret.aws_ssm_parameter.ignore_value[0]
}

moved {
  from = module.secret_cms_jwt_secret.aws_ssm_parameter.this[0]
  to   = module.cms.module.secret_cms_jwt_secret.aws_ssm_parameter.this[0]
}

moved {
  from = module.secret_cms_transfer_token_salt.aws_ssm_parameter.this[0]
  to   = module.cms.module.secret_cms_transfer_token_salt.aws_ssm_parameter.this[0]
}

moved {
  from = module.ses_bounce_rate_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.ses_bounce_rate_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.ses_daily_sending_quota_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.ses_daily_sending_quota_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.ses_developer_pagopa_it.aws_iam_access_key.ses_user[0]
  to   = module.core.module.ses_developer_pagopa_it.aws_iam_access_key.ses_user[0]
}

moved {
  from = module.ses_developer_pagopa_it.aws_iam_group.ses_users[0]
  to   = module.core.module.ses_developer_pagopa_it.aws_iam_group.ses_users[0]
}

moved {
  from = module.ses_developer_pagopa_it.aws_iam_group_membership.ses_group[0]
  to   = module.core.module.ses_developer_pagopa_it.aws_iam_group_membership.ses_group[0]
}

moved {
  from = module.ses_developer_pagopa_it.aws_iam_group_policy.ses_group_policy[0]
  to   = module.core.module.ses_developer_pagopa_it.aws_iam_group_policy.ses_group_policy[0]
}

moved {
  from = module.ses_developer_pagopa_it.aws_iam_user.ses_user[0]
  to   = module.core.module.ses_developer_pagopa_it.aws_iam_user.ses_user[0]
}

moved {
  from = module.ses_developer_pagopa_it.aws_ses_domain_dkim.this[0]
  to   = module.core.module.ses_developer_pagopa_it.aws_ses_domain_dkim.this[0]
}

moved {
  from = module.ses_developer_pagopa_it.aws_ses_domain_identity.this
  to   = module.core.module.ses_developer_pagopa_it.aws_ses_domain_identity.this
}

moved {
  from = module.ses_reputation_complaint_rate_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.ses_reputation_complaint_rate_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.ses_sending_rate_limit_alarm.aws_cloudwatch_metric_alarm.this[0]
  to   = module.website.module.ses_sending_rate_limit_alarm.aws_cloudwatch_metric_alarm.this[0]
}

moved {
  from = module.strapi_media_library_ssl_certificate.aws_acm_certificate.this[0]
  to   = module.cms.module.strapi_media_library_ssl_certificate.aws_acm_certificate.this[0]
}

moved {
  from = module.strapi_media_library_ssl_certificate.aws_route53_record.validation[0]
  to   = module.cms.module.strapi_media_library_ssl_certificate.aws_route53_record.validation[0]
}

moved {
  from = module.vpc.aws_db_subnet_group.database[0]
  to   = module.cms.module.vpc.aws_db_subnet_group.database[0]
}

moved {
  from = module.vpc.aws_default_network_acl.this[0]
  to   = module.cms.module.vpc.aws_default_network_acl.this[0]
}

moved {
  from = module.vpc.aws_default_route_table.default[0]
  to   = module.cms.module.vpc.aws_default_route_table.default[0]
}

moved {
  from = module.vpc.aws_default_security_group.this[0]
  to   = module.cms.module.vpc.aws_default_security_group.this[0]
}

moved {
  from = module.vpc.aws_eip.nat[0]
  to   = module.cms.module.vpc.aws_eip.nat[0]
}

moved {
  from = module.vpc.aws_internet_gateway.this[0]
  to   = module.cms.module.vpc.aws_internet_gateway.this[0]
}

moved {
  from = module.vpc.aws_nat_gateway.this[0]
  to   = module.cms.module.vpc.aws_nat_gateway.this[0]
}

moved {
  from = module.vpc.aws_network_acl.public[0]
  to   = module.cms.module.vpc.aws_network_acl.public[0]
}

moved {
  from = module.vpc.aws_network_acl_rule.public_inbound[0]
  to   = module.cms.module.vpc.aws_network_acl_rule.public_inbound[0]
}

moved {
  from = module.vpc.aws_network_acl_rule.public_outbound[0]
  to   = module.cms.module.vpc.aws_network_acl_rule.public_outbound[0]
}

moved {
  from = module.vpc.aws_route.private_nat_gateway[0]
  to   = module.cms.module.vpc.aws_route.private_nat_gateway[0]
}

moved {
  from = module.vpc.aws_route.public_internet_gateway[0]
  to   = module.cms.module.vpc.aws_route.public_internet_gateway[0]
}

moved {
  from = module.vpc.aws_route_table.private[0]
  to   = module.cms.module.vpc.aws_route_table.private[0]
}

moved {
  from = module.vpc.aws_route_table.public[0]
  to   = module.cms.module.vpc.aws_route_table.public[0]
}

moved {
  from = module.vpc.aws_route_table_association.database[0]
  to   = module.cms.module.vpc.aws_route_table_association.database[0]
}

moved {
  from = module.vpc.aws_route_table_association.database[1]
  to   = module.cms.module.vpc.aws_route_table_association.database[1]
}

moved {
  from = module.vpc.aws_route_table_association.database[2]
  to   = module.cms.module.vpc.aws_route_table_association.database[2]
}

moved {
  from = module.vpc.aws_route_table_association.private[0]
  to   = module.cms.module.vpc.aws_route_table_association.private[0]
}

moved {
  from = module.vpc.aws_route_table_association.private[1]
  to   = module.cms.module.vpc.aws_route_table_association.private[1]
}

moved {
  from = module.vpc.aws_route_table_association.private[2]
  to   = module.cms.module.vpc.aws_route_table_association.private[2]
}

moved {
  from = module.vpc.aws_route_table_association.public[0]
  to   = module.cms.module.vpc.aws_route_table_association.public[0]
}

moved {
  from = module.vpc.aws_route_table_association.public[1]
  to   = module.cms.module.vpc.aws_route_table_association.public[1]
}

moved {
  from = module.vpc.aws_route_table_association.public[2]
  to   = module.cms.module.vpc.aws_route_table_association.public[2]
}

moved {
  from = module.vpc.aws_subnet.database[0]
  to   = module.cms.module.vpc.aws_subnet.database[0]
}

moved {
  from = module.vpc.aws_subnet.database[1]
  to   = module.cms.module.vpc.aws_subnet.database[1]
}

moved {
  from = module.vpc.aws_subnet.database[2]
  to   = module.cms.module.vpc.aws_subnet.database[2]
}

moved {
  from = module.vpc.aws_subnet.private[0]
  to   = module.cms.module.vpc.aws_subnet.private[0]
}

moved {
  from = module.vpc.aws_subnet.private[1]
  to   = module.cms.module.vpc.aws_subnet.private[1]
}

moved {
  from = module.vpc.aws_subnet.private[2]
  to   = module.cms.module.vpc.aws_subnet.private[2]
}

moved {
  from = module.vpc.aws_subnet.public[0]
  to   = module.cms.module.vpc.aws_subnet.public[0]
}

moved {
  from = module.vpc.aws_subnet.public[1]
  to   = module.cms.module.vpc.aws_subnet.public[1]
}

moved {
  from = module.vpc.aws_subnet.public[2]
  to   = module.cms.module.vpc.aws_subnet.public[2]
}

moved {
  from = module.vpc.aws_vpc.this[0]
  to   = module.cms.module.vpc.aws_vpc.this[0]
}

moved {
  from = aws_route53_record.certificate
  to   = module.cms.aws_route53_record.certificate
}

moved {
  from = module.cms_dns_records.aws_route53_record.this
  to   = module.cms.module.cms_dns_records.aws_route53_record.this
}

moved {
  from = aws_route53_record.devportal_delegate
  to   = module.core.aws_route53_record.devportal_delegate
}

moved {
  from = aws_route53_record.devportal_google_site_verification_txt
  to   = module.core.aws_route53_record.devportal_google_site_verification_txt
}

moved {
  from = module.active_campaign_dns_records.aws_route53_record.this
  to   = module.core.module.active_campaign_dns_records.aws_route53_record.this
}