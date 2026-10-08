# AWS DevOps Agent

Manages the agent space, its IAM operator application, the monitoring-account
association, and both IAM roles and their policies. The root module enables this
module only when `environment == "prod"` and `create_devops_agent` is true. Both
providers are mapped to `eu-central-1`; the monitored resources can be in other
regions of the same account.

## Adopt the existing production agent

The read-only AWS API discovery found agent space
`836efc07-3442-4698-a069-14aa021abb4b` and monitoring association
`bd2b0d87-6590-4445-95d2-20b108bfc757`. There are no other associations.
The existing IAM roles use the suffix `1efc2e23`, which must remain unchanged to
avoid replacing them. The monitoring role has both `AllowCreateServiceLinkedRoles`
and `AllowPricingReadOnly` inline policies.

The root `devops_agent_imports.tf` contains eight declarative imports, gated by
the same production-only condition as the module. Imports already present in
state are skipped automatically. The association's Cloud Control import ID is
`agent_space_id|association_id`, not just the association UUID.

From `apps/infrastructure/src`, using production AWS credentials:

```sh
./terraform.sh init prod
./terraform.sh plan prod -target='module.devops_agent'
```

Review the plan before applying. The intended AWS change during adoption is to
add the standard cost-allocation tags to the previously untagged agent space.
The existing IAM roles, trust policies, policy attachments, inline policies,
operator application, and account-wide monitoring scope are preserved.
No cross-account roles, example Lambda functions, or GitHub associations are
created.

The existing production state already manages seven of the eight imported AWS
resources; only `AllowPricingReadOnly` needs importing. The legacy random suffix
is forgotten from state without destroying anything, and its value is now
explicit in the module call. The existing IAM propagation delay is retained.

```sh
./terraform.sh apply prod -target='module.devops_agent'
./terraform.sh plan prod
```

The targeted apply imports only this module and adds the agent-space tags; the
subsequent full plan checks for remaining infrastructure changes. Review those
separately. No import or apply is performed merely by checking in this code.

AWSCC is pinned to the `1.105` patch series, with registry-generated checksums
in the root lock file. This version exposes agent-space tags and the current
DevOps Agent resource schemas.

<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 6.67.0 |
| <a name="requirement_awscc"></a> [awscc](#requirement\_awscc) | >= 1.105.0 |
| <a name="requirement_time"></a> [time](#requirement\_time) | >= 0.14.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 6.67.0 |
| <a name="provider_awscc"></a> [awscc](#provider\_awscc) | >= 1.105.0 |
| <a name="provider_time"></a> [time](#provider\_time) | >= 0.14.0 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_iam_role.devops_agentspace](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.devops_operator](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy.devops_agentspace_inline](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_iam_role_policy.devops_agentspace_pricing](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_iam_role_policy_attachment.devops_agentspace_access](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.devops_operator_access](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [awscc_devopsagent_agent_space.main](https://registry.terraform.io/providers/hashicorp/awscc/latest/docs/resources/devopsagent_agent_space) | resource |
| [awscc_devopsagent_association.primary_aws_account](https://registry.terraform.io/providers/hashicorp/awscc/latest/docs/resources/devopsagent_association) | resource |
| [time_sleep.wait_for_iam_propagation](https://registry.terraform.io/providers/hashicorp/time/latest/docs/resources/sleep) | resource |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy_document.devops_agentspace_inline](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.devops_agentspace_pricing](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.devops_agentspace_trust](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.devops_operator_trust](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_partition.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/partition) | data source |
| [aws_region.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_agent_space_description"></a> [agent\_space\_description](#input\_agent\_space\_description) | Description of the DevOps Agent Space. | `string` | n/a | yes |
| <a name="input_agent_space_name"></a> [agent\_space\_name](#input\_agent\_space\_name) | Name of the DevOps Agent Space. | `string` | n/a | yes |
| <a name="input_name_postfix"></a> [name\_postfix](#input\_name\_postfix) | Stable suffix for both IAM role names. Preserve the existing suffix when importing. | `string` | n/a | yes |
| <a name="input_tags"></a> [tags](#input\_tags) | Cost-allocation and ownership tags for the agent space and IAM roles. | `map(string)` | n/a | yes |

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
<!-- END_TF_DOCS -->