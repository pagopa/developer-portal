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
| [aws_wafv2_web_acl.public_albs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/wafv2_web_acl) | resource |
| [aws_wafv2_web_acl_association.public_albs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/wafv2_web_acl_association) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_environment"></a> [environment](#input\_environment) | Environment used to name the web ACL | `string` | n/a | yes |
| <a name="input_associated_resource_arns"></a> [associated\_resource\_arns](#input\_associated\_resource\_arns) | ARNs of regional resources to associate with this web ACL; CloudFront associations are configured on the distribution | `set(string)` | `[]` | no |
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