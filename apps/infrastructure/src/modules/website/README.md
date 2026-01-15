## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 6.28.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 6.28.0 |
| <a name="provider_aws.us-east-1"></a> [aws.us-east-1](#provider\_aws.us-east-1) | >= 6.28.0 |
| <a name="provider_random"></a> [random](#provider\_random) | n/a |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_cloudfront_5xx_error_rate_alarm"></a> [cloudfront\_5xx\_error\_rate\_alarm](#module\_cloudfront\_5xx\_error\_rate\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cloudfront_origin_latency_alarm"></a> [cloudfront\_origin\_latency\_alarm](#module\_cloudfront\_origin\_latency\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_create_auth_challenge_function"></a> [cognito\_create\_auth\_challenge\_function](#module\_cognito\_create\_auth\_challenge\_function) | git::github.com/terraform-aws-modules/terraform-aws-lambda.git | 9633abb6b6d275d3a28604dbfa755098470420d4 |
| <a name="module_cognito_create_auth_challenge_lambda_concurrent_executions_alarm"></a> [cognito\_create\_auth\_challenge\_lambda\_concurrent\_executions\_alarm](#module\_cognito\_create\_auth\_challenge\_lambda\_concurrent\_executions\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_create_auth_challenge_lambda_duration_alarm"></a> [cognito\_create\_auth\_challenge\_lambda\_duration\_alarm](#module\_cognito\_create\_auth\_challenge\_lambda\_duration\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_create_auth_challenge_lambda_errors_alarm"></a> [cognito\_create\_auth\_challenge\_lambda\_errors\_alarm](#module\_cognito\_create\_auth\_challenge\_lambda\_errors\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_create_auth_challenge_lambda_throttles_alarm"></a> [cognito\_create\_auth\_challenge\_lambda\_throttles\_alarm](#module\_cognito\_create\_auth\_challenge\_lambda\_throttles\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_custom_message_function"></a> [cognito\_custom\_message\_function](#module\_cognito\_custom\_message\_function) | git::github.com/terraform-aws-modules/terraform-aws-lambda.git | 9633abb6b6d275d3a28604dbfa755098470420d4 |
| <a name="module_cognito_custom_message_lambda_concurrent_executions_alarm"></a> [cognito\_custom\_message\_lambda\_concurrent\_executions\_alarm](#module\_cognito\_custom\_message\_lambda\_concurrent\_executions\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_custom_message_lambda_duration_alarm"></a> [cognito\_custom\_message\_lambda\_duration\_alarm](#module\_cognito\_custom\_message\_lambda\_duration\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_custom_message_lambda_errors_alarm"></a> [cognito\_custom\_message\_lambda\_errors\_alarm](#module\_cognito\_custom\_message\_lambda\_errors\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_custom_message_lambda_throttles_alarm"></a> [cognito\_custom\_message\_lambda\_throttles\_alarm](#module\_cognito\_custom\_message\_lambda\_throttles\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_define_auth_challenge_function"></a> [cognito\_define\_auth\_challenge\_function](#module\_cognito\_define\_auth\_challenge\_function) | git::github.com/terraform-aws-modules/terraform-aws-lambda.git | 9633abb6b6d275d3a28604dbfa755098470420d4 |
| <a name="module_cognito_define_auth_challenge_lambda_concurrent_executions_alarm"></a> [cognito\_define\_auth\_challenge\_lambda\_concurrent\_executions\_alarm](#module\_cognito\_define\_auth\_challenge\_lambda\_concurrent\_executions\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_define_auth_challenge_lambda_duration_alarm"></a> [cognito\_define\_auth\_challenge\_lambda\_duration\_alarm](#module\_cognito\_define\_auth\_challenge\_lambda\_duration\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_define_auth_challenge_lambda_errors_alarm"></a> [cognito\_define\_auth\_challenge\_lambda\_errors\_alarm](#module\_cognito\_define\_auth\_challenge\_lambda\_errors\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_define_auth_challenge_lambda_throttles_alarm"></a> [cognito\_define\_auth\_challenge\_lambda\_throttles\_alarm](#module\_cognito\_define\_auth\_challenge\_lambda\_throttles\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_post_confirmation_function"></a> [cognito\_post\_confirmation\_function](#module\_cognito\_post\_confirmation\_function) | git::github.com/terraform-aws-modules/terraform-aws-lambda.git | 9633abb6b6d275d3a28604dbfa755098470420d4 |
| <a name="module_cognito_post_confirmation_lambda_concurrent_executions_alarm"></a> [cognito\_post\_confirmation\_lambda\_concurrent\_executions\_alarm](#module\_cognito\_post\_confirmation\_lambda\_concurrent\_executions\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_post_confirmation_lambda_duration_alarm"></a> [cognito\_post\_confirmation\_lambda\_duration\_alarm](#module\_cognito\_post\_confirmation\_lambda\_duration\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_post_confirmation_lambda_errors_alarm"></a> [cognito\_post\_confirmation\_lambda\_errors\_alarm](#module\_cognito\_post\_confirmation\_lambda\_errors\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_post_confirmation_lambda_throttles_alarm"></a> [cognito\_post\_confirmation\_lambda\_throttles\_alarm](#module\_cognito\_post\_confirmation\_lambda\_throttles\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_pre_sign_up_function"></a> [cognito\_pre\_sign\_up\_function](#module\_cognito\_pre\_sign\_up\_function) | git::github.com/terraform-aws-modules/terraform-aws-lambda.git | 9633abb6b6d275d3a28604dbfa755098470420d4 |
| <a name="module_cognito_pre_sign_up_lambda_concurrent_executions_alarm"></a> [cognito\_pre\_sign\_up\_lambda\_concurrent\_executions\_alarm](#module\_cognito\_pre\_sign\_up\_lambda\_concurrent\_executions\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_user_pool_sign_in_throttles_alarm"></a> [cognito\_user\_pool\_sign\_in\_throttles\_alarm](#module\_cognito\_user\_pool\_sign\_in\_throttles\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_user_pool_sign_up_throttles_alarm"></a> [cognito\_user\_pool\_sign\_up\_throttles\_alarm](#module\_cognito\_user\_pool\_sign\_up\_throttles\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_user_pool_token_refresh_throttles_alarm"></a> [cognito\_user\_pool\_token\_refresh\_throttles\_alarm](#module\_cognito\_user\_pool\_token\_refresh\_throttles\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_verify_auth_challenge_function"></a> [cognito\_verify\_auth\_challenge\_function](#module\_cognito\_verify\_auth\_challenge\_function) | git::github.com/terraform-aws-modules/terraform-aws-lambda.git | 9633abb6b6d275d3a28604dbfa755098470420d4 |
| <a name="module_cognito_verify_auth_challenge_lambda_concurrent_executions_alarm"></a> [cognito\_verify\_auth\_challenge\_lambda\_concurrent\_executions\_alarm](#module\_cognito\_verify\_auth\_challenge\_lambda\_concurrent\_executions\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_verify_auth_challenge_lambda_duration_alarm"></a> [cognito\_verify\_auth\_challenge\_lambda\_duration\_alarm](#module\_cognito\_verify\_auth\_challenge\_lambda\_duration\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_verify_auth_challenge_lambda_errors_alarm"></a> [cognito\_verify\_auth\_challenge\_lambda\_errors\_alarm](#module\_cognito\_verify\_auth\_challenge\_lambda\_errors\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_cognito_verify_auth_challenge_lambda_throttles_alarm"></a> [cognito\_verify\_auth\_challenge\_lambda\_throttles\_alarm](#module\_cognito\_verify\_auth\_challenge\_lambda\_throttles\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_dynamodb_read_capacity_utilization_alarm"></a> [dynamodb\_read\_capacity\_utilization\_alarm](#module\_dynamodb\_read\_capacity\_utilization\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_dynamodb_read_throttle_events_webinar_questions_alarm"></a> [dynamodb\_read\_throttle\_events\_webinar\_questions\_alarm](#module\_dynamodb\_read\_throttle\_events\_webinar\_questions\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_dynamodb_successful_request_latency_put_item_alarm"></a> [dynamodb\_successful\_request\_latency\_put\_item\_alarm](#module\_dynamodb\_successful\_request\_latency\_put\_item\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_dynamodb_successful_request_latency_query_alarm"></a> [dynamodb\_successful\_request\_latency\_query\_alarm](#module\_dynamodb\_successful\_request\_latency\_query\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_dynamodb_system_errors_webinar_questions_alarm"></a> [dynamodb\_system\_errors\_webinar\_questions\_alarm](#module\_dynamodb\_system\_errors\_webinar\_questions\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_dynamodb_user_errors_alarm"></a> [dynamodb\_user\_errors\_alarm](#module\_dynamodb\_user\_errors\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_dynamodb_webinar_questions"></a> [dynamodb\_webinar\_questions](#module\_dynamodb\_webinar\_questions) | git::github.com/terraform-aws-modules/terraform-aws-dynamodb-table.git | 715399dbe24f6443820bf5de80f6100b35d56355 |
| <a name="module_dynamodb_webinar_subscriptions"></a> [dynamodb\_webinar\_subscriptions](#module\_dynamodb\_webinar\_subscriptions) | git::github.com/terraform-aws-modules/terraform-aws-dynamodb-table.git | 715399dbe24f6443820bf5de80f6100b35d56355 |
| <a name="module_dynamodb_write_capacity_utilization_alarm"></a> [dynamodb\_write\_capacity\_utilization\_alarm](#module\_dynamodb\_write\_capacity\_utilization\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_dynamodb_write_throttle_events_webinar_questions_alarm"></a> [dynamodb\_write\_throttle\_events\_webinar\_questions\_alarm](#module\_dynamodb\_write\_throttle\_events\_webinar\_questions\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_opennext"></a> [opennext](#module\_opennext) | pagopa-dx/aws-open-next/aws | ~> 0.0 |
| <a name="module_ses_bounce_rate_alarm"></a> [ses\_bounce\_rate\_alarm](#module\_ses\_bounce\_rate\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_ses_daily_sending_quota_alarm"></a> [ses\_daily\_sending\_quota\_alarm](#module\_ses\_daily\_sending\_quota\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_ses_reputation_complaint_rate_alarm"></a> [ses\_reputation\_complaint\_rate\_alarm](#module\_ses\_reputation\_complaint\_rate\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |
| <a name="module_ses_sending_rate_limit_alarm"></a> [ses\_sending\_rate\_limit\_alarm](#module\_ses\_sending\_rate\_limit\_alarm) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/metric-alarm | 0b4aa2b9aa19060205965a938de89a7bf0ff477b |

## Resources

| Name | Type |
|------|------|
| [aws_acm_certificate.auth](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/acm_certificate) | resource |
| [aws_acm_certificate.static_contents](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/acm_certificate) | resource |
| [aws_acm_certificate.website](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/acm_certificate) | resource |
| [aws_cloudfront_distribution.static_contents](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_distribution) | resource |
| [aws_cloudfront_function.website_viewer_request_handler](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_function) | resource |
| [aws_cloudfront_origin_access_identity.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_origin_access_identity) | resource |
| [aws_cloudfront_response_headers_policy.static_content_cors](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_response_headers_policy) | resource |
| [aws_cloudfront_response_headers_policy.websites](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_response_headers_policy) | resource |
| [aws_cloudwatch_dashboard.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_dashboard) | resource |
| [aws_cognito_identity_pool.devportal](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_identity_pool) | resource |
| [aws_cognito_identity_pool_roles_attachment.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_identity_pool_roles_attachment) | resource |
| [aws_cognito_user_group.hosts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_user_group) | resource |
| [aws_cognito_user_pool.devportal](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_user_pool) | resource |
| [aws_cognito_user_pool_client.devportal_website](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_user_pool_client) | resource |
| [aws_cognito_user_pool_domain.devportal](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_user_pool_domain) | resource |
| [aws_iam_policy.deploy_website](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy_attachment.docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy_attachment) | resource |
| [aws_iam_role.deploy_website](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.devportal_authenticated_host_user](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.devportal_authenticated_user](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy.devportal_authenticated_host_user](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_iam_role_policy.devportal_authenticated_user](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_iam_role_policy_attachment.deploy_website](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_route53_record.certificate](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route53_record.devportal_cognito_A](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route53_record.static_contents](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_s3_bucket.website_standalone](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket) | resource |
| [aws_s3_bucket_lifecycle_configuration.website_standalone](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_lifecycle_configuration) | resource |
| [aws_s3_bucket_policy.website_standalone](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_policy) | resource |
| [aws_s3_bucket_public_access_block.website_standalone](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_public_access_block) | resource |
| [aws_s3_bucket_versioning.website_standalone](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_versioning) | resource |
| [aws_sns_topic.metric_alarm](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic) | resource |
| [aws_sns_topic_subscription.metric_alarm](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic_subscription) | resource |
| [aws_ssm_parameter.cookie_domain_script](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ssm_parameter) | resource |
| [aws_ssm_parameter.strapi_api_token](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ssm_parameter) | resource |
| [random_integer.website_bucket_random_integer](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/integer) | resource |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy_document.authenticated_users_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.deploy_github](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.website_standalone_iam_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_dns_domain_name"></a> [dns\_domain\_name](#input\_dns\_domain\_name) | DNS domain for the Developer Portal product | `string` | n/a | yes |
| <a name="input_environment"></a> [environment](#input\_environment) | Environment | `string` | n/a | yes |
| <a name="input_environment_information"></a> [environment\_information](#input\_environment\_information) | Values which are used to generate resource names and location short names. They are all mandatory except for domain, which should not be used only in the case of a resource used by multiple domains. | <pre>object({<br/>    prefix          = string<br/>    env_short       = string<br/>    location        = string<br/>    domain          = optional(string)<br/>    app_name        = string<br/>    instance_number = string<br/>    region          = string<br/>  })</pre> | n/a | yes |
| <a name="input_github_repository"></a> [github\_repository](#input\_github\_repository) | The repository where the IaC workflows will run | `string` | n/a | yes |
| <a name="input_hosted_zone_id"></a> [hosted\_zone\_id](#input\_hosted\_zone\_id) | The ID of the hosted zone to create the public DNS records in | `string` | n/a | yes |
| <a name="input_next_cms_interlan_alb_dns_name"></a> [next\_cms\_interlan\_alb\_dns\_name](#input\_next\_cms\_interlan\_alb\_dns\_name) | The DNS name of the internal ALB for the CMS | `string` | n/a | yes |
| <a name="input_nextjs_version"></a> [nextjs\_version](#input\_nextjs\_version) | The version of Next.js to use | `string` | n/a | yes |
| <a name="input_ses_domain_identity_arn"></a> [ses\_domain\_identity\_arn](#input\_ses\_domain\_identity\_arn) | The ARN of the SES domain identity | `string` | n/a | yes |
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | AWS region to create resources. Default Milan | `string` | `"eu-south-1"` | no |
| <a name="input_cdn_custom_headers"></a> [cdn\_custom\_headers](#input\_cdn\_custom\_headers) | n/a | <pre>list(object(<br/>    {<br/>      header   = string<br/>      override = bool<br/>      value    = string<br/>    }<br/>  ))</pre> | `[]` | no |
| <a name="input_create_chatbot"></a> [create\_chatbot](#input\_create\_chatbot) | Defines if chatbot should be created | `bool` | `false` | no |
| <a name="input_dns_delegate_records"></a> [dns\_delegate\_records](#input\_dns\_delegate\_records) | DNS delegate records | `map(any)` | `{}` | no |
| <a name="input_log_retention_days"></a> [log\_retention\_days](#input\_log\_retention\_days) | The number of days logs should be retained. Default is 90 days. | `number` | `90` | no |
| <a name="input_mfa_code_duration_in_minutes"></a> [mfa\_code\_duration\_in\_minutes](#input\_mfa\_code\_duration\_in\_minutes) | The duration for which the MFA code is valid in minutes | `number` | `15` | no |
| <a name="input_next_public_feedback_form_enabled"></a> [next\_public\_feedback\_form\_enabled](#input\_next\_public\_feedback\_form\_enabled) | Defines if the feedback form should be enabled | `bool` | `false` | no |
| <a name="input_next_public_soap_api_page_active"></a> [next\_public\_soap\_api\_page\_active](#input\_next\_public\_soap\_api\_page\_active) | Defines if the SOAP API page should be active | `bool` | `false` | no |
| <a name="input_publish_cloudfront_functions"></a> [publish\_cloudfront\_functions](#input\_publish\_cloudfront\_functions) | Defines if cloudfront functions should be published | `bool` | `false` | no |
| <a name="input_signup_allowed_email_domains"></a> [signup\_allowed\_email\_domains](#input\_signup\_allowed\_email\_domains) | List of allowed email domains for signup | `list(string)` | <pre>[<br/>  "pagopa.it",<br/>  "uqido.com",<br/>  "aizoongroup.com",<br/>  "dgsspa.com"<br/>]</pre> | no |
| <a name="input_tags"></a> [tags](#input\_tags) | n/a | `map(any)` | <pre>{<br/>  "CreatedBy": "Terraform"<br/>}</pre> | no |
| <a name="input_use_custom_certificate"></a> [use\_custom\_certificate](#input\_use\_custom\_certificate) | Enable CDN https support with a custom certificate instead using the default one | `bool` | `true` | no |
| <a name="input_vpc"></a> [vpc](#input\_vpc) | The VPC used to deploy the lambda functions in. Configure this only when you want the lambda to access private resources contained in the VPC. | <pre>object({<br/>    id              = string<br/>    private_subnets = list(string)<br/>  })</pre> | `null` | no |
| <a name="input_website_is_standalone"></a> [website\_is\_standalone](#input\_website\_is\_standalone) | If true, the website will be deployed in standalone mode (Amplify), otherwise static deployment is used (S3 + Cloudfront) | `bool` | `false` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_assets_opennext_bucket"></a> [assets\_opennext\_bucket](#output\_assets\_opennext\_bucket) | n/a |
| <a name="output_cognito_user_pool"></a> [cognito\_user\_pool](#output\_cognito\_user\_pool) | n/a |
| <a name="output_lambda_code_opennext_bucket"></a> [lambda\_code\_opennext\_bucket](#output\_lambda\_code\_opennext\_bucket) | n/a |
| <a name="output_lambda_initializer"></a> [lambda\_initializer](#output\_lambda\_initializer) | n/a |
| <a name="output_opennext_cdn_distribution_id"></a> [opennext\_cdn\_distribution\_id](#output\_opennext\_cdn\_distribution\_id) | n/a |
| <a name="output_standalone_server"></a> [standalone\_server](#output\_standalone\_server) | n/a |
| <a name="output_webinar_subscriptions_ddb"></a> [webinar\_subscriptions\_ddb](#output\_webinar\_subscriptions\_ddb) | n/a |
| <a name="output_website_standalone_bucket"></a> [website\_standalone\_bucket](#output\_website\_standalone\_bucket) | n/a |
