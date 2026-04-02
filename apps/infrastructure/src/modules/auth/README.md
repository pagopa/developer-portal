<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 6.28.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 6.28.0 |
| <a name="provider_aws.us-east-1"></a> [aws.us-east-1](#provider\_aws.us-east-1) | >= 6.28.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
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

## Resources

| Name | Type |
|------|------|
| [aws_acm_certificate.auth](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/acm_certificate) | resource |
| [aws_cognito_identity_pool.devportal](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_identity_pool) | resource |
| [aws_cognito_identity_pool_roles_attachment.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_identity_pool_roles_attachment) | resource |
| [aws_cognito_user_group.hosts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_user_group) | resource |
| [aws_cognito_user_pool.devportal](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_user_pool) | resource |
| [aws_cognito_user_pool_client.devportal_website](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_user_pool_client) | resource |
| [aws_cognito_user_pool_domain.devportal](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_user_pool_domain) | resource |
| [aws_iam_role.devportal_authenticated_host_user](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.devportal_authenticated_user](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_route53_record.auth_certificate](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route53_record.devportal_cognito_A](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_sns_topic.cognito_alarms](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic) | resource |
| [aws_sns_topic_subscription.cognito_alarms](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic_subscription) | resource |
| [aws_iam_policy_document.authenticated_users_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | AWS region to create resources. Default Milan | `string` | `"eu-south-1"` | no |
| <a name="input_dns_domain_name"></a> [dns\_domain\_name](#input\_dns\_domain\_name) | DNS domain for the Developer Portal product | `string` | n/a | yes |
| <a name="input_environment"></a> [environment](#input\_environment) | Environment | `string` | n/a | yes |
| <a name="input_hosted_zone_id"></a> [hosted\_zone\_id](#input\_hosted\_zone\_id) | The ID of the hosted zone to create the public DNS records in | `string` | n/a | yes |
| <a name="input_log_retention_days"></a> [log\_retention\_days](#input\_log\_retention\_days) | The number of days logs should be retained. Default is 90 days. | `number` | `90` | no |
| <a name="input_mfa_code_duration_in_minutes"></a> [mfa\_code\_duration\_in\_minutes](#input\_mfa\_code\_duration\_in\_minutes) | The duration for which the MFA code is valid in minutes | `number` | `15` | no |
| <a name="input_ses_domain_identity_arn"></a> [ses\_domain\_identity\_arn](#input\_ses\_domain\_identity\_arn) | The ARN of the SES domain identity | `string` | n/a | yes |
| <a name="input_signup_allowed_email_domains"></a> [signup\_allowed\_email\_domains](#input\_signup\_allowed\_email\_domains) | List of allowed email domains for signup | `list(string)` | <pre>[<br/>  "pagopa.it",<br/>  "uqido.com",<br/>  "aizoongroup.com",<br/>  "dgsspa.com"<br/>]</pre> | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_authenticated_host_user_role_arn"></a> [authenticated\_host\_user\_role\_arn](#output\_authenticated\_host\_user\_role\_arn) | The ARN of the IAM role for authenticated host users |
| <a name="output_authenticated_host_user_role_id"></a> [authenticated\_host\_user\_role\_id](#output\_authenticated\_host\_user\_role\_id) | The ID (name) of the IAM role for authenticated host users |
| <a name="output_authenticated_user_role_arn"></a> [authenticated\_user\_role\_arn](#output\_authenticated\_user\_role\_arn) | The ARN of the IAM role for authenticated users |
| <a name="output_authenticated_user_role_id"></a> [authenticated\_user\_role\_id](#output\_authenticated\_user\_role\_id) | The ID (name) of the IAM role for authenticated users |
| <a name="output_cognito_identity_pool_id"></a> [cognito\_identity\_pool\_id](#output\_cognito\_identity\_pool\_id) | The ID of the Cognito Identity Pool |
| <a name="output_cognito_user_pool"></a> [cognito\_user\_pool](#output\_cognito\_user\_pool) | n/a |
<!-- END_TF_DOCS -->