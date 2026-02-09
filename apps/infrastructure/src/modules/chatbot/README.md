## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 5.33.0 |
| <a name="requirement_awscc"></a> [awscc](#requirement\_awscc) | 1.10.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 5.33.0 |
| <a name="provider_random"></a> [random](#provider\_random) | n/a |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_dynamodb_chatbot_queries"></a> [dynamodb\_chatbot\_queries](#module\_dynamodb\_chatbot\_queries) | git::github.com/terraform-aws-modules/terraform-aws-dynamodb-table.git | 715399dbe24f6443820bf5de80f6100b35d56355 |
| <a name="module_dynamodb_chatbot_salts"></a> [dynamodb\_chatbot\_salts](#module\_dynamodb\_chatbot\_salts) | git::github.com/terraform-aws-modules/terraform-aws-dynamodb-table.git | 715399dbe24f6443820bf5de80f6100b35d56355 |
| <a name="module_dynamodb_chatbot_sessions"></a> [dynamodb\_chatbot\_sessions](#module\_dynamodb\_chatbot\_sessions) | git::github.com/terraform-aws-modules/terraform-aws-dynamodb-table.git | 715399dbe24f6443820bf5de80f6100b35d56355 |
| <a name="module_ecr"></a> [ecr](#module\_ecr) | git::https://github.com/terraform-aws-modules/terraform-aws-ecr.git | 9f4b587846551110b0db199ea5599f016570fefe |
| <a name="module_ecs_cluster"></a> [ecs\_cluster](#module\_ecs\_cluster) | git::https://github.com/terraform-aws-modules/terraform-aws-ecs.git//modules/cluster | 8b97783def49997d18a6fcb00dc21ce1edc0f538 |
| <a name="module_ecs_log_group"></a> [ecs\_log\_group](#module\_ecs\_log\_group) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/log-group | bf969da953bdbea229392255d2b36e7b720e917e |
| <a name="module_ecs_monitoring_task_iam_role"></a> [ecs\_monitoring\_task\_iam\_role](#module\_ecs\_monitoring\_task\_iam\_role) | git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-assumable-role | f37809108f86d8fbdf17f735df734bf4abe69315 |
| <a name="module_ecs_redis_task_iam_role"></a> [ecs\_redis\_task\_iam\_role](#module\_ecs\_redis\_task\_iam\_role) | git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-assumable-role | f37809108f86d8fbdf17f735df734bf4abe69315 |
| <a name="module_ecs_service"></a> [ecs\_service](#module\_ecs\_service) | git::https://github.com/terraform-aws-modules/terraform-aws-ecs.git//modules/service | 378d0cb7e8fde47e8ddf58461ed1974486dbbd5d |
| <a name="module_encryption_key"></a> [encryption\_key](#module\_encryption\_key) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_google_api_key_ssm_parameter"></a> [google\_api\_key\_ssm\_parameter](#module\_google\_api\_key\_ssm\_parameter) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_google_project_id_ssm_parameter"></a> [google\_project\_id\_ssm\_parameter](#module\_google\_project\_id\_ssm\_parameter) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_google_service_account_ssm_parameter"></a> [google\_service\_account\_ssm\_parameter](#module\_google\_service\_account\_ssm\_parameter) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_iam_policy_ecs_monitoring_task_role_ssm"></a> [iam\_policy\_ecs\_monitoring\_task\_role\_ssm](#module\_iam\_policy\_ecs\_monitoring\_task\_role\_ssm) | git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-policy | f37809108f86d8fbdf17f735df734bf4abe69315 |
| <a name="module_iam_policy_ecs_task_role_ssm"></a> [iam\_policy\_ecs\_task\_role\_ssm](#module\_iam\_policy\_ecs\_task\_role\_ssm) | git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-policy | f37809108f86d8fbdf17f735df734bf4abe69315 |
| <a name="module_iam_role_ecs_monitoring_task_execution"></a> [iam\_role\_ecs\_monitoring\_task\_execution](#module\_iam\_role\_ecs\_monitoring\_task\_execution) | git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-assumable-role | f37809108f86d8fbdf17f735df734bf4abe69315 |
| <a name="module_iam_role_ecs_task_execution"></a> [iam\_role\_ecs\_task\_execution](#module\_iam\_role\_ecs\_task\_execution) | git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-assumable-role | f37809108f86d8fbdf17f735df734bf4abe69315 |
| <a name="module_index_id_ssm_parameter"></a> [index\_id\_ssm\_parameter](#module\_index\_id\_ssm\_parameter) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_index_id_ssm_parameter_local"></a> [index\_id\_ssm\_parameter\_local](#module\_index\_id\_ssm\_parameter\_local) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_internal_monitoring_load_balancer"></a> [internal\_monitoring\_load\_balancer](#module\_internal\_monitoring\_load\_balancer) | git::https://github.com/terraform-aws-modules/terraform-aws-alb.git | 3e9c6cbaf4c1d858c3bbee6f086f0c8ef17522ab |
| <a name="module_internal_ssl_certificate"></a> [internal\_ssl\_certificate](#module\_internal\_ssl\_certificate) | git::https://github.com/terraform-aws-modules/terraform-aws-acm.git | 5d113fa07675fc42237907a621b68ac97109043e |
| <a name="module_langfuse_public_key"></a> [langfuse\_public\_key](#module\_langfuse\_public\_key) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_langfuse_secret_key"></a> [langfuse\_secret\_key](#module\_langfuse\_secret\_key) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_master_user_password"></a> [master\_user\_password](#module\_master\_user\_password) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_monitoring_ecs_service"></a> [monitoring\_ecs\_service](#module\_monitoring\_ecs\_service) | git::https://github.com/terraform-aws-modules/terraform-aws-ecs.git//modules/service | 378d0cb7e8fde47e8ddf58461ed1974486dbbd5d |
| <a name="module_monitoring_load_balancer"></a> [monitoring\_load\_balancer](#module\_monitoring\_load\_balancer) | git::https://github.com/terraform-aws-modules/terraform-aws-alb.git | 3e9c6cbaf4c1d858c3bbee6f086f0c8ef17522ab |
| <a name="module_nextauth_secret"></a> [nextauth\_secret](#module\_nextauth\_secret) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_nlb"></a> [nlb](#module\_nlb) | git::https://github.com/terraform-aws-modules/terraform-aws-alb.git | 3e9c6cbaf4c1d858c3bbee6f086f0c8ef17522ab |
| <a name="module_postgres_url"></a> [postgres\_url](#module\_postgres\_url) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_rds"></a> [rds](#module\_rds) | git::https://github.com/terraform-aws-modules/terraform-aws-rds-aurora.git | 7bf5933100eb355b13854232e5d63c62ea7cad35 |
| <a name="module_s3_bucket_kb"></a> [s3\_bucket\_kb](#module\_s3\_bucket\_kb) | git::https://github.com/terraform-aws-modules/terraform-aws-s3-bucket.git | 8eecd4bfe167b3606755a0f8150514e9dcb2bf67 |
| <a name="module_s3_bucket_llamaindex"></a> [s3\_bucket\_llamaindex](#module\_s3\_bucket\_llamaindex) | git::https://github.com/terraform-aws-modules/terraform-aws-s3-bucket.git | 8eecd4bfe167b3606755a0f8150514e9dcb2bf67 |
| <a name="module_salt"></a> [salt](#module\_salt) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_ssl_certificate"></a> [ssl\_certificate](#module\_ssl\_certificate) | git::https://github.com/terraform-aws-modules/terraform-aws-acm.git | 5d113fa07675fc42237907a621b68ac97109043e |
| <a name="module_ssl_certificate_us_east_1"></a> [ssl\_certificate\_us\_east\_1](#module\_ssl\_certificate\_us\_east\_1) | git::https://github.com/terraform-aws-modules/terraform-aws-acm.git | 5d113fa07675fc42237907a621b68ac97109043e |
| <a name="module_user_pool_client_id"></a> [user\_pool\_client\_id](#module\_user\_pool\_client\_id) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_user_pool_client_secret"></a> [user\_pool\_client\_secret](#module\_user\_pool\_client\_secret) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_user_pool_issuer"></a> [user\_pool\_issuer](#module\_user\_pool\_issuer) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |

## Resources

| Name | Type |
|------|------|
| [aws_api_gateway_account.chatbot](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_account) | resource |
| [aws_api_gateway_authorizer.authorizer](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_authorizer) | resource |
| [aws_api_gateway_base_path_mapping.path_mapping](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_base_path_mapping) | resource |
| [aws_api_gateway_deployment.stage](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_deployment) | resource |
| [aws_api_gateway_domain_name.domain_name](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_domain_name) | resource |
| [aws_api_gateway_integration.chatbot](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration) | resource |
| [aws_api_gateway_integration.chatbot_cors](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration) | resource |
| [aws_api_gateway_method.chatbot](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method) | resource |
| [aws_api_gateway_method.chatbot_cors](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method) | resource |
| [aws_api_gateway_method_settings.chatbot](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method_settings) | resource |
| [aws_api_gateway_resource.chatbot](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_rest_api.api](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_rest_api) | resource |
| [aws_api_gateway_stage.api_stage](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_stage) | resource |
| [aws_cloudwatch_dashboard.chatbot_dashboard](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_dashboard) | resource |
| [aws_cloudwatch_event_rule.lambda_invocation_rule](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_event_rule) | resource |
| [aws_cloudwatch_event_target.lambda_target](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_event_target) | resource |
| [aws_cloudwatch_log_group.lambda_evaluate_logs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_log_group.lambda_index_logs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_log_group.lambda_logs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_log_group.lambda_monitor_logs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_metric_alarm.api_gateway_4xx_errors](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.api_gateway_5xx_errors](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.api_gateway_increased_requests](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.dynamodb_read_throttle_queries](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.dynamodb_read_throttle_sessions](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.dynamodb_write_throttle_queries](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.dynamodb_write_throttle_sessions](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.lambda_duration](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.lambda_errors](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.lambda_evaluate_errors](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.lambda_increased_invocations](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cognito_user.master](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_user) | resource |
| [aws_cognito_user_pool.monitoring](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_user_pool) | resource |
| [aws_cognito_user_pool_client.langfuse](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_user_pool_client) | resource |
| [aws_cognito_user_pool_domain.monitoring](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_user_pool_domain) | resource |
| [aws_ecs_task_definition.ecs_redis_task_def](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_task_definition) | resource |
| [aws_ecs_task_definition.monitoring_task_def](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_task_definition) | resource |
| [aws_efs_access_point.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/efs_access_point) | resource |
| [aws_efs_file_system.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/efs_file_system) | resource |
| [aws_efs_mount_target.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/efs_mount_target) | resource |
| [aws_iam_policy.chatbot_monitor_queue](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.deploy_chatbot](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.lambda_chatbot_ecr_access](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.lambda_dynamodb_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.lambda_s3_chatbot_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.lambda_ssm_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role.cloudwatch](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.deploy_chatbot](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.lambda_evaluate_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.lambda_index_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.lambda_monitor_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.lambda_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy.cloudwatch](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_iam_role_policy.lambda_evaluate_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_iam_role_policy.lambda_index_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_iam_role_policy.lambda_monitor_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_iam_role_policy_attachment.chatbot_monitor_queue](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.deploy_chatbot](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.lambda_chatbot_ecr_access_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.lambda_dynamodb_policy_attachment](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.lambda_logs_policy_attachment](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.lambda_s3_chatbot_policy_attachment](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.lambda_ssm_policy_attachment](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.lambda_vpc_policy_attachment](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_lambda_event_source_mapping.evaluate_lambda_sqs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_event_source_mapping) | resource |
| [aws_lambda_event_source_mapping.monitor_lambda_sqs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_event_source_mapping) | resource |
| [aws_lambda_function.chatbot_evaluate_lambda](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_function.chatbot_index_lambda](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_function.chatbot_lambda](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_function.chatbot_monitor_lambda](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_function_event_invoke_config.lambda_evaluate](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function_event_invoke_config) | resource |
| [aws_lambda_function_event_invoke_config.lambda_monitor](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function_event_invoke_config) | resource |
| [aws_lambda_permission.allow_eventbridge](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) | resource |
| [aws_lambda_permission.allow_s3_invoke_index](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) | resource |
| [aws_lambda_permission.rest_apigw_lambda](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) | resource |
| [aws_route53_record.apigw](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route53_record.internal_monitoring](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route53_record.monitoring](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route53_zone.chatbot_internal](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_zone) | resource |
| [aws_s3_bucket_notification.index_lambda_trigger](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_notification) | resource |
| [aws_security_group.efs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.internal_monitoring_lb](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.lambda](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.monitoring_database](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.monitoring_ecs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.monitoring_lb](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.nlb](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.redis](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group_rule.alb_ingress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.ecs_redis_ingress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.efs_egress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.efs_redis_ingress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.internal_alb_ingress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.lambda_egress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.lambda_redis_ingress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.monitoring_ecs_egress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.nlb_egress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.nlb_ingress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.redis_egress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_sns_topic.alerts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic) | resource |
| [aws_sns_topic_policy.alerts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic_policy) | resource |
| [aws_sqs_queue.chatbot_evaluate_queue](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sqs_queue) | resource |
| [aws_sqs_queue.chatbot_evaluate_queue_dlq](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sqs_queue) | resource |
| [aws_sqs_queue.chatbot_monitor_queue](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sqs_queue) | resource |
| [aws_sqs_queue.chatbot_monitor_queue_dlq](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sqs_queue) | resource |
| [aws_wafv2_web_acl.chatbot](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/wafv2_web_acl) | resource |
| [aws_wafv2_web_acl_association.chatbot](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/wafv2_web_acl_association) | resource |
| [random_id.nextauth_secret](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/id) | resource |
| [random_id.salt](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/id) | resource |
| [random_integer.ai_kb_bucket_random_integer](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/integer) | resource |
| [random_password.encryption_key](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password) | resource |
| [random_password.master](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password) | resource |
| [random_password.monitoring_database_password](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password) | resource |
| [random_uuid.public_key_uuid](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/uuid) | resource |
| [random_uuid.secret_key_uuid](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/uuid) | resource |
| [aws_availability_zones.available](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/availability_zones) | data source |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy_document.apigateway_assume_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.apigateway_cloudwatch](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.deploy_github](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.ecs_monitoring_ssm_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.ecs_task_role_ssm](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.lambda_dynamodb_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.lambda_s3_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.lambda_ssm_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_aws_chatbot_region"></a> [aws\_chatbot\_region](#input\_aws\_chatbot\_region) | AWS region to create AI chatbot's resources | `string` | n/a | yes |
| <a name="input_cognito_user_pool"></a> [cognito\_user\_pool](#input\_cognito\_user\_pool) | The cognito user pool used to authenticate api calls | <pre>object({<br/>    id        = string<br/>    arn       = string<br/>    domain    = string<br/>    region    = string<br/>    client_id = string<br/>    endpoint  = string<br/>  })</pre> | n/a | yes |
| <a name="input_dns_chatbot_hosted_zone"></a> [dns\_chatbot\_hosted\_zone](#input\_dns\_chatbot\_hosted\_zone) | The name of the chatbot hosted zone | <pre>object({<br/>    name = string<br/>    id   = string<br/>  })</pre> | n/a | yes |
| <a name="input_dns_domain_name"></a> [dns\_domain\_name](#input\_dns\_domain\_name) | DNS domain for the Developer Portal product | `string` | n/a | yes |
| <a name="input_ecs_monitoring"></a> [ecs\_monitoring](#input\_ecs\_monitoring) | Langfuse configuration for the AI chatbot | <pre>object({<br/>    cpu       = number<br/>    memory    = number<br/>    image_uri = string<br/>    port      = number<br/>  })</pre> | n/a | yes |
| <a name="input_ecs_redis"></a> [ecs\_redis](#input\_ecs\_redis) | Redis configuration for the AI chatbot | <pre>object({<br/>    cpu       = number<br/>    memory    = number<br/>    image_uri = string<br/>    port      = number<br/>  })</pre> | n/a | yes |
| <a name="input_environment"></a> [environment](#input\_environment) | Environment | `string` | n/a | yes |
| <a name="input_github_repository"></a> [github\_repository](#input\_github\_repository) | The repository where the IaC workflows will run | `string` | n/a | yes |
| <a name="input_models"></a> [models](#input\_models) | The models used by the AI chatbot | <pre>object({<br/>    provider   = string<br/>    generation = string<br/>    embeddings = string<br/>    reranker   = string<br/>  })</pre> | n/a | yes |
| <a name="input_s3_bucket_name_static_content"></a> [s3\_bucket\_name\_static\_content](#input\_s3\_bucket\_name\_static\_content) | The name of the S3 bucket for static content | `string` | n/a | yes |
| <a name="input_security_groups"></a> [security\_groups](#input\_security\_groups) | The security groups used to deploy the resources | `map(string)` | n/a | yes |
| <a name="input_vpc"></a> [vpc](#input\_vpc) | The VPC used to deploy the resources | <pre>object({<br/>    id                         = string<br/>    cidr_block                 = string<br/>    public_subnets             = list(string)<br/>    database_subnets           = list(string)<br/>    private_subnets            = list(string)<br/>    elasticache_subnets        = list(string)<br/>    database_subnet_group_name = string<br/>  })</pre> | n/a | yes |
| <a name="input_api_gateway"></a> [api\_gateway](#input\_api\_gateway) | n/a | <pre>object({<br/>    integration_timeout_sec = optional(number, 60)<br/>  })</pre> | <pre>{<br/>  "integration_timeout_sec": 60<br/>}</pre> | no |
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | AWS region to create resources. Default Milan | `string` | `"eu-south-1"` | no |
| <a name="input_module"></a> [module](#input\_module) | Prefix for resources | `string` | `"chatbot"` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | n/a | `map(any)` | <pre>{<br/>  "CostCenter": "BD110 - PORTALS E TOOLS",<br/>  "CreatedBy": "Terraform",<br/>  "ManagementTeam": "team_cloudgaap_ai",<br/>  "Owner": "CloudGaaP-AI",<br/>  "Wbs": "BD110 - PORTALS E TOOLS"<br/>}</pre> | no |
| <a name="input_waf_block_requests_to_queries_evaluation_window_sec"></a> [waf\_block\_requests\_to\_queries\_evaluation\_window\_sec](#input\_waf\_block\_requests\_to\_queries\_evaluation\_window\_sec) | n/a | `number` | `60` | no |
| <a name="input_waf_block_requests_to_queries_limit"></a> [waf\_block\_requests\_to\_queries\_limit](#input\_waf\_block\_requests\_to\_queries\_limit) | n/a | `number` | `100` | no |
| <a name="input_waf_ip_rate_limit_evaluation_window_sec"></a> [waf\_ip\_rate\_limit\_evaluation\_window\_sec](#input\_waf\_ip\_rate\_limit\_evaluation\_window\_sec) | n/a | `number` | `60` | no |
| <a name="input_waf_ip_rate_limit_limit"></a> [waf\_ip\_rate\_limit\_limit](#input\_waf\_ip\_rate\_limit\_limit) | n/a | `number` | `100` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_cognito_master_user_password_param_arn"></a> [cognito\_master\_user\_password\_param\_arn](#output\_cognito\_master\_user\_password\_param\_arn) | ARN of the SSM parameter storing the chatbot Cognito master user password |
| <a name="output_cognito_user_pool_endpoint"></a> [cognito\_user\_pool\_endpoint](#output\_cognito\_user\_pool\_endpoint) | Endpoint of the Cognito user pool used for chatbot authentication |
| <a name="output_cognito_user_pool_id"></a> [cognito\_user\_pool\_id](#output\_cognito\_user\_pool\_id) | ID of the Cognito user pool used for chatbot authentication |
| <a name="output_lambda_env_variables"></a> [lambda\_env\_variables](#output\_lambda\_env\_variables) | Environment variables of the Lambda Function |
| <a name="output_lambda_function_arn"></a> [lambda\_function\_arn](#output\_lambda\_function\_arn) | The ARN of the Lambda Function |
| <a name="output_lambda_function_name"></a> [lambda\_function\_name](#output\_lambda\_function\_name) | The name of the Lambda Function |
| <a name="output_lambda_role_arn"></a> [lambda\_role\_arn](#output\_lambda\_role\_arn) | The ARN of the IAM role created for the Lambda Function |
| <a name="output_lambda_role_name"></a> [lambda\_role\_name](#output\_lambda\_role\_name) | The name of the IAM role created for the Lambda Function |
| <a name="output_security_groups"></a> [security\_groups](#output\_security\_groups) | n/a |
