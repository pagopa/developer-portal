# default

<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | ~> 1.16.4 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 6.67.0 |
| <a name="requirement_awscc"></a> [awscc](#requirement\_awscc) | ~> 1.84.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | 6.67.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_litellm"></a> [litellm](#module\_litellm) | ../../ | n/a |

## Resources

| Name | Type |
|------|------|
| [aws_acm_certificate.litellm](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/acm_certificate) | resource |
| [aws_acm_certificate_validation.litellm](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/acm_certificate_validation) | resource |
| [aws_route53_record.certificate_validation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route53_record.litellm](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route53_zone.litellm](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/route53_zone) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_acm_certificate_arn"></a> [acm\_certificate\_arn](#input\_acm\_certificate\_arn) | Existing ACM cert ARN for the ALB HTTPS listener. Empty creates a DNS-validated certificate unless allow\_plaintext\_alb is true. | `string` | `""` | no |
| <a name="input_additional_task_security_group_ids"></a> [additional\_task\_security\_group\_ids](#input\_additional\_task\_security\_group\_ids) | Extra security groups for the tasks, e.g. one an existing database already allows. | `list(string)` | `[]` | no |
| <a name="input_allow_plaintext_alb"></a> [allow\_plaintext\_alb](#input\_allow\_plaintext\_alb) | Opt into HTTP-only ALB (trial/dev only). | `bool` | `false` | no |
| <a name="input_azs"></a> [azs](#input\_azs) | Availability zones for the subnets the module creates. At least 2 (RDS + ALB). Unused when vpc\_id is set. | `list(string)` | `[]` | no |
| <a name="input_backend_extra_env"></a> [backend\_extra\_env](#input\_backend\_extra\_env) | Compatibility env vars merged into LiteLLM. gateway\_extra\_env wins on collisions. | `map(string)` | `{}` | no |
| <a name="input_backend_extra_secrets"></a> [backend\_extra\_secrets](#input\_backend\_extra\_secrets) | Compatibility secrets merged into LiteLLM. gateway\_extra\_secrets wins on collisions. | `map(string)` | `{}` | no |
| <a name="input_create_database"></a> [create\_database](#input\_create\_database) | Create the Aurora Postgres cluster. False → use database\_url, or run DB-less. | `bool` | `true` | no |
| <a name="input_create_redis"></a> [create\_redis](#input\_create\_redis) | Create the ElastiCache Redis group. False → use redis\_url, or run without Redis. | `bool` | `true` | no |
| <a name="input_database_url"></a> [database\_url](#input\_database\_url) | Postgres connection string for an existing database. Read only when create\_database = false. | `string` | `""` | no |
| <a name="input_database_url_secret_arn"></a> [database\_url\_secret\_arn](#input\_database\_url\_secret\_arn) | Existing Secrets Manager reference holding DATABASE\_URL. Set create\_database = false and leave database\_url empty. | `string` | `""` | no |
| <a name="input_env"></a> [env](#input\_env) | Environment suffix (stage, prod, dev). | `string` | n/a | yes |
| <a name="input_gateway_extra_env"></a> [gateway\_extra\_env](#input\_gateway\_extra\_env) | Plain-text env vars layered onto the all-in-one LiteLLM container. | `map(string)` | `{}` | no |
| <a name="input_gateway_extra_secrets"></a> [gateway\_extra\_secrets](#input\_gateway\_extra\_secrets) | LiteLLM env vars sourced from Secrets Manager (name to ARN). | `map(string)` | `{}` | no |
| <a name="input_gateway_image"></a> [gateway\_image](#input\_gateway\_image) | All-in-one LiteLLM image serving the API and UI on port 4000. | `string` | `"docker.litellm.ai/berriai/litellm:main-stable"` | no |
| <a name="input_hosted_zone_id"></a> [hosted\_zone\_id](#input\_hosted\_zone\_id) | Public Route53 hosted zone for litellm.<zone-name> and its ACM DNS validation records. | `string` | `"Z02428843GXDP0RBGX2EQ"` | no |
| <a name="input_litellm_license"></a> [litellm\_license](#input\_litellm\_license) | LiteLLM enterprise license. Empty → OSS-only. | `string` | `""` | no |
| <a name="input_litellm_master_key"></a> [litellm\_master\_key](#input\_litellm\_master\_key) | Pre-existing LITELLM\_MASTER\_KEY (sk-…). Empty → auto-generated. | `string` | `""` | no |
| <a name="input_private_subnet_ids"></a> [private\_subnet\_ids](#input\_private\_subnet\_ids) | Existing private subnets for tasks, Aurora, and Redis. Required with vpc\_id. | `list(string)` | `[]` | no |
| <a name="input_proxy_config"></a> [proxy\_config](#input\_proxy\_config) | LiteLLM proxy config (contents of config.yaml). Empty → defaults. | `any` | `{}` | no |
| <a name="input_public_subnet_ids"></a> [public\_subnet\_ids](#input\_public\_subnet\_ids) | Existing public subnets for the ALB (≥ 2 AZs). Required with vpc\_id. | `list(string)` | `[]` | no |
| <a name="input_redis_url"></a> [redis\_url](#input\_redis\_url) | Connection string for an existing Redis. Read only when create\_redis = false. | `string` | `""` | no |
| <a name="input_region"></a> [region](#input\_region) | AWS region to deploy into. | `string` | n/a | yes |
| <a name="input_s3_force_destroy"></a> [s3\_force\_destroy](#input\_s3\_force\_destroy) | Allow destroy of a non-empty S3 bucket (ephemeral/CI only). | `bool` | `false` | no |
| <a name="input_skip_final_snapshot"></a> [skip\_final\_snapshot](#input\_skip\_final\_snapshot) | Skip the Aurora final snapshot on destroy (ephemeral/CI only). | `bool` | `false` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | Tenant slug — prefix for every resource (<tenant>-litellm-<env>). | `string` | n/a | yes |
| <a name="input_ui_password"></a> [ui\_password](#input\_ui\_password) | UI admin password. Empty → falls back to LITELLM\_MASTER\_KEY. | `string` | `""` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | Existing VPC to deploy into. Empty → module creates its own networking. | `string` | `""` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_acm_certificate_arn"></a> [acm\_certificate\_arn](#output\_acm\_certificate\_arn) | Validated ACM certificate ARN used by the ALB, or empty in HTTP-only mode. |
| <a name="output_alb_dns_name"></a> [alb\_dns\_name](#output\_alb\_dns\_name) | Public DNS name of the LiteLLM ALB. |
| <a name="output_alb_url"></a> [alb\_url](#output\_alb\_url) | Proxy URL. Dashboard at /, API at /v1/*. |
| <a name="output_aurora_reader_endpoint"></a> [aurora\_reader\_endpoint](#output\_aurora\_reader\_endpoint) | Aurora reader endpoint. |
| <a name="output_aurora_writer_endpoint"></a> [aurora\_writer\_endpoint](#output\_aurora\_writer\_endpoint) | Aurora writer endpoint. |
| <a name="output_database_url_secret_arn"></a> [database\_url\_secret\_arn](#output\_database\_url\_secret\_arn) | Secrets Manager reference injected into LiteLLM as DATABASE\_URL. |
| <a name="output_db_master_password_secret_arn"></a> [db\_master\_password\_secret\_arn](#output\_db\_master\_password\_secret\_arn) | Secrets Manager ARN holding the Aurora credentials as JSON. |
| <a name="output_ecs_cluster"></a> [ecs\_cluster](#output\_ecs\_cluster) | ECS cluster name. |
| <a name="output_litellm_url"></a> [litellm\_url](#output\_litellm\_url) | HTTPS URL for the managed LiteLLM domain, or null when using an existing certificate or HTTP-only mode. |
| <a name="output_master_key_secret_arn"></a> [master\_key\_secret\_arn](#output\_master\_key\_secret\_arn) | Secrets Manager ARN holding LITELLM\_MASTER\_KEY. |
| <a name="output_redis_endpoint"></a> [redis\_endpoint](#output\_redis\_endpoint) | ElastiCache Redis primary endpoint (TLS). |
| <a name="output_s3_bucket"></a> [s3\_bucket](#output\_s3\_bucket) | S3 bucket name. |
| <a name="output_task_security_group_id"></a> [task\_security\_group\_id](#output\_task\_security\_group\_id) | Tasks security group. Allow this inbound on an existing database or Redis. |
| <a name="output_vpc_id"></a> [vpc\_id](#output\_vpc\_id) | VPC the stack runs in, whether module-created or supplied. |
<!-- END_TF_DOCS -->
