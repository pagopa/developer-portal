## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |
| <a name="provider_random"></a> [random](#provider\_random) | n/a |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_encryption_key"></a> [encryption\_key](#module\_encryption\_key) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_langfuse_load_balancer"></a> [langfuse\_load\_balancer](#module\_langfuse\_load\_balancer) | git::https://github.com/terraform-aws-modules/terraform-aws-alb.git | 3e9c6cbaf4c1d858c3bbee6f086f0c8ef17522ab |
| <a name="module_langfuse_ssl_certificate"></a> [langfuse\_ssl\_certificate](#module\_langfuse\_ssl\_certificate) | git::https://github.com/terraform-aws-modules/terraform-aws-acm.git | 8d0b22f1f242a1b36e29b8cb38aaeac9b887500d |
| <a name="module_master_user_password"></a> [master\_user\_password](#module\_master\_user\_password) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_nextauth_secret"></a> [nextauth\_secret](#module\_nextauth\_secret) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_salt"></a> [salt](#module\_salt) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_user_pool_client_id"></a> [user\_pool\_client\_id](#module\_user\_pool\_client\_id) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_user_pool_client_secret"></a> [user\_pool\_client\_secret](#module\_user\_pool\_client\_secret) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |
| <a name="module_user_pool_issuer"></a> [user\_pool\_issuer](#module\_user\_pool\_issuer) | git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git | 77d2c139784197febbc8f8e18a33d23eb4736879 |

## Resources

| Name | Type |
|------|------|
| [aws_cloudwatch_log_group.clickhouse](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_log_group.langfuse_cache_engine_log](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_log_group.langfuse_cache_slow_log](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_log_group.langfuse_web](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_log_group.langfuse_worker](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cognito_user.master](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_user) | resource |
| [aws_cognito_user_pool.langfuse](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_user_pool) | resource |
| [aws_cognito_user_pool_client.langfuse](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_user_pool_client) | resource |
| [aws_cognito_user_pool_domain.langfuse](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_user_pool_domain) | resource |
| [aws_db_subnet_group.postgres_subnet_grp](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/db_subnet_group) | resource |
| [aws_ecr_lifecycle_policy.image_count_cleanup](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecr_lifecycle_policy) | resource |
| [aws_ecr_repository.repositories](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecr_repository) | resource |
| [aws_ecs_cluster.langfuse](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_cluster) | resource |
| [aws_ecs_service.clickhouse](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_service) | resource |
| [aws_ecs_service.langfuse_web](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_service) | resource |
| [aws_ecs_service.langfuse_worker](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_service) | resource |
| [aws_ecs_task_definition.clickhouse](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_task_definition) | resource |
| [aws_ecs_task_definition.langfuse_web](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_task_definition) | resource |
| [aws_ecs_task_definition.langfuse_worker](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_task_definition) | resource |
| [aws_efs_file_system.clickhouse_data](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/efs_file_system) | resource |
| [aws_efs_mount_target.clickhouse_data](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/efs_mount_target) | resource |
| [aws_elasticache_replication_group.langfuse_cache](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/elasticache_replication_group) | resource |
| [aws_elasticache_subnet_group.langfuse_cache_subnet_group](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/elasticache_subnet_group) | resource |
| [aws_iam_policy.langfuse_ecs_task_execute_role_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.langfuse_ssm_read](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.langfuse_task_role_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role.langfuse_ecs_task_execute_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.langfuse_task_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.ecs_task_execute_role_attachment](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.langfuse_attach_ssm](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.task_role_policy_attachment](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_kms_key.postgres](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/kms_key) | resource |
| [aws_rds_cluster.langfuse_aurora_cluster](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/rds_cluster) | resource |
| [aws_rds_cluster_instance.serverless_v2_instance](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/rds_cluster_instance) | resource |
| [aws_route53_record.langfuse](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_s3_bucket.langfuse_blob](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket) | resource |
| [aws_s3_bucket.langfuse_event](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket) | resource |
| [aws_secretsmanager_secret.clickhouse_password](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret) | resource |
| [aws_secretsmanager_secret.langfuse_database_url](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret) | resource |
| [aws_secretsmanager_secret.langfuse_db_password](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret) | resource |
| [aws_secretsmanager_secret_version.clickhouse_password](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret_version) | resource |
| [aws_secretsmanager_secret_version.langfuse_database_url](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret_version) | resource |
| [aws_secretsmanager_secret_version.langfuse_db_password](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret_version) | resource |
| [aws_security_group.clickhouse](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.efs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.langfuse_cache](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.langfuse_db](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.langfuse_web](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.langfuse_worker](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.lb](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group_rule.langfuse_web_lambda_ingress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_service_discovery_private_dns_namespace.langfuse](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/service_discovery_private_dns_namespace) | resource |
| [aws_service_discovery_service.clickhouse](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/service_discovery_service) | resource |
| [aws_service_discovery_service.langfuse-web](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/service_discovery_service) | resource |
| [random_id.nextauth_secret](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/id) | resource |
| [random_id.salt](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/id) | resource |
| [random_password.clickhouse_password](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password) | resource |
| [random_password.encryption_key](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password) | resource |
| [random_password.langfuse_db_password](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password) | resource |
| [random_password.master](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password) | resource |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy_document.ecs_task_execute_assume_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.ecs_task_execute_role_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.langfuse_instance_role_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.langfuse_ssm_read_policy_doc](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.langfuse_task_role_assume_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_custom_domain_id"></a> [custom\_domain\_id](#input\_custom\_domain\_id) | Route53 Hosted Zone ID for custom domain | `string` | n/a | yes |
| <a name="input_custom_domain_name"></a> [custom\_domain\_name](#input\_custom\_domain\_name) | Langfuse and Grafana custom domain name. If you set example.com, the domain will be langfuse.example.com and grafana.example.com | `string` | n/a | yes |
| <a name="input_environment"></a> [environment](#input\_environment) | Environment | `string` | n/a | yes |
| <a name="input_private_subnet_ids"></a> [private\_subnet\_ids](#input\_private\_subnet\_ids) | Private subnet IDs on which to deploy Langfuse worker / Clickhouse / Aurora Serverless v2 / ElastiCache | `list(string)` | n/a | yes |
| <a name="input_public_subnet_ids"></a> [public\_subnet\_ids](#input\_public\_subnet\_ids) | Public subnet IDs used to expose Langfuse through the load balancer | `list(string)` | n/a | yes |
| <a name="input_region"></a> [region](#input\_region) | AWS region on which to deploy | `string` | n/a | yes |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | VPC ID for Your Langfuse Environment | `string` | n/a | yes |
| <a name="input_cache_node_type"></a> [cache\_node\_type](#input\_cache\_node\_type) | Node type for Langfuse Cache/Queue(ElastiCache) | `string` | `"cache.t4g.micro"` | no |
| <a name="input_cognito_user_pool_endpoint"></a> [cognito\_user\_pool\_endpoint](#input\_cognito\_user\_pool\_endpoint) | Existing Cognito user pool endpoint to reuse instead of creating a dedicated one | `string` | `null` | no |
| <a name="input_cognito_user_pool_id"></a> [cognito\_user\_pool\_id](#input\_cognito\_user\_pool\_id) | Existing Cognito user pool ID to reuse instead of creating a dedicated one | `string` | `null` | no |
| <a name="input_database_max_capacity"></a> [database\_max\_capacity](#input\_database\_max\_capacity) | Maximum capacity for Langfuse DB Aurora Serverless v2 | `number` | `10` | no |
| <a name="input_database_min_capacity"></a> [database\_min\_capacity](#input\_database\_min\_capacity) | Minimum capacity for Langfuse DB Aurora Serverless v2 | `number` | `0.5` | no |
| <a name="input_database_user"></a> [database\_user](#input\_database\_user) | Database user for Langfuse Aurora Serverless v2 | `string` | `"langfuse"` | no |
| <a name="input_force_delete"></a> [force\_delete](#input\_force\_delete) | Whether to force delete resources | `bool` | `false` | no |
| <a name="input_lambda_security_group_id"></a> [lambda\_security\_group\_id](#input\_lambda\_security\_group\_id) | Security group ID of the lambda monitor to allow access to langfuse-web | `string` | `null` | no |
| <a name="input_master_user_password_param_arn"></a> [master\_user\_password\_param\_arn](#input\_master\_user\_password\_param\_arn) | ARN of the SSM parameter containing the Cognito master user password when reusing an existing user pool | `string` | `null` | no |
| <a name="input_module"></a> [module](#input\_module) | Prefix for resources | `string` | `"langfuse"` | no |
| <a name="input_web_desire_count"></a> [web\_desire\_count](#input\_web\_desire\_count) | Desired count for Langfuse Web | `number` | `1` | no |
| <a name="input_worker_desire_count"></a> [worker\_desire\_count](#input\_worker\_desire\_count) | Desired count for Langfuse Worker(s) | `number` | `1` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_service_discovery_endpoint"></a> [service\_discovery\_endpoint](#output\_service\_discovery\_endpoint) | The private address of the service discovery of langfuse-web |
