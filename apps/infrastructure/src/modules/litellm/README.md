## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.6.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 6.60 |
| <a name="requirement_random"></a> [random](#requirement\_random) | ~> 3.6 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | 6.67.0 |
| <a name="provider_random"></a> [random](#provider\_random) | 3.9.1 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_appautoscaling_policy.gateway_cpu](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_policy) | resource |
| [aws_appautoscaling_policy.gateway_memory](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_policy) | resource |
| [aws_appautoscaling_policy.gateway_requests](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_policy) | resource |
| [aws_appautoscaling_policy.gateway_tokens](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_policy) | resource |
| [aws_appautoscaling_scheduled_action.gateway_start](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_scheduled_action) | resource |
| [aws_appautoscaling_scheduled_action.gateway_stop](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_scheduled_action) | resource |
| [aws_appautoscaling_target.gateway](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_target) | resource |
| [aws_cloudwatch_log_group.gateway](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_db_subnet_group.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/db_subnet_group) | resource |
| [aws_ecs_cluster.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_cluster) | resource |
| [aws_ecs_service.gateway](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_service) | resource |
| [aws_ecs_task_definition.gateway](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_task_definition) | resource |
| [aws_eip.nat](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eip) | resource |
| [aws_elasticache_replication_group.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/elasticache_replication_group) | resource |
| [aws_elasticache_subnet_group.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/elasticache_subnet_group) | resource |
| [aws_iam_policy.s3_access](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.secrets_access](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role.task](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.task_execution](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.task_execution](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.task_execution_secrets](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.task_s3_access](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_internet_gateway.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/internet_gateway) | resource |
| [aws_lb.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb) | resource |
| [aws_lb_listener.http](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_listener) | resource |
| [aws_lb_listener.https](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_listener) | resource |
| [aws_lb_target_group.gateway](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_target_group) | resource |
| [aws_nat_gateway.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/nat_gateway) | resource |
| [aws_rds_cluster.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/rds_cluster) | resource |
| [aws_rds_cluster_instance.reader](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/rds_cluster_instance) | resource |
| [aws_rds_cluster_instance.writer](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/rds_cluster_instance) | resource |
| [aws_rds_cluster_parameter_group.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/rds_cluster_parameter_group) | resource |
| [aws_route_table.private](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route_table) | resource |
| [aws_route_table.public](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route_table) | resource |
| [aws_route_table_association.private](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route_table_association) | resource |
| [aws_route_table_association.public](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route_table_association) | resource |
| [aws_s3_bucket.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket) | resource |
| [aws_s3_bucket_public_access_block.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_public_access_block) | resource |
| [aws_s3_bucket_server_side_encryption_configuration.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_server_side_encryption_configuration) | resource |
| [aws_s3_bucket_versioning.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_versioning) | resource |
| [aws_s3_object.proxy_config](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_object) | resource |
| [aws_secretsmanager_secret.billing_metrics_ca_cert](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret) | resource |
| [aws_secretsmanager_secret.billing_metrics_client_cert](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret) | resource |
| [aws_secretsmanager_secret.billing_metrics_client_key](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret) | resource |
| [aws_secretsmanager_secret.database_url](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret) | resource |
| [aws_secretsmanager_secret.db_master_password](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret) | resource |
| [aws_secretsmanager_secret.license](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret) | resource |
| [aws_secretsmanager_secret.master_key](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret) | resource |
| [aws_secretsmanager_secret.redis_url](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret) | resource |
| [aws_secretsmanager_secret.ui_password](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret) | resource |
| [aws_secretsmanager_secret_version.billing_metrics_ca_cert](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret_version) | resource |
| [aws_secretsmanager_secret_version.billing_metrics_client_cert](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret_version) | resource |
| [aws_secretsmanager_secret_version.billing_metrics_client_key](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret_version) | resource |
| [aws_secretsmanager_secret_version.database_url](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret_version) | resource |
| [aws_secretsmanager_secret_version.db_master_password](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret_version) | resource |
| [aws_secretsmanager_secret_version.license](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret_version) | resource |
| [aws_secretsmanager_secret_version.master_key](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret_version) | resource |
| [aws_secretsmanager_secret_version.redis_url](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret_version) | resource |
| [aws_secretsmanager_secret_version.ui_password](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret_version) | resource |
| [aws_security_group.alb](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.rds](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.redis](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.tasks](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_subnet.private](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/subnet) | resource |
| [aws_subnet.public](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/subnet) | resource |
| [aws_vpc.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc) | resource |
| [random_id.s3_suffix](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/id) | resource |
| [random_password.db_master_password](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password) | resource |
| [random_password.master_key](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password) | resource |
| [aws_iam_policy_document.s3_access](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.secrets_access](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.task_assume](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_env"></a> [env](#input\_env) | Environment suffix appended to every resource name (e.g. `stage`, `prod`, `dev`). | `string` | n/a | yes |
| <a name="input_region"></a> [region](#input\_region) | AWS region to deploy into. | `string` | n/a | yes |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | Tenant slug — used as the prefix for every AWS resource the stack creates. Combined with var.env to form `<tenant>-litellm-<env>` (e.g. `acme-litellm-stage`). | `string` | n/a | yes |
| <a name="input_acm_certificate_arn"></a> [acm\_certificate\_arn](#input\_acm\_certificate\_arn) | ACM certificate ARN for the ALB's HTTPS listener. When set, the stack<br/>provisions a 443 listener carrying the same path-routing rules as the 80<br/>listener, and the 80 listener is rewritten to redirect HTTP→HTTPS. Leave<br/>empty ("") to disable TLS (must combine with `allow_plaintext_alb = true`<br/>for the plan to succeed — see README.md "TLS"). | `string` | `""` | no |
| <a name="input_additional_task_security_group_ids"></a> [additional\_task\_security\_group\_ids](#input\_additional\_task\_security\_group\_ids) | Extra security groups to attach to the ECS tasks, on top of the one the<br/>module creates. Useful with `vpc_id`: attach a group your existing<br/>database or cache already allows inbound from, instead of editing their<br/>ingress rules. | `list(string)` | `[]` | no |
| <a name="input_allow_plaintext_alb"></a> [allow\_plaintext\_alb](#input\_allow\_plaintext\_alb) | Opt into HTTP-only mode on the ALB (port 80, no TLS). Default false:<br/>`terraform plan` fails when `acm_certificate_arn = ""` so the operator<br/>must either provide an ACM cert or consciously opt out. Intended for<br/>short-lived trial / dev stacks only. | `bool` | `false` | no |
| <a name="input_azs"></a> [azs](#input\_azs) | Availability zones to spread the module-created subnets across. At least 2 required for Aurora and the ALB. Unused when `vpc_id` is set. | `list(string)` | `[]` | no |
| <a name="input_backend_extra_env"></a> [backend\_extra\_env](#input\_backend\_extra\_env) | Compatibility input merged into the all-in-one container. gateway\_extra\_env wins on collisions. | `map(string)` | `{}` | no |
| <a name="input_backend_extra_secrets"></a> [backend\_extra\_secrets](#input\_backend\_extra\_secrets) | Compatibility input merged into the all-in-one container. gateway\_extra\_secrets wins on collisions. | `map(string)` | `{}` | no |
| <a name="input_billing_metrics_ca_cert_pem"></a> [billing\_metrics\_ca\_cert\_pem](#input\_billing\_metrics\_ca\_cert\_pem) | PEM content of the CA bundle used to verify the metering collector.<br/>Only needed for private or test collectors whose CA is not in the<br/>system trust store; telemetry.litellm.ai is publicly trusted, so leave<br/>this empty for production. When set, it is exposed as<br/>LITELLM\_BILLING\_METRICS\_CA\_CERT. | `string` | `""` | no |
| <a name="input_billing_metrics_client_cert_pem"></a> [billing\_metrics\_client\_cert\_pem](#input\_billing\_metrics\_client\_cert\_pem) | PEM content of the mTLS client certificate issued for this deployment.<br/>When billing\_metrics\_endpoint is set, the stack stores this in a<br/>`<tenant>-litellm-<env>-billing-metrics-client-cert` Secrets Manager<br/>entry, grants the task-execution role GetSecretValue on it, and exposes<br/>it to LiteLLM as LITELLM\_BILLING\_METRICS\_CLIENT\_CERT. Required<br/>whenever metering is enabled. | `string` | `""` | no |
| <a name="input_billing_metrics_client_key_pem"></a> [billing\_metrics\_client\_key\_pem](#input\_billing\_metrics\_client\_key\_pem) | PEM content of the private key matching<br/>billing\_metrics\_client\_cert\_pem. Stored in a<br/>`<tenant>-litellm-<env>-billing-metrics-client-key` Secrets Manager<br/>entry and exposed as LITELLM\_BILLING\_METRICS\_CLIENT\_KEY. Required<br/>whenever metering is enabled. | `string` | `""` | no |
| <a name="input_billing_metrics_endpoint"></a> [billing\_metrics\_endpoint](#input\_billing\_metrics\_endpoint) | OTLP/HTTP endpoint for enterprise billing metrics (sets<br/>LITELLM\_BILLING\_METRICS\_ENDPOINT). Non-empty enables request metering;<br/>empty (default) disables it and adds no billing env to the container.<br/>Requires an enterprise license. Example:<br/>"https://telemetry.litellm.ai/v1/metrics" | `string` | `""` | no |
| <a name="input_create_database"></a> [create\_database](#input\_create\_database) | Create the Aurora Postgres cluster (default). Set false to skip it and<br/>either use an existing database via database\_url or database\_url\_secret\_arn,<br/>or run without a database when both are empty. The<br/>DB-less mode drops key management, spend tracking, and the admin UI's<br/>persistence: the proxy then serves traffic authenticated by<br/>LITELLM\_MASTER\_KEY only. | `bool` | `true` | no |
| <a name="input_create_redis"></a> [create\_redis](#input\_create\_redis) | Create the ElastiCache Redis replication group (default). Set false to<br/>skip it and either point the stack at an existing cache via `redis_url`,<br/>or run with no Redis at all when `redis_url` is also empty. Without<br/>Redis the proxy loses cross-task state: rate limits, budgets, and the<br/>router's cooldowns become per-task instead of cluster-wide. | `bool` | `true` | no |
| <a name="input_database_url"></a> [database\_url](#input\_database\_url) | Postgres connection string for an existing database, e.g.<br/>`postgresql://user:pass@host:5432/litellm`. Only read when<br/>`create_database = false`. Stored in a<br/>`<tenant>-litellm-<env>-database-url` Secrets Manager entry and injected<br/>into LiteLLM as DATABASE\_URL, so the value never lands in a task definition.<br/>Mutually exclusive with database\_url\_secret\_arn. | `string` | `""` | no |
| <a name="input_database_url_secret_arn"></a> [database\_url\_secret\_arn](#input\_database\_url\_secret\_arn) | Existing Secrets Manager ARN holding a complete PostgreSQL DATABASE\_URL (optionally with an ECS JSON-key suffix). Set create\_database = false and leave database\_url empty. Terraform does not read or manage its value. | `string` | `""` | no |
| <a name="input_db_engine_version"></a> [db\_engine\_version](#input\_db\_engine\_version) | Aurora Postgres engine version. Major version drives the parameter-group family (aurora-postgresql<major>). | `string` | `"16.15"` | no |
| <a name="input_db_instance_class"></a> [db\_instance\_class](#input\_db\_instance\_class) | Aurora instance class for both writer and reader. | `string` | `"db.r6g.large"` | no |
| <a name="input_db_master_username"></a> [db\_master\_username](#input\_db\_master\_username) | Aurora master username used for the managed password-based DATABASE\_URL. | `string` | `"postgres"` | no |
| <a name="input_db_name"></a> [db\_name](#input\_db\_name) | Initial database name created on the Aurora cluster. | `string` | `"litellm"` | no |
| <a name="input_enable_https"></a> [enable\_https](#input\_enable\_https) | Explicitly enable or disable HTTPS. Set true when the certificate ARN is not known until apply. Null infers HTTPS from acm\_certificate\_arn. | `bool` | `null` | no |
| <a name="input_gateway_autoscaling_enabled"></a> [gateway\_autoscaling\_enabled](#input\_gateway\_autoscaling\_enabled) | Toggle Application Auto Scaling target-tracking on the gateway service. | `bool` | `true` | no |
| <a name="input_gateway_cpu"></a> [gateway\_cpu](#input\_gateway\_cpu) | Fargate CPU units for the all-in-one task (1024 = 1 vCPU). | `number` | `1024` | no |
| <a name="input_gateway_cpu_target"></a> [gateway\_cpu\_target](#input\_gateway\_cpu\_target) | Target average CPU utilization (%) for the gateway autoscaling policy. | `number` | `70` | no |
| <a name="input_gateway_desired_count"></a> [gateway\_desired\_count](#input\_gateway\_desired\_count) | Initial desired number of all-in-one tasks. Autoscaling owns subsequent changes. | `number` | `2` | no |
| <a name="input_gateway_extra_env"></a> [gateway\_extra\_env](#input\_gateway\_extra\_env) | Additional plain-text env vars for the gateway container. Use this for<br/>non-sensitive config (LANGFUSE\_HOST, custom feature flags, …). For API<br/>keys, use gateway\_extra\_secrets instead. | `map(string)` | `{}` | no |
| <a name="input_gateway_extra_secrets"></a> [gateway\_extra\_secrets](#input\_gateway\_extra\_secrets) | Extra env vars sourced from AWS Secrets Manager. Map of env-var name to<br/>Secrets Manager ARN. Pass the bare secret ARN to inject the whole secret<br/>string as the env var value, or append ":<jsonKey>::" to extract a single<br/>JSON field (ECS docs).<br/><br/>Example for OPENAI\_API\_KEY:<br/>  gateway\_extra\_secrets = {<br/>    OPENAI\_API\_KEY = "arn:aws:secretsmanager:us-west-2:111122223333:secret:openai-api-key-AbCdEf"<br/>  }<br/><br/>The stack's task execution role automatically gains GetSecretValue on every<br/>ARN referenced here (suffix-stripped). | `map(string)` | `{}` | no |
| <a name="input_gateway_image"></a> [gateway\_image](#input\_gateway\_image) | All-in-one LiteLLM image serving the API and admin UI on port 4000. | `string` | `"docker.litellm.ai/berriai/litellm:main-stable"` | no |
| <a name="input_gateway_max_capacity"></a> [gateway\_max\_capacity](#input\_gateway\_max\_capacity) | Maximum gateway task count under autoscaling. | `number` | `10` | no |
| <a name="input_gateway_memory"></a> [gateway\_memory](#input\_gateway\_memory) | Fargate memory (MiB) for the all-in-one task. | `number` | `4096` | no |
| <a name="input_gateway_memory_target"></a> [gateway\_memory\_target](#input\_gateway\_memory\_target) | Target average memory utilization (%) for the gateway autoscaling policy. Set 0 to skip the memory policy and scale on CPU only. | `number` | `80` | no |
| <a name="input_gateway_min_capacity"></a> [gateway\_min\_capacity](#input\_gateway\_min\_capacity) | Minimum gateway task count under autoscaling. | `number` | `1` | no |
| <a name="input_gateway_num_workers"></a> [gateway\_num\_workers](#input\_gateway\_num\_workers) | Worker processes per LiteLLM task (passed as --num\_workers). | `number` | `1` | no |
| <a name="input_gateway_scheduled_scaling_enabled"></a> [gateway\_scheduled\_scaling\_enabled](#input\_gateway\_scheduled\_scaling\_enabled) | Stop gateway tasks daily at 19:00 and restore a minimum of one task at 08:00 in Europe/Rome (including daylight saving). Requires gateway\_autoscaling\_enabled. | `bool` | `false` | no |
| <a name="input_gateway_target_requests_per_second"></a> [gateway\_target\_requests\_per\_second](#input\_gateway\_target\_requests\_per\_second) | Requests per second one gateway task should serve. Adds an<br/>ALBRequestCountPerTarget target-tracking policy next to the CPU/memory<br/>ones (Application Auto Scaling follows whichever asks for more tasks).<br/>CloudWatch publishes that metric as a 1-minute count, so the policy<br/>targets 60x this value and ECS reacts on a ~1 minute cadence. 0 skips<br/>the policy. | `number` | `0` | no |
| <a name="input_gateway_target_tokens_per_second"></a> [gateway\_target\_tokens\_per\_second](#input\_gateway\_target\_tokens\_per\_second) | Tokens per second one gateway task should serve. Adds a target-tracking<br/>policy on gateway\_tokens\_metric summed over each 60s period, divided by<br/>60 and by the service's Container Insights RunningTaskCount. Tokens are<br/>counted when a response completes, so the signal trails long streams.<br/>0 skips the policy. | `number` | `0` | no |
| <a name="input_gateway_tokens_metric"></a> [gateway\_tokens\_metric](#input\_gateway\_tokens\_metric) | CloudWatch metric carrying the gateway's litellm\_total\_tokens\_metric\_total<br/>counter, as published by the CloudWatch agent's Prometheus scraper (it<br/>emits the delta between scrapes, so Sum over a period is the tokens<br/>served in it). Required when gateway\_target\_tokens\_per\_second > 0.<br/>dimensions must match the metric\_declaration the agent publishes with. | <pre>object({<br/>    namespace  = string<br/>    name       = optional(string, "litellm_total_tokens_metric_total")<br/>    dimensions = optional(map(string), {})<br/>  })</pre> | `null` | no |
| <a name="input_litellm_license"></a> [litellm\_license](#input\_litellm\_license) | LiteLLM enterprise license string. When set, the stack creates a<br/>`<tenant>-litellm-<env>-license` Secrets Manager entry, grants the<br/>task-execution role GetSecretValue on it, and exposes its value to<br/>LiteLLM as `LITELLM_LICENSE`. Leave empty for OSS-only deploys. | `string` | `""` | no |
| <a name="input_litellm_master_key"></a> [litellm\_master\_key](#input\_litellm\_master\_key) | Pre-existing LITELLM\_MASTER\_KEY (must begin with `sk-`). When set, this<br/>value is written to the master-key Secrets Manager entry. When empty,<br/>the stack auto-generates a random `sk-…` key (preserving today's<br/>trial-deploy behavior). | `string` | `""` | no |
| <a name="input_log_retention_days"></a> [log\_retention\_days](#input\_log\_retention\_days) | CloudWatch log retention for the LiteLLM service. | `number` | `30` | no |
| <a name="input_otel_capture_message_content"></a> [otel\_capture\_message\_content](#input\_otel\_capture\_message\_content) | Value for OTEL\_INSTRUMENTATION\_GENAI\_CAPTURE\_MESSAGE\_CONTENT. Default<br/>`no_content` matches the litellm default; flip to `prompt_and_completion`<br/>only when you've audited what's about to land in your observability<br/>backend, because raw prompts/completions are typically sensitive. | `string` | `"no_content"` | no |
| <a name="input_otel_endpoint"></a> [otel\_endpoint](#input\_otel\_endpoint) | OTLP collector endpoint (sets OTEL\_ENDPOINT). Empty disables OTel<br/>entirely (no LITELLM\_OTEL\_V2, no OTEL\_* env). Point at any<br/>OTLP-compatible backend (self-hosted collector, Grafana Tempo,<br/>Honeycomb, Datadog). Example: "http://otel-collector.internal:4318"<br/>for OTLP/HTTP. | `string` | `""` | no |
| <a name="input_otel_environment_name"></a> [otel\_environment\_name](#input\_otel\_environment\_name) | Value for OTEL\_ENVIRONMENT\_NAME (becomes `deployment.environment` on<br/>every span). Defaults to var.env when empty so spans land tagged with<br/>the deployment env without extra wiring. | `string` | `""` | no |
| <a name="input_otel_exporter"></a> [otel\_exporter](#input\_otel\_exporter) | OTLP exporter protocol. One of "otlp\_http", "otlp\_grpc", or "console"<br/>(stdout, useful for verifying instrumentation against CloudWatch logs).<br/>Ignored when otel\_endpoint is empty. | `string` | `"otlp_http"` | no |
| <a name="input_otel_headers_secret_arn"></a> [otel\_headers\_secret\_arn](#input\_otel\_headers\_secret\_arn) | Secrets Manager ARN whose plaintext value becomes OTEL\_HEADERS<br/>(comma-separated `key=value` pairs, typically used to pass an API key<br/>header to a managed collector). The execution role auto-gains<br/>secretsmanager:GetSecretValue on this ARN. Empty omits OTEL\_HEADERS. | `string` | `""` | no |
| <a name="input_private_subnet_ids"></a> [private\_subnet\_ids](#input\_private\_subnet\_ids) | Existing private subnets for the ECS tasks, Aurora, and ElastiCache. Required when `vpc_id` is set, ignored otherwise. | `list(string)` | `[]` | no |
| <a name="input_proxy_config"></a> [proxy\_config](#input\_proxy\_config) | LiteLLM proxy config (the contents of config.yaml). Mirrors the helm<br/>chart's `gateway.config.proxy_config` value. Uploaded to S3 under<br/>`config/litellm-config.yaml` in the stack's bucket; the LiteLLM<br/>container downloads it to /tmp/litellm-config.yaml at task<br/>start (CONFIG\_FILE\_PATH is set automatically). The S3 object's etag is<br/>wired into the task definition, so editing this value produces a new<br/>task-def revision and a rolling redeploy.<br/><br/>Example:<br/>  proxy\_config = {<br/>    model\_list = [<br/>      {<br/>        model\_name = "gpt-4o"<br/>        litellm\_params = {<br/>          model   = "openai/gpt-4o"<br/>          api\_key = "os.environ/OPENAI\_API\_KEY"<br/>        }<br/>      },<br/>    ]<br/>    general\_settings = {<br/>      master\_key       = "os.environ/LITELLM\_MASTER\_KEY"<br/>      database\_url     = "os.environ/DATABASE\_URL"<br/>      ui\_username      = "admin"<br/>    }<br/>  }<br/><br/>Leave empty ({}) to skip mounting a config — the proxy then runs with<br/>defaults. Use the "os.environ/<NAME>" syntax in the YAML to reference<br/>env vars provided by *\_extra\_env or *\_extra\_secrets. | `any` | `{}` | no |
| <a name="input_public_subnet_ids"></a> [public\_subnet\_ids](#input\_public\_subnet\_ids) | Existing public subnets for the ALB, in at least 2 AZs. Required when `vpc_id` is set, ignored otherwise. | `list(string)` | `[]` | no |
| <a name="input_redis_node_type"></a> [redis\_node\_type](#input\_redis\_node\_type) | ElastiCache node type. | `string` | `"cache.t4g.small"` | no |
| <a name="input_redis_num_replicas"></a> [redis\_num\_replicas](#input\_redis\_num\_replicas) | Number of read replicas in the Redis replication group. The primary plus this many replicas form the cluster — set to 0 for a single-node dev deployment, 1+ for HA. multi\_az\_enabled and automatic\_failover\_enabled require >= 1. | `number` | `1` | no |
| <a name="input_redis_url"></a> [redis\_url](#input\_redis\_url) | Connection string for an existing Redis, e.g.<br/>`rediss://:password@host:6379`. Only read when `create_redis = false`.<br/>Stored in a `<tenant>-litellm-<env>-redis-url` Secrets Manager entry and<br/>injected as REDIS\_URL, which takes precedence over REDIS\_HOST/REDIS\_PORT<br/>in the proxy. | `string` | `""` | no |
| <a name="input_s3_force_destroy"></a> [s3\_force\_destroy](#input\_s3\_force\_destroy) | Allow `terraform destroy` to delete the S3 bucket even when it still<br/>contains objects (request log archives, /v1/files storage, S3 cache<br/>backend). Default false — destroying a non-empty bucket fails, acting<br/>as a tripwire against accidental data loss. Set true only for<br/>ephemeral / CI environments. Mirrors the safety posture of<br/>`skip_final_snapshot` on Aurora. | `bool` | `false` | no |
| <a name="input_skip_final_snapshot"></a> [skip\_final\_snapshot](#input\_skip\_final\_snapshot) | Skip the Aurora final snapshot on `terraform destroy`. Default false — destroying the cluster takes a snapshot first so data is recoverable. Set true only for ephemeral / CI environments where you accept permanent data loss on destroy. | `bool` | `false` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Per-deployment tags applied to every taggable resource the module creates, on top of the module's own `litellm:stack` / `managed-by` tags. Caller-level provider `default_tags` (if any) merge with these. | `map(string)` | `{}` | no |
| <a name="input_ui_password"></a> [ui\_password](#input\_ui\_password) | UI admin password. When set, the stack creates a<br/>`<tenant>-litellm-<env>-ui-password` Secrets Manager entry, grants the<br/>task-execution role GetSecretValue on it, and exposes its value to the<br/>proxy as `UI_PASSWORD`. Pair with `gateway_extra_env.UI_USERNAME` to<br/>set the matching username. Leave empty to skip — the proxy then falls<br/>back to the LITELLM\_MASTER\_KEY for UI login. | `string` | `""` | no |
| <a name="input_vpc_cidr"></a> [vpc\_cidr](#input\_vpc\_cidr) | CIDR block for the VPC the module creates. Unused when `vpc_id` is set. | `string` | `"10.40.0.0/16"` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | Existing VPC to deploy into. Leave empty ("") to have the module create<br/>its own VPC, subnets, NAT gateway, and route tables. When set,<br/>`public_subnet_ids` and `private_subnet_ids` are required and no<br/>networking is created: the private subnets must already have egress<br/>(NAT gateway or equivalent) so tasks can reach LLM providers, ECR/GHCR,<br/>and Secrets Manager. | `string` | `""` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_alb_dns_name"></a> [alb\_dns\_name](#output\_alb\_dns\_name) | Public DNS name of the LiteLLM ALB. |
| <a name="output_alb_url"></a> [alb\_url](#output\_alb\_url) | Proxy URL. Switches scheme based on whether acm\_certificate\_arn is set; the underlying DNS name is the ALB. The dashboard is served at /, the API at /v1/*. |
| <a name="output_aurora_reader_endpoint"></a> [aurora\_reader\_endpoint](#output\_aurora\_reader\_endpoint) | Aurora reader endpoint. Null when create\_database = false. |
| <a name="output_aurora_writer_endpoint"></a> [aurora\_writer\_endpoint](#output\_aurora\_writer\_endpoint) | Aurora writer endpoint used in the password-based DATABASE\_URL. Null when create\_database = false. |
| <a name="output_database_url_secret_arn"></a> [database\_url\_secret\_arn](#output\_database\_url\_secret\_arn) | Secrets Manager reference injected as DATABASE\_URL, or null when running without a database. |
| <a name="output_db_master_password_secret_arn"></a> [db\_master\_password\_secret\_arn](#output\_db\_master\_password\_secret\_arn) | Secrets Manager ARN holding the managed Aurora credentials as JSON. Null when create\_database = false. |
| <a name="output_ecs_cluster"></a> [ecs\_cluster](#output\_ecs\_cluster) | ECS cluster name. |
| <a name="output_master_key_secret_arn"></a> [master\_key\_secret\_arn](#output\_master\_key\_secret\_arn) | Secrets Manager ARN holding LITELLM\_MASTER\_KEY. Fetch with `aws secretsmanager get-secret-value --secret-id <arn>`. |
| <a name="output_redis_endpoint"></a> [redis\_endpoint](#output\_redis\_endpoint) | ElastiCache Redis primary endpoint (TLS, transit\_encryption\_enabled = true). Null when `create_redis = false`. |
| <a name="output_s3_bucket"></a> [s3\_bucket](#output\_s3\_bucket) | S3 bucket name exposed to LiteLLM as S3\_BUCKET\_NAME / S3\_REGION\_NAME. |
| <a name="output_task_security_group_id"></a> [task\_security\_group\_id](#output\_task\_security\_group\_id) | Security group attached to the ECS tasks. Allow inbound from this group on an existing database or Redis reached over `database_url` / `redis_url`. |
| <a name="output_vpc_id"></a> [vpc\_id](#output\_vpc\_id) | VPC the stack runs in, whether module-created or passed in via `vpc_id`. |
