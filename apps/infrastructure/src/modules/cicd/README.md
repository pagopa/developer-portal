# cicd

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
| <a name="module_codebuild"></a> [codebuild](#module\_codebuild) | github.com/pagopa/dx//infra/modules/github_selfhosted_runner_on_codebuild | self-hosted-runner-on-aws-module |

## Resources

| Name | Type |
|------|------|
| [aws_iam_policy.deploy_website](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role_policy_attachment.deploy_website](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_security_group_rule.codebuild_redis_ingress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | AWS region to create resources. Default Milan | `string` | `"eu-south-1"` | no |
| <a name="input_build_timeout"></a> [build\_timeout](#input\_build\_timeout) | The timeout for the build process in minutes | `number` | `480` | no |
| <a name="input_chatbot_env_vars"></a> [chatbot\_env\_vars](#input\_chatbot\_env\_vars) | Chatbot environment variables | `map(string)` | `{}` | no |
| <a name="input_create_chatbot"></a> [create\_chatbot](#input\_create\_chatbot) | Defines if chatbot should be created | `bool` | `false` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | Environment | `string` | n/a | yes |
| <a name="input_environment_information"></a> [environment\_information](#input\_environment\_information) | n/a | <pre>object({<br>    prefix          = string<br>    env_short       = string<br>    location        = string<br>    domain          = optional(string)<br>    app_name        = string<br>    instance_number = string<br>  })</pre> | n/a | yes |
| <a name="input_github_repository"></a> [github\_repository](#input\_github\_repository) | The repository where the IaC workflows will run | `string` | n/a | yes |
| <a name="input_module"></a> [module](#input\_module) | Prefix for resources | `string` | `"cicd"` | no |
| <a name="input_redis_port"></a> [redis\_port](#input\_redis\_port) | Redis port | `number` | `6379` | no |
| <a name="input_security_groups"></a> [security\_groups](#input\_security\_groups) | The security groups used to deploy the resources | `map(string)` | n/a | yes |
| <a name="input_tags"></a> [tags](#input\_tags) | n/a | `map(any)` | <pre>{<br>  "CreatedBy": "Terraform"<br>}</pre> | no |
| <a name="input_vpc"></a> [vpc](#input\_vpc) | The VPC used to deploy the resources | <pre>object({<br>    id                  = string<br>    cidr_block          = string<br>    public_subnets      = list(string)<br>    database_subnets    = list(string)<br>    private_subnets     = list(string)<br>    elasticache_subnets = list(string)<br>  })</pre> | n/a | yes |
| <a name="input_website_bucket"></a> [website\_bucket](#input\_website\_bucket) | The S3 bucket used to store the website | <pre>object({<br>    name = string<br>    arn  = string<br>  })</pre> | n/a | yes |
| <a name="input_website_cdn"></a> [website\_cdn](#input\_website\_cdn) | The CloudFront distribution used to serve the website | <pre>object({<br>    arn = string<br>  })</pre> | n/a | yes |
| <a name="input_website_is_standalone"></a> [website\_is\_standalone](#input\_website\_is\_standalone) | If true, the website will be deployed in standalone mode (Amplify), otherwise static deployment is used (S3 + Cloudfront) | `bool` | `false` | no |

## Outputs

No outputs.
<!-- END_TF_DOCS -->
