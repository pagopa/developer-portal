<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.7 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 6.67.0 |
| <a name="requirement_awscc"></a> [awscc](#requirement\_awscc) | >= 1.84.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 6.67.0 |
| <a name="provider_awscc"></a> [awscc](#provider\_awscc) | >= 1.84.0 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_cloudwatch_log_group.heartbeat](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_iam_policy.heartbeat](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role.heartbeat](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.heartbeat](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_s3_bucket.artifacts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket) | resource |
| [aws_s3_bucket_lifecycle_configuration.artifacts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_lifecycle_configuration) | resource |
| [aws_s3_bucket_public_access_block.artifacts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_public_access_block) | resource |
| [aws_s3_bucket_server_side_encryption_configuration.artifacts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_server_side_encryption_configuration) | resource |
| [awscc_synthetics_canary.heartbeat](https://registry.terraform.io/providers/hashicorp/awscc/latest/docs/resources/synthetics_canary) | resource |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_partition.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/partition) | data source |
| [aws_region.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_artifact_bucket_name"></a> [artifact\_bucket\_name](#input\_artifact\_bucket\_name) | Name of the S3 bucket containing canary run artifacts. | `string` | n/a | yes |
| <a name="input_artifact_prefix"></a> [artifact\_prefix](#input\_artifact\_prefix) | S3 key prefix for this canary's run artifacts. | `string` | n/a | yes |
| <a name="input_execution_policy_name"></a> [execution\_policy\_name](#input\_execution\_policy\_name) | Name of the canary's IAM execution policy. | `string` | n/a | yes |
| <a name="input_execution_role_name"></a> [execution\_role\_name](#input\_execution\_role\_name) | Name of the canary's IAM execution role. | `string` | n/a | yes |
| <a name="input_log_group_names"></a> [log\_group\_names](#input\_log\_group\_names) | Existing Lambda log group names, keyed by browser. | `map(string)` | n/a | yes |
| <a name="input_memory_in_mb"></a> [memory\_in\_mb](#input\_memory\_in\_mb) | Memory allocated to each canary run. | `number` | `1500` | no |
| <a name="input_name"></a> [name](#input\_name) | Name of the Synthetics canary. | `string` | n/a | yes |
| <a name="input_runtime_version"></a> [runtime\_version](#input\_runtime\_version) | Synthetics Puppeteer runtime version. | `string` | `"syn-nodejs-puppeteer-18.0"` | no |
| <a name="input_schedule_expression"></a> [schedule\_expression](#input\_schedule\_expression) | Rate or cron expression controlling canary runs. | `string` | `"rate(10 minutes)"` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Cost allocation and ownership tags. | `map(string)` | n/a | yes |
| <a name="input_timeout_in_seconds"></a> [timeout\_in\_seconds](#input\_timeout\_in\_seconds) | Maximum duration of each canary run. | `number` | `600` | no |
| <a name="input_urls"></a> [urls](#input\_urls) | Ordered list of URLs checked by the heartbeat. | `list(string)` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_artifact_bucket_name"></a> [artifact\_bucket\_name](#output\_artifact\_bucket\_name) | S3 bucket storing canary run artifacts. |
| <a name="output_canary_name"></a> [canary\_name](#output\_canary\_name) | Name of the heartbeat canary. |
<!-- END_TF_DOCS -->