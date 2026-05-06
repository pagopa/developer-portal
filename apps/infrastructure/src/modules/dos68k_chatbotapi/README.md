## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_ecr"></a> [ecr](#module\_ecr) | git::https://github.com/terraform-aws-modules/terraform-aws-ecr.git | 9f4b587846551110b0db199ea5599f016570fefe |
| <a name="module_ecs_cluster"></a> [ecs\_cluster](#module\_ecs\_cluster) | git::https://github.com/terraform-aws-modules/terraform-aws-ecs.git//modules/cluster | 8b97783def49997d18a6fcb00dc21ce1edc0f538 |
| <a name="module_ecs_log_group"></a> [ecs\_log\_group](#module\_ecs\_log\_group) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/log-group | bf969da953bdbea229392255d2b36e7b720e917e |
| <a name="module_ecs_service"></a> [ecs\_service](#module\_ecs\_service) | git::https://github.com/terraform-aws-modules/terraform-aws-ecs.git//modules/service | 378d0cb7e8fde47e8ddf58461ed1974486dbbd5d |
| <a name="module_iam_policy_ecs_task_dynamodb"></a> [iam\_policy\_ecs\_task\_dynamodb](#module\_iam\_policy\_ecs\_task\_dynamodb) | git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-policy | f37809108f86d8fbdf17f735df734bf4abe69315 |
| <a name="module_iam_policy_ecs_task_execution_ssm"></a> [iam\_policy\_ecs\_task\_execution\_ssm](#module\_iam\_policy\_ecs\_task\_execution\_ssm) | git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-policy | f37809108f86d8fbdf17f735df734bf4abe69315 |
| <a name="module_iam_policy_ecs_task_ssm"></a> [iam\_policy\_ecs\_task\_ssm](#module\_iam\_policy\_ecs\_task\_ssm) | git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-policy | f37809108f86d8fbdf17f735df734bf4abe69315 |
| <a name="module_iam_role_ecs_task"></a> [iam\_role\_ecs\_task](#module\_iam\_role\_ecs\_task) | git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-assumable-role | f37809108f86d8fbdf17f735df734bf4abe69315 |
| <a name="module_iam_role_ecs_task_execution"></a> [iam\_role\_ecs\_task\_execution](#module\_iam\_role\_ecs\_task\_execution) | git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-assumable-role | f37809108f86d8fbdf17f735df734bf4abe69315 |
| <a name="module_nlb"></a> [nlb](#module\_nlb) | git::https://github.com/terraform-aws-modules/terraform-aws-alb.git | 3e9c6cbaf4c1d858c3bbee6f086f0c8ef17522ab |
| <a name="module_ssm_embed_model_id"></a> [ssm\_embed\_model\_id](#module\_ssm\_embed\_model\_id) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_ssm_model_api_key"></a> [ssm\_model\_api\_key](#module\_ssm\_model\_api\_key) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_ssm_model_id"></a> [ssm\_model\_id](#module\_ssm\_model\_id) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_ssm_redis_host"></a> [ssm\_redis\_host](#module\_ssm\_redis\_host) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |

## Resources

| Name | Type |
|------|------|
| [aws_api_gateway_account.chatbotapi](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_account) | resource |
| [aws_api_gateway_api_key.chatbotapi](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_api_key) | resource |
| [aws_api_gateway_deployment.chatbotapi](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_deployment) | resource |
| [aws_api_gateway_method_settings.chatbotapi](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method_settings) | resource |
| [aws_api_gateway_rest_api.chatbotapi](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_rest_api) | resource |
| [aws_api_gateway_stage.chatbotapi](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_stage) | resource |
| [aws_api_gateway_usage_plan.chatbotapi](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_usage_plan) | resource |
| [aws_api_gateway_usage_plan_key.chatbotapi](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_usage_plan_key) | resource |
| [aws_api_gateway_vpc_link.chatbotapi](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_vpc_link) | resource |
| [aws_appautoscaling_scheduled_action.scale_down](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_scheduled_action) | resource |
| [aws_appautoscaling_scheduled_action.scale_down_weekend](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_scheduled_action) | resource |
| [aws_appautoscaling_scheduled_action.scale_up](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_scheduled_action) | resource |
| [aws_appautoscaling_target.ecs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_target) | resource |
| [aws_dynamodb_table.queries](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/dynamodb_table) | resource |
| [aws_dynamodb_table.sessions](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/dynamodb_table) | resource |
| [aws_ecs_task_definition.chatbotapi](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_task_definition) | resource |
| [aws_iam_role.apigateway_cloudwatch](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy.apigateway_cloudwatch](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_security_group.ecs_chatbotapi](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.nlb](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group_rule.ecs_chatbotapi_egress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.ecs_to_redis_nlb_ingress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.nlb_egress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.nlb_ingress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.nlb_to_ecs_ingress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy_document.apigateway_assume_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.apigateway_cloudwatch](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.ecs_task_dynamodb](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.ecs_task_execution_ssm](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.ecs_task_ssm](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_dns_domain_name"></a> [dns\_domain\_name](#input\_dns\_domain\_name) | DNS domain for the Developer Portal product | `string` | n/a | yes |
| <a name="input_environment"></a> [environment](#input\_environment) | Environment (dev, uat, prod) | `string` | n/a | yes |
| <a name="input_redis_host"></a> [redis\_host](#input\_redis\_host) | The Redis host (NLB DNS name from the chatbot module) | `string` | n/a | yes |
| <a name="input_redis_nlb_security_group_id"></a> [redis\_nlb\_security\_group\_id](#input\_redis\_nlb\_security\_group\_id) | Security group ID of the Redis NLB to add ingress rule for this module's ECS tasks | `string` | n/a | yes |
| <a name="input_vpc"></a> [vpc](#input\_vpc) | The VPC used to deploy the resources | <pre>object({<br/>    id              = string<br/>    private_subnets = list(string)<br/>  })</pre> | n/a | yes |
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | AWS region to create resources | `string` | `"eu-south-1"` | no |
| <a name="input_ecs_chatbotapi"></a> [ecs\_chatbotapi](#input\_ecs\_chatbotapi) | ECS task configuration for the chatbot API | <pre>object({<br/>    cpu       = optional(number, 1024)<br/>    memory    = optional(number, 2048)<br/>    image_tag = optional(string, "latest")<br/>  })</pre> | <pre>{<br/>  "cpu": 1024,<br/>  "image_tag": "latest",<br/>  "memory": 2048<br/>}</pre> | no |
| <a name="input_enable_scheduled_scaling"></a> [enable\_scheduled\_scaling](#input\_enable\_scheduled\_scaling) | Enable scheduled autoscaling to scale down to 0 outside working hours (Mon-Fri 09:00-19:00 CET) | `bool` | `false` | no |
| <a name="input_redis_port"></a> [redis\_port](#input\_redis\_port) | The Redis port | `number` | `6379` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_api_gateway_invoke_url"></a> [api\_gateway\_invoke\_url](#output\_api\_gateway\_invoke\_url) | The invoke URL of the API Gateway stage |
| <a name="output_api_key_id"></a> [api\_key\_id](#output\_api\_key\_id) | The ID of the API key |
| <a name="output_api_key_value"></a> [api\_key\_value](#output\_api\_key\_value) | The value of the API key |
| <a name="output_ecr_repository_url"></a> [ecr\_repository\_url](#output\_ecr\_repository\_url) | The URL of the ECR repository |
| <a name="output_ecs_cluster_arn"></a> [ecs\_cluster\_arn](#output\_ecs\_cluster\_arn) | The ARN of the ECS cluster |
