variable "region" {
  description = "AWS region to deploy into."
  type        = string
}

variable "tenant" {
  description = "Tenant slug — used as the prefix for every AWS resource the stack creates. Combined with var.env to form `<tenant>-litellm-<env>` (e.g. `acme-litellm-stage`)."
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{0,20}$", var.tenant))
    error_message = "tenant must be 1-21 chars, lower-kebab-case, starting with a letter."
  }
}

variable "env" {
  description = "Environment suffix appended to every resource name (e.g. `stage`, `prod`, `dev`)."
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{0,8}$", var.env))
    error_message = "env must be 1-9 chars, lower-kebab-case, starting with a letter."
  }
}

variable "tags" {
  description = "Per-deployment tags applied to every taggable resource the module creates, on top of the module's own `litellm:stack` / `managed-by` tags. Caller-level provider `default_tags` (if any) merge with these."
  type        = map(string)
  default     = {}
}

# ---------- Tenant-supplied secrets ----------
#
# Both default to "" so the stack stays usable for trial / OSS deploys.
# Set via TF_VAR_litellm_master_key / TF_VAR_litellm_license to keep the
# values out of state files committed to a VCS.

variable "litellm_master_key" {
  description = <<-EOT
    Pre-existing LITELLM_MASTER_KEY (must begin with `sk-`). When set, this
    value is written to the master-key Secrets Manager entry. When empty,
    the stack auto-generates a random `sk-…` key (preserving today's
    trial-deploy behavior).
  EOT
  type        = string
  default     = ""
  sensitive   = true
}

variable "litellm_license" {
  description = <<-EOT
    LiteLLM enterprise license string. When set, the stack creates a
    `<tenant>-litellm-<env>-license` Secrets Manager entry, grants the
    task-execution role GetSecretValue on it, and exposes its value to
    LiteLLM as `LITELLM_LICENSE`. Leave empty for OSS-only deploys.
  EOT
  type        = string
  default     = ""
  sensitive   = true
}

variable "ui_password" {
  description = <<-EOT
    UI admin password. When set, the stack creates a
    `<tenant>-litellm-<env>-ui-password` Secrets Manager entry, grants the
    task-execution role GetSecretValue on it, and exposes its value to the
    proxy as `UI_PASSWORD`. Pair with `gateway_extra_env.UI_USERNAME` to
    set the matching username. Leave empty to skip — the proxy then falls
    back to the LITELLM_MASTER_KEY for UI login.
  EOT
  type        = string
  default     = ""
  sensitive   = true
}

# ---------- Networking ----------
#
# Two modes:
#
#   1. Module-owned (default, `vpc_id = ""`): the stack creates a VPC, public
#      and private subnets per AZ, an internet gateway, a NAT gateway, and
#      the route tables wiring them together. `vpc_cidr` + `azs` drive it.
#   2. Bring-your-own (`vpc_id` set): the stack creates no networking and
#      places the ALB in `public_subnet_ids` and every task, plus the Aurora
#      and ElastiCache subnet groups, in `private_subnet_ids`. `vpc_cidr` and
#      `azs` are then unused.

variable "vpc_id" {
  description = <<-EOT
    Existing VPC to deploy into. Leave empty ("") to have the module create
    its own VPC, subnets, NAT gateway, and route tables. When set,
    `public_subnet_ids` and `private_subnet_ids` are required and no
    networking is created: the private subnets must already have egress
    (NAT gateway or equivalent) so tasks can reach LLM providers, ECR/GHCR,
    and Secrets Manager.
  EOT
  type        = string
  default     = ""
}

variable "public_subnet_ids" {
  description = "Existing public subnets for the ALB, in at least 2 AZs. Required when `vpc_id` is set, ignored otherwise."
  type        = list(string)
  default     = []
}

variable "private_subnet_ids" {
  description = "Existing private subnets for the ECS tasks, Aurora, and ElastiCache. Required when `vpc_id` is set, ignored otherwise."
  type        = list(string)
  default     = []
}

variable "additional_task_security_group_ids" {
  description = <<-EOT
    Extra security groups to attach to the ECS tasks, on top of the one the
    module creates. Useful with `vpc_id`: attach a group your existing
    database or cache already allows inbound from, instead of editing their
    ingress rules.
  EOT
  type        = list(string)
  default     = []
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC the module creates. Unused when `vpc_id` is set."
  type        = string
  default     = "10.40.0.0/16"
}

variable "azs" {
  description = "Availability zones to spread the module-created subnets across. At least 2 required for Aurora and the ALB. Unused when `vpc_id` is set."
  type        = list(string)
  default     = []
}

# ---------- All-in-one service ----------

variable "gateway_image" {
  description = "All-in-one LiteLLM image serving the API and admin UI on port 4000."
  type        = string
  default     = "docker.litellm.ai/berriai/litellm:main-stable"
}

# ---------- Service sizing ----------

variable "gateway_cpu" {
  description = "Fargate CPU units for the all-in-one task (1024 = 1 vCPU)."
  type        = number
  default     = 1024
}

variable "gateway_memory" {
  description = "Fargate memory (MiB) for the all-in-one task."
  type        = number
  default     = 4096
}

variable "gateway_desired_count" {
  description = "Initial desired number of all-in-one tasks. Autoscaling owns subsequent changes."
  type        = number
  default     = 2
}

variable "gateway_num_workers" {
  description = "Worker processes per LiteLLM task (passed as --num_workers)."
  type        = number
  default     = 1

  validation {
    condition     = var.gateway_num_workers >= 1 && floor(var.gateway_num_workers) == var.gateway_num_workers
    error_message = "gateway_num_workers must be a positive integer."
  }
}

# ---------- Autoscaling ----------
# Defaults mirror helm/litellm/values.yaml HPAs. The "*_desired_count" vars
# above seed the initial task count; once autoscaling is enabled, the service's
# desired_count is left to Application Auto Scaling (ecs.tf ignores future
# changes to it).

variable "gateway_autoscaling_enabled" {
  description = "Toggle Application Auto Scaling target-tracking on the gateway service."
  type        = bool
  default     = true
}

variable "gateway_scheduled_scaling_enabled" {
  description = "Stop gateway tasks daily at 19:00 and restore a minimum of one task at 08:00 in Europe/Rome (including daylight saving). Requires gateway_autoscaling_enabled."
  type        = bool
  default     = false
}

variable "gateway_min_capacity" {
  description = "Minimum gateway task count under autoscaling."
  type        = number
  default     = 1
}

variable "gateway_max_capacity" {
  description = "Maximum gateway task count under autoscaling."
  type        = number
  default     = 10
}

variable "gateway_cpu_target" {
  description = "Target average CPU utilization (%) for the gateway autoscaling policy."
  type        = number
  default     = 70
}

variable "gateway_memory_target" {
  description = "Target average memory utilization (%) for the gateway autoscaling policy. Set 0 to skip the memory policy and scale on CPU only."
  type        = number
  default     = 80
}

variable "gateway_target_requests_per_second" {
  description = <<-EOT
    Requests per second one gateway task should serve. Adds an
    ALBRequestCountPerTarget target-tracking policy next to the CPU/memory
    ones (Application Auto Scaling follows whichever asks for more tasks).
    CloudWatch publishes that metric as a 1-minute count, so the policy
    targets 60x this value and ECS reacts on a ~1 minute cadence. 0 skips
    the policy.
  EOT
  type        = number
  default     = 0
}

variable "gateway_target_tokens_per_second" {
  description = <<-EOT
    Tokens per second one gateway task should serve. Adds a target-tracking
    policy on gateway_tokens_metric summed over each 60s period, divided by
    60 and by the service's Container Insights RunningTaskCount. Tokens are
    counted when a response completes, so the signal trails long streams.
    0 skips the policy.
  EOT
  type        = number
  default     = 0
}

variable "gateway_tokens_metric" {
  description = <<-EOT
    CloudWatch metric carrying the gateway's litellm_total_tokens_metric_total
    counter, as published by the CloudWatch agent's Prometheus scraper (it
    emits the delta between scrapes, so Sum over a period is the tokens
    served in it). Required when gateway_target_tokens_per_second > 0.
    dimensions must match the metric_declaration the agent publishes with.
  EOT
  type = object({
    namespace  = string
    name       = optional(string, "litellm_total_tokens_metric_total")
    dimensions = optional(map(string), {})
  })
  default = null
}

# ---------- RDS ----------

variable "create_database" {
  description = <<-EOT
    Create the Aurora Postgres cluster (default). Set false to skip it and
    either use an existing database via database_url or database_url_secret_arn,
    or run without a database when both are empty. The
    DB-less mode drops key management, spend tracking, and the admin UI's
    persistence: the proxy then serves traffic authenticated by
    LITELLM_MASTER_KEY only.
  EOT
  type        = bool
  default     = true
}

variable "database_url" {
  description = <<-EOT
    Postgres connection string for an existing database, e.g.
    `postgresql://user:pass@host:5432/litellm`. Only read when
    `create_database = false`. Stored in a
    `<tenant>-litellm-<env>-database-url` Secrets Manager entry and injected
    into LiteLLM as DATABASE_URL, so the value never lands in a task definition.
    Mutually exclusive with database_url_secret_arn.
  EOT
  type        = string
  default     = ""
  sensitive   = true
}

variable "database_url_secret_arn" {
  description = "Existing Secrets Manager ARN holding a complete PostgreSQL DATABASE_URL (optionally with an ECS JSON-key suffix). Set create_database = false and leave database_url empty. Terraform does not read or manage its value."
  type        = string
  default     = ""

  validation {
    condition     = var.database_url_secret_arn == "" || can(regex("^arn:[^:]+:secretsmanager:[^:]+:[0-9]{12}:secret:.+", var.database_url_secret_arn))
    error_message = "database_url_secret_arn must be a Secrets Manager secret ARN, optionally with an ECS JSON-key suffix."
  }
}

variable "db_instance_class" {
  description = "Aurora instance class for both writer and reader."
  type        = string
  default     = "db.r6g.large"
}

variable "db_engine_version" {
  description = "Aurora Postgres engine version. Major version drives the parameter-group family (aurora-postgresql<major>)."
  type        = string
  default     = "16.15"
}

variable "db_name" {
  description = "Initial database name created on the Aurora cluster."
  type        = string
  default     = "litellm"
}

variable "db_master_username" {
  description = "Aurora master username used for the managed password-based DATABASE_URL."
  type        = string
  default     = "postgres"
}

# ---------- Redis ----------

variable "create_redis" {
  description = <<-EOT
    Create the ElastiCache Redis replication group (default). Set false to
    skip it and either point the stack at an existing cache via `redis_url`,
    or run with no Redis at all when `redis_url` is also empty. Without
    Redis the proxy loses cross-task state: rate limits, budgets, and the
    router's cooldowns become per-task instead of cluster-wide.
  EOT
  type        = bool
  default     = true
}

variable "redis_url" {
  description = <<-EOT
    Connection string for an existing Redis, e.g.
    `rediss://:password@host:6379`. Only read when `create_redis = false`.
    Stored in a `<tenant>-litellm-<env>-redis-url` Secrets Manager entry and
    injected as REDIS_URL, which takes precedence over REDIS_HOST/REDIS_PORT
    in the proxy.
  EOT
  type        = string
  default     = ""
  sensitive   = true
}

variable "redis_node_type" {
  description = "ElastiCache node type."
  type        = string
  default     = "cache.t4g.small"
}

variable "redis_num_replicas" {
  description = "Number of read replicas in the Redis replication group. The primary plus this many replicas form the cluster — set to 0 for a single-node dev deployment, 1+ for HA. multi_az_enabled and automatic_failover_enabled require >= 1."
  type        = number
  default     = 1

  validation {
    condition     = var.redis_num_replicas >= 0
    error_message = "redis_num_replicas must be >= 0."
  }
}

# ---------- TLS ----------

variable "enable_https" {
  description = "Explicitly enable or disable HTTPS. Set true when the certificate ARN is not known until apply. Null infers HTTPS from acm_certificate_arn."
  type        = bool
  default     = null
}

variable "acm_certificate_arn" {
  description = <<-EOT
    ACM certificate ARN for the ALB's HTTPS listener. When set, the stack
    provisions a 443 listener carrying the same path-routing rules as the 80
    listener, and the 80 listener is rewritten to redirect HTTP→HTTPS. Leave
    empty ("") to disable TLS (must combine with `allow_plaintext_alb = true`
    for the plan to succeed — see README.md "TLS").
  EOT
  type        = string
  default     = ""
}

variable "allow_plaintext_alb" {
  description = <<-EOT
    Opt into HTTP-only mode on the ALB (port 80, no TLS). Default false:
    `terraform plan` fails when `acm_certificate_arn = ""` so the operator
    must either provide an ACM cert or consciously opt out. Intended for
    short-lived trial / dev stacks only.
  EOT
  type        = bool
  default     = false
}

# ---------- RDS ----------

variable "skip_final_snapshot" {
  description = "Skip the Aurora final snapshot on `terraform destroy`. Default false — destroying the cluster takes a snapshot first so data is recoverable. Set true only for ephemeral / CI environments where you accept permanent data loss on destroy."
  type        = bool
  default     = false
}

variable "s3_force_destroy" {
  description = <<-EOT
    Allow `terraform destroy` to delete the S3 bucket even when it still
    contains objects (request log archives, /v1/files storage, S3 cache
    backend). Default false — destroying a non-empty bucket fails, acting
    as a tripwire against accidental data loss. Set true only for
    ephemeral / CI environments. Mirrors the safety posture of
    `skip_final_snapshot` on Aurora.
  EOT
  type        = bool
  default     = false
}

# ---------- Extra env ----------

variable "gateway_extra_env" {
  description = <<-EOT
    Additional plain-text env vars for the gateway container. Use this for
    non-sensitive config (LANGFUSE_HOST, custom feature flags, …). For API
    keys, use gateway_extra_secrets instead.
  EOT
  type        = map(string)
  default     = {}
}

variable "backend_extra_env" {
  description = "Compatibility input merged into the all-in-one container. gateway_extra_env wins on collisions."
  type        = map(string)
  default     = {}
}

variable "gateway_extra_secrets" {
  description = <<-EOT
    Extra env vars sourced from AWS Secrets Manager. Map of env-var name to
    Secrets Manager ARN. Pass the bare secret ARN to inject the whole secret
    string as the env var value, or append ":<jsonKey>::" to extract a single
    JSON field (ECS docs).

    Example for OPENAI_API_KEY:
      gateway_extra_secrets = {
        OPENAI_API_KEY = "arn:aws:secretsmanager:us-west-2:111122223333:secret:openai-api-key-AbCdEf"
      }

    The stack's task execution role automatically gains GetSecretValue on every
    ARN referenced here (suffix-stripped).
  EOT
  type        = map(string)
  default     = {}
}

variable "backend_extra_secrets" {
  description = "Compatibility input merged into the all-in-one container. gateway_extra_secrets wins on collisions."
  type        = map(string)
  default     = {}
}

variable "proxy_config" {
  description = <<-EOT
    LiteLLM proxy config (the contents of config.yaml). Mirrors the helm
    chart's `gateway.config.proxy_config` value. Uploaded to S3 under
    `config/litellm-config.yaml` in the stack's bucket; the LiteLLM
    container downloads it to /tmp/litellm-config.yaml at task
    start (CONFIG_FILE_PATH is set automatically). The S3 object's etag is
    wired into the task definition, so editing this value produces a new
    task-def revision and a rolling redeploy.

    Example:
      proxy_config = {
        model_list = [
          {
            model_name = "gpt-4o"
            litellm_params = {
              model   = "openai/gpt-4o"
              api_key = "os.environ/OPENAI_API_KEY"
            }
          },
        ]
        general_settings = {
          master_key       = "os.environ/LITELLM_MASTER_KEY"
          database_url     = "os.environ/DATABASE_URL"
          ui_username      = "admin"
        }
      }

    Leave empty ({}) to skip mounting a config — the proxy then runs with
    defaults. Use the "os.environ/<NAME>" syntax in the YAML to reference
    env vars provided by *_extra_env or *_extra_secrets.
  EOT
  type        = any
  default     = {}
}

variable "log_retention_days" {
  description = "CloudWatch log retention for the LiteLLM service."
  type        = number
  default     = 30
}

# ---------- OpenTelemetry v2 ----------
#
# https://docs.litellm.ai/docs/observability/opentelemetry_v2
#
# OTel v2 is opt-in and gated entirely on otel_endpoint, matching the GCP
# stack. Leave otel_endpoint = "" and nothing OTel-related lands in the
# container env. Set it and LiteLLM gains LITELLM_OTEL_V2=true
# plus the OTEL_* block (OTEL_SERVICE_NAME, exporter, endpoint,
# environment name, capture-content), with OTEL_HEADERS sourced from
# otel_headers_secret_arn when provided.

variable "otel_endpoint" {
  description = <<-EOT
    OTLP collector endpoint (sets OTEL_ENDPOINT). Empty disables OTel
    entirely (no LITELLM_OTEL_V2, no OTEL_* env). Point at any
    OTLP-compatible backend (self-hosted collector, Grafana Tempo,
    Honeycomb, Datadog). Example: "http://otel-collector.internal:4318"
    for OTLP/HTTP.
  EOT
  type        = string
  default     = ""
}

variable "otel_exporter" {
  description = <<-EOT
    OTLP exporter protocol. One of "otlp_http", "otlp_grpc", or "console"
    (stdout, useful for verifying instrumentation against CloudWatch logs).
    Ignored when otel_endpoint is empty.
  EOT
  type        = string
  default     = "otlp_http"

  validation {
    condition     = contains(["otlp_http", "otlp_grpc", "console"], var.otel_exporter)
    error_message = "otel_exporter must be one of: otlp_http, otlp_grpc, console."
  }
}

variable "otel_environment_name" {
  description = <<-EOT
    Value for OTEL_ENVIRONMENT_NAME (becomes `deployment.environment` on
    every span). Defaults to var.env when empty so spans land tagged with
    the deployment env without extra wiring.
  EOT
  type        = string
  default     = ""
}

variable "otel_capture_message_content" {
  description = <<-EOT
    Value for OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT. Default
    `no_content` matches the litellm default; flip to `prompt_and_completion`
    only when you've audited what's about to land in your observability
    backend, because raw prompts/completions are typically sensitive.
  EOT
  type        = string
  default     = "no_content"

  validation {
    condition     = contains(["no_content", "prompt_and_completion"], var.otel_capture_message_content)
    error_message = "otel_capture_message_content must be one of: no_content, prompt_and_completion."
  }
}

variable "otel_headers_secret_arn" {
  description = <<-EOT
    Secrets Manager ARN whose plaintext value becomes OTEL_HEADERS
    (comma-separated `key=value` pairs, typically used to pass an API key
    header to a managed collector). The execution role auto-gains
    secretsmanager:GetSecretValue on this ARN. Empty omits OTEL_HEADERS.
  EOT
  type        = string
  default     = ""
}

# ---------- Enterprise billing metrics ----------
#
# License-gated request metering. Opt-in and gated entirely on
# billing_metrics_endpoint: leave it empty (the default) and nothing
# metering-related lands in the container env. Set it and LiteLLM
# export billable-request counts over OTLP/HTTP, authenticating to the
# collector with an mTLS client cert. The proxy accepts the cert, key, and CA
# as either a file path or literal PEM content, so on Fargate they are
# injected straight from Secrets Manager as env vars and no volume is needed.

variable "billing_metrics_endpoint" {
  description = <<-EOT
    OTLP/HTTP endpoint for enterprise billing metrics (sets
    LITELLM_BILLING_METRICS_ENDPOINT). Non-empty enables request metering;
    empty (default) disables it and adds no billing env to the container.
    Requires an enterprise license. Example:
    "https://telemetry.litellm.ai/v1/metrics"
  EOT
  type        = string
  default     = ""
}

variable "billing_metrics_client_cert_pem" {
  description = <<-EOT
    PEM content of the mTLS client certificate issued for this deployment.
    When billing_metrics_endpoint is set, the stack stores this in a
    `<tenant>-litellm-<env>-billing-metrics-client-cert` Secrets Manager
    entry, grants the task-execution role GetSecretValue on it, and exposes
    it to LiteLLM as LITELLM_BILLING_METRICS_CLIENT_CERT. Required
    whenever metering is enabled.
  EOT
  type        = string
  default     = ""
  sensitive   = true
}

variable "billing_metrics_client_key_pem" {
  description = <<-EOT
    PEM content of the private key matching
    billing_metrics_client_cert_pem. Stored in a
    `<tenant>-litellm-<env>-billing-metrics-client-key` Secrets Manager
    entry and exposed as LITELLM_BILLING_METRICS_CLIENT_KEY. Required
    whenever metering is enabled.
  EOT
  type        = string
  default     = ""
  sensitive   = true
}

variable "billing_metrics_ca_cert_pem" {
  description = <<-EOT
    PEM content of the CA bundle used to verify the metering collector.
    Only needed for private or test collectors whose CA is not in the
    system trust store; telemetry.litellm.ai is publicly trusted, so leave
    this empty for production. When set, it is exposed as
    LITELLM_BILLING_METRICS_CA_CERT.
  EOT
  type        = string
  default     = ""
  sensitive   = true
}
