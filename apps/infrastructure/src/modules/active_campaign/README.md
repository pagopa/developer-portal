## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_active_campaign_api_key"></a> [active\_campaign\_api\_key](#module\_active\_campaign\_api\_key) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_active_campaign_base_url"></a> [active\_campaign\_base\_url](#module\_active\_campaign\_base\_url) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_lambda_resync"></a> [lambda\_resync](#module\_lambda\_resync) | git::github.com/terraform-aws-modules/terraform-aws-lambda.git | 177ee12ae387ed683c8cce5992b0278311951e8d |
| <a name="module_lambda_sync"></a> [lambda\_sync](#module\_lambda\_sync) | git::github.com/terraform-aws-modules/terraform-aws-lambda.git | 177ee12ae387ed683c8cce5992b0278311951e8d |

## Resources

| Name | Type |
|------|------|
| [aws_cloudwatch_event_rule.cognito_events](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_event_rule) | resource |
| [aws_cloudwatch_event_target.cognito_events_sqs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_event_target) | resource |
| [aws_cloudwatch_log_group.pipe](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_metric_alarm.pipe_failed](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.resync_dlq](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_iam_policy.lambda_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.pipes](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role.pipes_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.lambda_cognito_policy_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.lambda_policy_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.lambda_resync_cognito_policy_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.lambda_resync_policy_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.pipes](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_pipes_pipe.dynamodb_to_sqs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/pipes_pipe) | resource |
| [aws_sns_topic.alerts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic) | resource |
| [aws_sns_topic_policy.alerts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic_policy) | resource |
| [aws_sqs_queue.fifo_dlq_queue](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sqs_queue) | resource |
| [aws_sqs_queue.fifo_queue](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sqs_queue) | resource |
| [aws_sqs_queue.fifo_resync_dlq_queue](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sqs_queue) | resource |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_cognito_user_pool"></a> [cognito\_user\_pool](#input\_cognito\_user\_pool) | The cognito user pool used to authenticate api calls | <pre>object({<br/>    id        = string<br/>    arn       = string<br/>    domain    = string<br/>    region    = string<br/>    client_id = string<br/>    endpoint  = string<br/>  })</pre> | n/a | yes |
| <a name="input_environment"></a> [environment](#input\_environment) | Environment | `string` | n/a | yes |
| <a name="input_webinar_subscriptions_ddb"></a> [webinar\_subscriptions\_ddb](#input\_webinar\_subscriptions\_ddb) | n/a | <pre>object({<br/>    name       = string<br/>    arn        = string<br/>    stream_arn = string<br/>  })</pre> | n/a | yes |
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | AWS region to create resources. Default Milan | `string` | `"eu-south-1"` | no |
| <a name="input_module"></a> [module](#input\_module) | Prefix for resources | `string` | `"ac"` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | n/a | `map(any)` | <pre>{<br/>  "CostCenter": "BD110 - PORTALS E TOOLS",<br/>  "CreatedBy": "Terraform",<br/>  "ManagementTeam": "team_cloudgaap_ai",<br/>  "Owner": "CloudGaaP-AI",<br/>  "Wbs": "BD110 - PORTALS E TOOLS"<br/>}</pre> | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_api_key_param"></a> [api\_key\_param](#output\_api\_key\_param) | n/a |
| <a name="output_base_url_param"></a> [base\_url\_param](#output\_base\_url\_param) | n/a |
