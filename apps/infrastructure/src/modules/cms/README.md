## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 6.28.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 6.28.0 |
| <a name="provider_random"></a> [random](#provider\_random) | n/a |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_cloudfront_cms"></a> [cloudfront\_cms](#module\_cloudfront\_cms) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudfront.git | ed0f1f983f606304e00ad9f48399bd2fe0b79233 |
| <a name="module_cms_dns_records"></a> [cms\_dns\_records](#module\_cms\_dns\_records) | git::https://github.com/terraform-aws-modules/terraform-aws-route53.git//modules/records | bc63328714550fd903d2574b263833c9ce1c867e |
| <a name="module_cms_ecs_cluster"></a> [cms\_ecs\_cluster](#module\_cms\_ecs\_cluster) | git::https://github.com/terraform-aws-modules/terraform-aws-ecs.git//modules/cluster | 8b97783def49997d18a6fcb00dc21ce1edc0f538 |
| <a name="module_cms_ecs_service"></a> [cms\_ecs\_service](#module\_cms\_ecs\_service) | git::https://github.com/terraform-aws-modules/terraform-aws-ecs.git//modules/service | 378d0cb7e8fde47e8ddf58461ed1974486dbbd5d |
| <a name="module_cms_load_balancer"></a> [cms\_load\_balancer](#module\_cms\_load\_balancer) | git::https://github.com/terraform-aws-modules/terraform-aws-alb.git | 3e9c6cbaf4c1d858c3bbee6f086f0c8ef17522ab |
| <a name="module_cms_load_balancer_internal"></a> [cms\_load\_balancer\_internal](#module\_cms\_load\_balancer\_internal) | git::https://github.com/terraform-aws-modules/terraform-aws-alb.git | 3e9c6cbaf4c1d858c3bbee6f086f0c8ef17522ab |
| <a name="module_cms_log_group"></a> [cms\_log\_group](#module\_cms\_log\_group) | git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/log-group | bf969da953bdbea229392255d2b36e7b720e917e |
| <a name="module_cms_rds"></a> [cms\_rds](#module\_cms\_rds) | git::https://github.com/terraform-aws-modules/terraform-aws-rds-aurora.git | 7bf5933100eb355b13854232e5d63c62ea7cad35 |
| <a name="module_cms_ssl_certificate"></a> [cms\_ssl\_certificate](#module\_cms\_ssl\_certificate) | git::https://github.com/terraform-aws-modules/terraform-aws-acm.git | 5d113fa07675fc42237907a621b68ac97109043e |
| <a name="module_ecr"></a> [ecr](#module\_ecr) | git::https://github.com/terraform-aws-modules/terraform-aws-ecr.git | 9f4b587846551110b0db199ea5599f016570fefe |
| <a name="module_iam_policy_cms"></a> [iam\_policy\_cms](#module\_iam\_policy\_cms) | git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-policy | f37809108f86d8fbdf17f735df734bf4abe69315 |
| <a name="module_iam_policy_ecs_task_execution"></a> [iam\_policy\_ecs\_task\_execution](#module\_iam\_policy\_ecs\_task\_execution) | git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-policy | f37809108f86d8fbdf17f735df734bf4abe69315 |
| <a name="module_iam_policy_ecs_task_role_s3"></a> [iam\_policy\_ecs\_task\_role\_s3](#module\_iam\_policy\_ecs\_task\_role\_s3) | git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-policy | f37809108f86d8fbdf17f735df734bf4abe69315 |
| <a name="module_iam_policy_ecs_task_role_ssm"></a> [iam\_policy\_ecs\_task\_role\_ssm](#module\_iam\_policy\_ecs\_task\_role\_ssm) | git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-policy | f37809108f86d8fbdf17f735df734bf4abe69315 |
| <a name="module_iam_role_ecs_task_execution"></a> [iam\_role\_ecs\_task\_execution](#module\_iam\_role\_ecs\_task\_execution) | git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-assumable-role | f37809108f86d8fbdf17f735df734bf4abe69315 |
| <a name="module_iam_role_task_role"></a> [iam\_role\_task\_role](#module\_iam\_role\_task\_role) | git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-assumable-role | f37809108f86d8fbdf17f735df734bf4abe69315 |
| <a name="module_iam_user_cms"></a> [iam\_user\_cms](#module\_iam\_user\_cms) | git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-user | f37809108f86d8fbdf17f735df734bf4abe69315 |
| <a name="module_s3_bucket_cms"></a> [s3\_bucket\_cms](#module\_s3\_bucket\_cms) | git::https://github.com/terraform-aws-modules/terraform-aws-s3-bucket.git | 3a1c80b29fdf8fc682d2749456ec36ecbaf4ce14 |
| <a name="module_secret_cms_access_key_id"></a> [secret\_cms\_access\_key\_id](#module\_secret\_cms\_access\_key\_id) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 28784d318fcb1d5b632e38a4c1f567dd138fcd83 |
| <a name="module_secret_cms_access_key_secret"></a> [secret\_cms\_access\_key\_secret](#module\_secret\_cms\_access\_key\_secret) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 28784d318fcb1d5b632e38a4c1f567dd138fcd83 |
| <a name="module_secret_cms_admin_jwt_secret"></a> [secret\_cms\_admin\_jwt\_secret](#module\_secret\_cms\_admin\_jwt\_secret) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 28784d318fcb1d5b632e38a4c1f567dd138fcd83 |
| <a name="module_secret_cms_api_token_salt"></a> [secret\_cms\_api\_token\_salt](#module\_secret\_cms\_api\_token\_salt) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 28784d318fcb1d5b632e38a4c1f567dd138fcd83 |
| <a name="module_secret_cms_app_keys"></a> [secret\_cms\_app\_keys](#module\_secret\_cms\_app\_keys) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 28784d318fcb1d5b632e38a4c1f567dd138fcd83 |
| <a name="module_secret_cms_database_password"></a> [secret\_cms\_database\_password](#module\_secret\_cms\_database\_password) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 28784d318fcb1d5b632e38a4c1f567dd138fcd83 |
| <a name="module_secret_cms_github_pat"></a> [secret\_cms\_github\_pat](#module\_secret\_cms\_github\_pat) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 28784d318fcb1d5b632e38a4c1f567dd138fcd83 |
| <a name="module_secret_cms_google_gsuite_hd"></a> [secret\_cms\_google\_gsuite\_hd](#module\_secret\_cms\_google\_gsuite\_hd) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 28784d318fcb1d5b632e38a4c1f567dd138fcd83 |
| <a name="module_secret_cms_google_oauth_client_id"></a> [secret\_cms\_google\_oauth\_client\_id](#module\_secret\_cms\_google\_oauth\_client\_id) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 28784d318fcb1d5b632e38a4c1f567dd138fcd83 |
| <a name="module_secret_cms_google_oauth_client_secret"></a> [secret\_cms\_google\_oauth\_client\_secret](#module\_secret\_cms\_google\_oauth\_client\_secret) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 28784d318fcb1d5b632e38a4c1f567dd138fcd83 |
| <a name="module_secret_cms_jwt_secret"></a> [secret\_cms\_jwt\_secret](#module\_secret\_cms\_jwt\_secret) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 28784d318fcb1d5b632e38a4c1f567dd138fcd83 |
| <a name="module_secret_cms_transfer_token_salt"></a> [secret\_cms\_transfer\_token\_salt](#module\_secret\_cms\_transfer\_token\_salt) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 28784d318fcb1d5b632e38a4c1f567dd138fcd83 |
| <a name="module_strapi_media_library_ssl_certificate"></a> [strapi\_media\_library\_ssl\_certificate](#module\_strapi\_media\_library\_ssl\_certificate) | git::https://github.com/terraform-aws-modules/terraform-aws-acm.git | 5d113fa07675fc42237907a621b68ac97109043e |
| <a name="module_vpc"></a> [vpc](#module\_vpc) | git::https://github.com/terraform-aws-modules/terraform-aws-vpc.git | 7666869d9ca7ff658f5bd10a29dea53bde5dc464 |

## Resources

| Name | Type |
|------|------|
| [aws_ecs_task_definition.cms_task_def](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_task_definition) | resource |
| [aws_iam_policy.deploy_cms](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role.deploy_cms](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.deploy_cms](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_route53_record.certificate](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route53_record.cms_internal](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route53_record.strapi_media_library](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route53_zone.internal](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_zone) | resource |
| [aws_security_group.cms_database](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.cms_lb](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.ecs_tasks](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.vpc_endpoints](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group_rule.vpc_endpoints](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_vpc_endpoint.ecr_api](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc_endpoint) | resource |
| [aws_vpc_endpoint.s3](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc_endpoint) | resource |
| [aws_vpc_endpoint.ssmmessages](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc_endpoint) | resource |
| [random_integer.bucket_random_integer](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/integer) | resource |
| [random_password.cms_admin_jwt_secret](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password) | resource |
| [random_password.cms_api_token_salt](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password) | resource |
| [random_password.cms_app_keys](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password) | resource |
| [random_password.cms_database_password](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password) | resource |
| [random_password.cms_github_pat](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password) | resource |
| [random_password.cms_jwt_secret](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password) | resource |
| [random_password.cms_transfer_token_salt](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password) | resource |
| [aws_availability_zones.available](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/availability_zones) | data source |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy_document.deploy_github](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.ecs_task_execution](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.ecs_task_role_s3](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.ecs_task_role_ssm](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.s3_iam_policy_cms](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_cms_app_image_tag"></a> [cms\_app\_image\_tag](#input\_cms\_app\_image\_tag) | Docker image tag for the CMS Strapi application | `string` | n/a | yes |
| <a name="input_dns_domain_name"></a> [dns\_domain\_name](#input\_dns\_domain\_name) | DNS domain for the Developer Portal product | `string` | n/a | yes |
| <a name="input_environment"></a> [environment](#input\_environment) | Environment | `string` | n/a | yes |
| <a name="input_github_repository"></a> [github\_repository](#input\_github\_repository) | The repository where the IaC workflows will run | `string` | n/a | yes |
| <a name="input_hosted_zone_id"></a> [hosted\_zone\_id](#input\_hosted\_zone\_id) | The ID of the hosted zone to create the public DNS records in | `string` | n/a | yes |
| <a name="input_ac_api_key_param"></a> [ac\_api\_key\_param](#input\_ac\_api\_key\_param) | Active Campaign API key SSM parameter ARN | `string` | `null` | no |
| <a name="input_ac_base_url_param"></a> [ac\_base\_url\_param](#input\_ac\_base\_url\_param) | Active Campaign base URL SSM parameter ARN | `string` | `null` | no |
| <a name="input_ac_integration_is_enabled"></a> [ac\_integration\_is\_enabled](#input\_ac\_integration\_is\_enabled) | Enable Active Campaign integration for Strapi | `bool` | `false` | no |
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | AWS region to create resources. Default Milan | `string` | `"eu-south-1"` | no |
| <a name="input_cms_app_cpu"></a> [cms\_app\_cpu](#input\_cms\_app\_cpu) | Fargate instance CPU units to provision (1 vCPU = 1024 CPU units) | `string` | `"1024"` | no |
| <a name="input_cms_app_memory"></a> [cms\_app\_memory](#input\_cms\_app\_memory) | Fargate instance memory to provision (in MiB) | `string` | `"3072"` | no |
| <a name="input_cms_app_port"></a> [cms\_app\_port](#input\_cms\_app\_port) | The standard app port used by CMS Strapi | `number` | `1337` | no |
| <a name="input_dns_domain_name_cms"></a> [dns\_domain\_name\_cms](#input\_dns\_domain\_name\_cms) | DNS domain name of the Developer Portal's CMS | `map(any)` | `null` | no |
| <a name="input_rds_scaling_configuration"></a> [rds\_scaling\_configuration](#input\_rds\_scaling\_configuration) | Scaling configuration for the RDS Aurora instance | <pre>object({<br/>    min_capacity = number<br/>    max_capacity = number<br/>  })</pre> | <pre>{<br/>  "max_capacity": 1,<br/>  "min_capacity": 0.5<br/>}</pre> | no |
| <a name="input_tags"></a> [tags](#input\_tags) | n/a | `map(any)` | <pre>{<br/>  "CreatedBy": "Terraform"<br/>}</pre> | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_internal_load_balancer"></a> [internal\_load\_balancer](#output\_internal\_load\_balancer) | n/a |
| <a name="output_security_groups"></a> [security\_groups](#output\_security\_groups) | n/a |
| <a name="output_vpc"></a> [vpc](#output\_vpc) | n/a |
