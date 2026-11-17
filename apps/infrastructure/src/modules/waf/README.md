<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 6.67.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 6.67.0 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_cloudwatch_metric_alarm.counted_requests](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_wafv2_web_acl.public_albs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/wafv2_web_acl) | resource |
| [aws_wafv2_web_acl_association.public_albs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/wafv2_web_acl_association) | resource |
| [aws_region.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_alerting"></a> [alerting](#input\_alerting) | Optional SNS destination and per-minute CountedRequests alarm thresholds for a regional web ACL | <pre>object({<br/>    topic_arn                  = string<br/>    ip_rate_limit_threshold    = optional(number, 100)<br/>    known_bad_inputs_threshold = optional(number, 25)<br/>  })</pre> | `null` | no |
| <a name="input_associated_resource_arns"></a> [associated\_resource\_arns](#input\_associated\_resource\_arns) | Map of stable resource keys to regional resource ARNs; CloudFront associations are configured on the distribution | `map(string)` | `{}` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | Environment used to name the web ACL | `string` | n/a | yes |
| <a name="input_metric_name_prefix"></a> [metric\_name\_prefix](#input\_metric\_name\_prefix) | Optional prefix for WAF CloudWatch metric names | `string` | `null` | no |
| <a name="input_name"></a> [name](#input\_name) | Optional name for the web ACL | `string` | `null` | no |
| <a name="input_rate_limit"></a> [rate\_limit](#input\_rate\_limit) | Requests per IP during the rate-based rule's 60-second evaluation window | `number` | `100` | no |
| <a name="input_scope"></a> [scope](#input\_scope) | WAF scope: REGIONAL for regional resources or CLOUDFRONT for CloudFront distributions | `string` | `"REGIONAL"` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Tags applied to the web ACL | `map(string)` | `{}` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_web_acl_arn"></a> [web\_acl\_arn](#output\_web\_acl\_arn) | ARN of the WAF web ACL |
<!-- END_TF_DOCS -->