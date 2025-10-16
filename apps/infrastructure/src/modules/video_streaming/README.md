## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 5.33.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 5.33.0 |
| <a name="provider_random"></a> [random](#provider\_random) | n/a |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_iam_policy.ivs_recording_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role.ivs_recording_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.ivs_recording_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_ivs_channel.channels](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ivs_channel) | resource |
| [aws_ivs_recording_configuration.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ivs_recording_configuration) | resource |
| [aws_s3_bucket.ivs_recordings](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket) | resource |
| [random_id.suffix](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/id) | resource |
| [aws_ivs_stream_key.channels](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/ivs_stream_key) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_project_name"></a> [project\_name](#input\_project\_name) | A name for the project to prefix resources. | `string` | n/a | yes |
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | The AWS region to deploy resources in. | `string` | `"eu-central-1"` | no |
| <a name="input_ivs_channels"></a> [ivs\_channels](#input\_ivs\_channels) | A map of IVS channels to create. The key will be used for resource identification. | <pre>map(object({<br/>    name         = string<br/>    latency_mode = optional(string, "LOW")<br/>    type         = optional(string, "STANDARD")<br/>  }))</pre> | `{}` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_ivs_channel_details"></a> [ivs\_channel\_details](#output\_ivs\_channel\_details) | A map containing the details for each created IVS channel. |
| <a name="output_s3_recording_bucket_name"></a> [s3\_recording\_bucket\_name](#output\_s3\_recording\_bucket\_name) | The name of the S3 bucket where all recordings will be stored. |
