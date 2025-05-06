# docs_redirect

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
| <a name="module_redirect_certificate"></a> [redirect\_certificate](#module\_redirect\_certificate) | git::https://github.com/terraform-aws-modules/terraform-aws-acm.git | 8d0b22f1f242a1b36e29b8cb38aaeac9b887500d |

## Resources

| Name | Type |
|------|------|
| [aws_cloudfront_distribution.redirect](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_distribution) | resource |
| [aws_cloudfront_function.redirect_viewer_request_handler](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_function) | resource |
| [aws_route53_record.google_search_docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route53_record.www_website](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route53_zone.docs_pagopa_it](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_zone) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | AWS region to create resources. Default Milan | `string` | `"eu-south-1"` | no |
| <a name="input_cloudfront_function_code"></a> [cloudfront\_function\_code](#input\_cloudfront\_function\_code) | The code of the cloudfront function | `string` | n/a | yes |
| <a name="input_domain_to_redirect"></a> [domain\_to\_redirect](#input\_domain\_to\_redirect) | Domain to redirect from and to | <pre>object({<br>    from = string<br>    to   = string<br>  })</pre> | <pre>{<br>  "from": "docs.pagopa.it",<br>  "to": "developer.pagopa.it"<br>}</pre> | no |
| <a name="input_environment"></a> [environment](#input\_environment) | Environment | `string` | n/a | yes |
| <a name="input_tags"></a> [tags](#input\_tags) | n/a | `map(any)` | <pre>{<br>  "CreatedBy": "Terraform"<br>}</pre> | no |
| <a name="input_use_custom_certificate"></a> [use\_custom\_certificate](#input\_use\_custom\_certificate) | Use custom certificate for the cloudfront distribution | `bool` | `true` | no |

## Outputs

No outputs.
<!-- END_TF_DOCS -->
