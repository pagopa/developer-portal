## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | ~> 1.13.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 5.0 |
| <a name="requirement_awscc"></a> [awscc](#requirement\_awscc) | <= 1.10.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_http"></a> [http](#provider\_http) | 3.5.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_active_campaign"></a> [active\_campaign](#module\_active\_campaign) | ./modules/active_campaign | n/a |
| <a name="module_chatbot"></a> [chatbot](#module\_chatbot) | ./modules/chatbot | n/a |
| <a name="module_cicd"></a> [cicd](#module\_cicd) | ./modules/cicd | n/a |
| <a name="module_cms"></a> [cms](#module\_cms) | ./modules/cms | n/a |
| <a name="module_core"></a> [core](#module\_core) | ./modules/core | n/a |
| <a name="module_docs_redirect"></a> [docs\_redirect](#module\_docs\_redirect) | ./modules/docs_redirect | n/a |
| <a name="module_identity"></a> [identity](#module\_identity) | ./identity | n/a |
| <a name="module_langfuse"></a> [langfuse](#module\_langfuse) | ./modules/langfuse | n/a |
| <a name="module_strapi_v5"></a> [strapi\_v5](#module\_strapi\_v5) | ./modules/strapi5 | n/a |
| <a name="module_video_streaming"></a> [video\_streaming](#module\_video\_streaming) | ./modules/video_streaming | n/a |
| <a name="module_website"></a> [website](#module\_website) | ./modules/website | n/a |

## Resources

| Name | Type |
|------|------|
| [http_http.docs_redirect_cf_function_code](https://registry.terraform.io/providers/hashicorp/http/latest/docs/data-sources/http) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_cms_app_image_tag"></a> [cms\_app\_image\_tag](#input\_cms\_app\_image\_tag) | Docker image tag for the CMS Strapi application | `string` | n/a | yes |
| <a name="input_dns_domain_name"></a> [dns\_domain\_name](#input\_dns\_domain\_name) | DNS domain for the Developer Portal product | `string` | n/a | yes |
| <a name="input_environment"></a> [environment](#input\_environment) | Environment | `string` | n/a | yes |
| <a name="input_github_repository"></a> [github\_repository](#input\_github\_repository) | The repository where the IaC workflows will run | `string` | n/a | yes |
| <a name="input_ac_integration_is_enabled"></a> [ac\_integration\_is\_enabled](#input\_ac\_integration\_is\_enabled) | Defines if Active Campaign integration should be enabled | `bool` | `false` | no |
| <a name="input_aws_chatbot_region"></a> [aws\_chatbot\_region](#input\_aws\_chatbot\_region) | AWS region to create AI chatbot's resources | `string` | `"eu-west-3"` | no |
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | AWS region to create resources. Default Milan | `string` | `"eu-south-1"` | no |
| <a name="input_cdn_custom_headers"></a> [cdn\_custom\_headers](#input\_cdn\_custom\_headers) | n/a | <pre>list(object(<br/>    {<br/>      header   = string<br/>      override = bool<br/>      value    = string<br/>    }<br/>  ))</pre> | `[]` | no |
| <a name="input_chatbot_ecs_monitoring"></a> [chatbot\_ecs\_monitoring](#input\_chatbot\_ecs\_monitoring) | Langfuse configuration for the AI chatbot | <pre>object({<br/>    cpu       = optional(number, 2048)<br/>    memory    = optional(number, 4096)<br/>    image_uri = optional(string, "ghcr.io/langfuse/langfuse:sha-9375250")<br/>    port      = optional(number, 3000)<br/>  })</pre> | <pre>{<br/>  "cpu": 512,<br/>  "image_uri": "ghcr.io/langfuse/langfuse:sha-9375250",<br/>  "memory": 1024,<br/>  "port": 3000<br/>}</pre> | no |
| <a name="input_chatbot_ecs_redis"></a> [chatbot\_ecs\_redis](#input\_chatbot\_ecs\_redis) | Redis configuration for the AI chatbot | <pre>object({<br/>    cpu       = optional(number, 2048)<br/>    memory    = optional(number, 4096)<br/>    image_uri = optional(string, "redis/redis-stack-server@sha256:887cf87cc744e4588ccade336d0dbb943e4e46330f738653ccb3a7a55df2f186")<br/>    port      = optional(number, 6379)<br/>  })</pre> | <pre>{<br/>  "cpu": 2048,<br/>  "image_uri": "redis/redis-stack-server@sha256:887cf87cc744e4588ccade336d0dbb943e4e46330f738653ccb3a7a55df2f186",<br/>  "memory": 4096,<br/>  "port": 6379<br/>}</pre> | no |
| <a name="input_chatbot_models"></a> [chatbot\_models](#input\_chatbot\_models) | The models used by the AI chatbot | <pre>object({<br/>    provider   = string<br/>    generation = string<br/>    embeddings = string<br/>    reranker   = string<br/>  })</pre> | <pre>{<br/>  "embeddings": "gemini-embedding-001",<br/>  "generation": "gemini-2.5-flash-lite",<br/>  "provider": "google",<br/>  "reranker": "semantic-ranker-default-004"<br/>}</pre> | no |
| <a name="input_cms_app_cpu"></a> [cms\_app\_cpu](#input\_cms\_app\_cpu) | Fargate instance CPU units to provision (1 vCPU = 1024 CPU units) | `string` | `"1024"` | no |
| <a name="input_cms_app_memory"></a> [cms\_app\_memory](#input\_cms\_app\_memory) | Fargate instance memory to provision (in MiB) | `string` | `"3072"` | no |
| <a name="input_cms_app_port"></a> [cms\_app\_port](#input\_cms\_app\_port) | The standard app port used by CMS Strapi | `number` | `1337` | no |
| <a name="input_create_chatbot"></a> [create\_chatbot](#input\_create\_chatbot) | Defines if chatbot should be created | `bool` | `false` | no |
| <a name="input_dns_delegate_records"></a> [dns\_delegate\_records](#input\_dns\_delegate\_records) | DNS delegate records | `map(any)` | `{}` | no |
| <a name="input_dns_domain_name_cms"></a> [dns\_domain\_name\_cms](#input\_dns\_domain\_name\_cms) | DNS domain name of the Developer Portal's CMS | `map(any)` | `null` | no |
| <a name="input_docs_redirect_is_enabled"></a> [docs\_redirect\_is\_enabled](#input\_docs\_redirect\_is\_enabled) | Defines if Docs redirect should be enabled | `bool` | `false` | no |
| <a name="input_github_cms_repository"></a> [github\_cms\_repository](#input\_github\_cms\_repository) | The repository where the CMS workflows will run | `string` | `"pagopa/developer-portal-cms"` | no |
| <a name="input_log_retention_days"></a> [log\_retention\_days](#input\_log\_retention\_days) | The number of days logs should be retained. Default is 90 days. | `number` | `90` | no |
| <a name="input_publish_cloudfront_functions"></a> [publish\_cloudfront\_functions](#input\_publish\_cloudfront\_functions) | Defines if cloudfront functions should be published | `bool` | `false` | no |
| <a name="input_rds_cms_scaling_configuration"></a> [rds\_cms\_scaling\_configuration](#input\_rds\_cms\_scaling\_configuration) | Scaling configuration for the RDS Aurora instance | <pre>object({<br/>    min_capacity = number<br/>    max_capacity = number<br/>  })</pre> | <pre>{<br/>  "max_capacity": 1,<br/>  "min_capacity": 0.5<br/>}</pre> | no |
| <a name="input_strapi_v5_image_tag"></a> [strapi\_v5\_image\_tag](#input\_strapi\_v5\_image\_tag) | Docker image tag for the Strapi v5 application | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | n/a | `map(any)` | <pre>{<br/>  "CreatedBy": "Terraform"<br/>}</pre> | no |
| <a name="input_use_custom_certificate"></a> [use\_custom\_certificate](#input\_use\_custom\_certificate) | Enable CDN https support with a custom certificate instead using the default one | `bool` | `true` | no |
| <a name="input_website_is_standalone"></a> [website\_is\_standalone](#input\_website\_is\_standalone) | If true, the website will be deployed in standalone mode (Amplify), otherwise static deployment is used (S3 + Cloudfront) | `bool` | `false` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_iam_role_deploy_standalone_website_arn"></a> [iam\_role\_deploy\_standalone\_website\_arn](#output\_iam\_role\_deploy\_standalone\_website\_arn) | n/a |
| <a name="output_name_servers_records"></a> [name\_servers\_records](#output\_name\_servers\_records) | n/a |
| <a name="output_standalone_server"></a> [standalone\_server](#output\_standalone\_server) | n/a |
| <a name="output_terraform_backend_bucket_name"></a> [terraform\_backend\_bucket\_name](#output\_terraform\_backend\_bucket\_name) | n/a |
| <a name="output_terraform_lock_dynamodb_table"></a> [terraform\_lock\_dynamodb\_table](#output\_terraform\_lock\_dynamodb\_table) | n/a |
| <a name="output_video_streaming"></a> [video\_streaming](#output\_video\_streaming) | Outputs from the video streaming module. |
