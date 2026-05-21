## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 5.33.0 |
| <a name="requirement_awscc"></a> [awscc](#requirement\_awscc) | >= 1.84.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_archive"></a> [archive](#provider\_archive) | n/a |
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 5.33.0 |
| <a name="provider_aws.service"></a> [aws.service](#provider\_aws.service) | >= 5.33.0 |
| <a name="provider_awscc"></a> [awscc](#provider\_awscc) | >= 1.84.0 |
| <a name="provider_random"></a> [random](#provider\_random) | n/a |
| <a name="provider_time"></a> [time](#provider\_time) | n/a |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_iam_role.devops_agentspace](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.devops_operator](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.echo_service_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.secondary_account](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy.devops_agentspace_inline](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_iam_role_policy.secondary_account_inline](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_iam_role_policy_attachment.devops_agentspace_access](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.devops_operator_access](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.echo_service_basic](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.secondary_account_access](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_lambda_function.echo_service](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [awscc_devopsagent_agent_space.main](https://registry.terraform.io/providers/hashicorp/awscc/latest/docs/resources/devopsagent_agent_space) | resource |
| [awscc_devopsagent_association.primary_aws_account](https://registry.terraform.io/providers/hashicorp/awscc/latest/docs/resources/devopsagent_association) | resource |
| [awscc_devopsagent_association.secondary_aws_account](https://registry.terraform.io/providers/hashicorp/awscc/latest/docs/resources/devopsagent_association) | resource |
| [random_id.suffix](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/id) | resource |
| [time_sleep.wait_for_iam_propagation](https://registry.terraform.io/providers/hashicorp/time/latest/docs/resources/sleep) | resource |
| [archive_file.echo_lambda](https://registry.terraform.io/providers/hashicorp/archive/latest/docs/data-sources/file) | data source |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy_document.devops_agentspace_inline](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.devops_agentspace_trust](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.devops_operator_trust](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.lambda_trust](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.secondary_account_inline](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.secondary_account_trust](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_agent_space_name"></a> [agent\_space\_name](#input\_agent\_space\_name) | Name for the DevOps Agent Space | `string` | n/a | yes |
| <a name="input_tags"></a> [tags](#input\_tags) | Tags to apply to resources | `map(string)` | n/a | yes |
| <a name="input_agent_space_arn"></a> [agent\_space\_arn](#input\_agent\_space\_arn) | ARN of the Agent Space from the primary deployment. Required before deploying the service account resources. | `string` | `""` | no |
| <a name="input_agent_space_description"></a> [agent\_space\_description](#input\_agent\_space\_description) | Description for the DevOps Agent Space | `string` | `"AgentSpace for monitoring my application"` | no |
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | AWS region for DevOps Agent deployment | `string` | `"eu-central-1"` | no |
| <a name="input_name_postfix"></a> [name\_postfix](#input\_name\_postfix) | Postfix for resource names to ensure uniqueness | `string` | `""` | no |
| <a name="input_service_account_id"></a> [service\_account\_id](#input\_service\_account\_id) | Account ID of the secondary (service) account for cross-account monitoring. Leave empty to skip. | `string` | `""` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_agent_space_arn"></a> [agent\_space\_arn](#output\_agent\_space\_arn) | The ARN of the created Agent Space |
| <a name="output_agent_space_id"></a> [agent\_space\_id](#output\_agent\_space\_id) | The ID of the created Agent Space |
| <a name="output_agent_space_name"></a> [agent\_space\_name](#output\_agent\_space\_name) | The name of the created Agent Space |
| <a name="output_aws_region"></a> [aws\_region](#output\_aws\_region) | AWS region |
| <a name="output_devops_agentspace_role_arn"></a> [devops\_agentspace\_role\_arn](#output\_devops\_agentspace\_role\_arn) | ARN of the DevOps Agent Space IAM role |
| <a name="output_devops_operator_role_arn"></a> [devops\_operator\_role\_arn](#output\_devops\_operator\_role\_arn) | ARN of the DevOps Operator App IAM role |
| <a name="output_primary_account_association_id"></a> [primary\_account\_association\_id](#output\_primary\_account\_association\_id) | ID of the primary AWS account association |
| <a name="output_primary_account_id"></a> [primary\_account\_id](#output\_primary\_account\_id) | Primary (monitoring) account ID |
| <a name="output_secondary_account_association_id"></a> [secondary\_account\_association\_id](#output\_secondary\_account\_association\_id) | ID of the secondary AWS account association |
| <a name="output_secondary_account_role_arn"></a> [secondary\_account\_role\_arn](#output\_secondary\_account\_role\_arn) | ARN of the Secondary Account Role for Agent Space |
