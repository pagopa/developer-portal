## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 6.28.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 6.28.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_codebuild"></a> [codebuild](#module\_codebuild) | pagopa-dx/github-selfhosted-runner-on-codebuild/aws | ~> 1.1.0 |

## Resources

| Name | Type |
|------|------|
| [aws_iam_policy.deploy_website](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.github_chatbot_reindex](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.github_deploy_opennext](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role.github_chatbot_reindex](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.github_deploy_opennext](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.code_build_deploy_opennext](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.deploy_website](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.github_chatbot_reindex](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.github_deploy_opennext](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_security_group_rule.codebuild_redis_ingress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_assets_opennext_bucket"></a> [assets\_opennext\_bucket](#input\_assets\_opennext\_bucket) | The S3 bucket used to store the assets | <pre>object({<br/>    name = string<br/>    arn  = string<br/>  })</pre> | n/a | yes |
| <a name="input_environment"></a> [environment](#input\_environment) | Environment | `string` | n/a | yes |
| <a name="input_environment_information"></a> [environment\_information](#input\_environment\_information) | n/a | <pre>object({<br/>    prefix          = string<br/>    env_short       = string<br/>    location        = string<br/>    domain          = optional(string)<br/>    app_name        = string<br/>    instance_number = string<br/>  })</pre> | n/a | yes |
| <a name="input_github_repository"></a> [github\_repository](#input\_github\_repository) | The repository where the IaC workflows will run | `string` | n/a | yes |
| <a name="input_lambda_code_opennext_bucket"></a> [lambda\_code\_opennext\_bucket](#input\_lambda\_code\_opennext\_bucket) | The S3 bucket used to store the lambda code | <pre>object({<br/>    name = string<br/>    arn  = string<br/>  })</pre> | n/a | yes |
| <a name="input_lambda_initializer_arn"></a> [lambda\_initializer\_arn](#input\_lambda\_initializer\_arn) | The ARN of the lambda initializer function | `string` | n/a | yes |
| <a name="input_opennext_cdn_distribution_id"></a> [opennext\_cdn\_distribution\_id](#input\_opennext\_cdn\_distribution\_id) | The ID of the CloudFront distribution used to serve the OpenNext website | `string` | n/a | yes |
| <a name="input_security_groups"></a> [security\_groups](#input\_security\_groups) | The security groups used to deploy the resources | `map(string)` | n/a | yes |
| <a name="input_vpc"></a> [vpc](#input\_vpc) | The VPC used to deploy the resources | <pre>object({<br/>    id                  = string<br/>    cidr_block          = string<br/>    public_subnets      = list(string)<br/>    database_subnets    = list(string)<br/>    private_subnets     = list(string)<br/>    elasticache_subnets = list(string)<br/>  })</pre> | n/a | yes |
| <a name="input_website_standalone_bucket"></a> [website\_standalone\_bucket](#input\_website\_standalone\_bucket) | The S3 bucket used to store the website in standalone mode | <pre>object({<br/>    name = string<br/>    arn  = string<br/>  })</pre> | n/a | yes |
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | AWS region to create resources. Default Milan | `string` | `"eu-south-1"` | no |
| <a name="input_build_timeout"></a> [build\_timeout](#input\_build\_timeout) | The timeout for the build process in minutes | `number` | `480` | no |
| <a name="input_chatbot_env_vars"></a> [chatbot\_env\_vars](#input\_chatbot\_env\_vars) | Chatbot environment variables | `map(string)` | `{}` | no |
| <a name="input_create_chatbot"></a> [create\_chatbot](#input\_create\_chatbot) | Defines if chatbot should be created | `bool` | `false` | no |
| <a name="input_module"></a> [module](#input\_module) | Prefix for resources | `string` | `"cicd"` | no |
| <a name="input_redis_port"></a> [redis\_port](#input\_redis\_port) | Redis port | `number` | `6379` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | n/a | `map(any)` | <pre>{<br/>  "CreatedBy": "Terraform"<br/>}</pre> | no |
| <a name="input_website_is_standalone"></a> [website\_is\_standalone](#input\_website\_is\_standalone) | If true, the website will be deployed in standalone mode (Amplify), otherwise static deployment is used (S3 + Cloudfront) | `bool` | `false` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_iam_role_deploy_standalone_website_arn"></a> [iam\_role\_deploy\_standalone\_website\_arn](#output\_iam\_role\_deploy\_standalone\_website\_arn) | n/a |
