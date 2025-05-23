# core

<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 5.33.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 5.33.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_active_campaign_dns_records"></a> [active\_campaign\_dns\_records](#module\_active\_campaign\_dns\_records) | git::https://github.com/terraform-aws-modules/terraform-aws-route53.git//modules/records | bc63328714550fd903d2574b263833c9ce1c867e |
| <a name="module_ses_developer_pagopa_it"></a> [ses\_developer\_pagopa\_it](#module\_ses\_developer\_pagopa\_it) | git::github.com/pagopa/terraform-aws-ses.git | 58c1263afa441692e67d1be5dca809e65d6852df |

## Resources

| Name | Type |
|------|------|
| [aws_iam_group.developers_read_only](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_group) | resource |
| [aws_iam_group_policy_attachment.read_only](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_group_policy_attachment) | resource |
| [aws_route53_record.chatbot_ns](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route53_record.devportal_delegate](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route53_record.devportal_google_site_verification_txt](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route53_record.devportal_ses_dkim_cname](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route53_record.devportal_ses_dkim_txt](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route53_zone.chatbot](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_zone) | resource |
| [aws_route53_zone.dev_portal](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_zone) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_ac_integration_is_enabled"></a> [ac\_integration\_is\_enabled](#input\_ac\_integration\_is\_enabled) | Defines if Active Campaign integration should be enabled | `bool` | `false` | no |
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | AWS region to create resources. Default Milan | `string` | `"eu-south-1"` | no |
| <a name="input_create_chatbot"></a> [create\_chatbot](#input\_create\_chatbot) | Defines if chatbot should be created | `bool` | `false` | no |
| <a name="input_dns_chatbot_domain_prefix"></a> [dns\_chatbot\_domain\_prefix](#input\_dns\_chatbot\_domain\_prefix) | DNS chatbot domain prefix | `string` | `"chatbot"` | no |
| <a name="input_dns_delegate_records"></a> [dns\_delegate\_records](#input\_dns\_delegate\_records) | DNS delegate records | `map(any)` | `{}` | no |
| <a name="input_dns_domain_name"></a> [dns\_domain\_name](#input\_dns\_domain\_name) | DNS domain for the Developer Portal product | `string` | n/a | yes |
| <a name="input_environment"></a> [environment](#input\_environment) | Environment | `string` | n/a | yes |
| <a name="input_tags"></a> [tags](#input\_tags) | n/a | `map(any)` | <pre>{<br>  "CreatedBy": "Terraform"<br>}</pre> | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_dns_chatbot_hosted_zone"></a> [dns\_chatbot\_hosted\_zone](#output\_dns\_chatbot\_hosted\_zone) | n/a |
| <a name="output_hosted_zone_id"></a> [hosted\_zone\_id](#output\_hosted\_zone\_id) | n/a |
| <a name="output_name_servers_records"></a> [name\_servers\_records](#output\_name\_servers\_records) | n/a |
| <a name="output_ses_domain_identity_arn"></a> [ses\_domain\_identity\_arn](#output\_ses\_domain\_identity\_arn) | n/a |
<!-- END_TF_DOCS -->
