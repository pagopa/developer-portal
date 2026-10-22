# Curated surface for the one-command deploy path. The module (../../)
# exposes far more knobs (task CPU/memory, autoscaling, RDS/Redis
# sizing, …). To tune those, set them directly on the `module "litellm"`
# block in main.tf, or call the module from your own root config. Full
# per-variable docs live in ../../variables.tf — the module is the source
# of truth; descriptions here are intentionally terse.

variable "region" {
  description = "AWS region to deploy into."
  type        = string
}

variable "tenant" {
  description = "Tenant slug — prefix for every resource (<tenant>-litellm-<env>)."
  type        = string
}

variable "env" {
  description = "Environment suffix (stage, prod, dev)."
  type        = string
}

variable "gateway_scheduled_scaling_enabled" {
  description = "Stop gateway tasks daily at 19:00 and restart at least one at 08:00, following Europe/Rome local time."
  type        = bool
  default     = true
}

variable "azs" {
  description = "Availability zones for the subnets the module creates. At least 2 (RDS + ALB). Unused when vpc_id is set."
  type        = list(string)
  default     = []
}

# Bring-your-own networking. Leave vpc_id empty to have the module create the
# VPC, subnets, NAT gateway, and route tables.
variable "vpc_id" {
  description = "Existing VPC to deploy into. Empty → module creates its own networking."
  type        = string
  default     = ""
}

variable "public_subnet_ids" {
  description = "Existing public subnets for the ALB (≥ 2 AZs). Required with vpc_id."
  type        = list(string)
  default     = []
}

variable "private_subnet_ids" {
  description = "Existing private subnets for tasks, Aurora, and Redis. Required with vpc_id."
  type        = list(string)
  default     = []
}

variable "additional_task_security_group_ids" {
  description = "Extra security groups for the tasks, e.g. one an existing database already allows."
  type        = list(string)
  default     = []
}

# Bring-your-own data stores. create_* false with an empty URL runs without
# that component: no DB means no key management or spend tracking, no Redis
# means per-task rate limits instead of cluster-wide.
variable "create_database" {
  description = "Create the Aurora Postgres cluster. False → use database_url, or run DB-less."
  type        = bool
  default     = true
}

variable "database_url" {
  description = "Postgres connection string for an existing database. Read only when create_database = false."
  type        = string
  default     = ""
  sensitive   = true
}

variable "database_url_secret_arn" {
  description = "Existing Secrets Manager reference holding DATABASE_URL. Set create_database = false and leave database_url empty."
  type        = string
  default     = ""
}

variable "gateway_image" {
  description = "All-in-one LiteLLM image serving the API and UI on port 4000."
  type        = string
  default     = "ghcr.io/berriai/litellm:v1.106.2@sha256:7294b90f868c5c38c99b83021c7ba46f9b439e95f8e32964c925c7d2563a03f7"
}

variable "create_redis" {
  description = "Create the ElastiCache Redis group. False → use redis_url, or run without Redis."
  type        = bool
  default     = true
}

variable "redis_url" {
  description = "Connection string for an existing Redis. Read only when create_redis = false."
  type        = string
  default     = ""
  sensitive   = true
}

# Sensitive — prefer TF_VAR_litellm_master_key / TF_VAR_litellm_license /
# TF_VAR_ui_password so values stay out of any committed tfvars file.
variable "litellm_master_key" {
  description = "Pre-existing LITELLM_MASTER_KEY (sk-…). Empty → auto-generated."
  type        = string
  default     = ""
  sensitive   = true
}

variable "litellm_license" {
  description = "LiteLLM enterprise license. Empty → OSS-only."
  type        = string
  default     = ""
  sensitive   = true
}

variable "ui_password" {
  description = "UI admin password. Empty → falls back to LITELLM_MASTER_KEY."
  type        = string
  default     = ""
  sensitive   = true
}

# TLS — create a DNS-validated certificate, bring your own, or opt into HTTP-only.
variable "acm_certificate_arn" {
  description = "Existing ACM cert ARN for the ALB HTTPS listener. Empty creates a DNS-validated certificate unless allow_plaintext_alb is true."
  type        = string
  default     = ""
}

variable "hosted_zone_id" {
  description = "Public Route53 hosted zone for litellm.<zone-name> and its ACM DNS validation records."
  type        = string
  default     = "Z02428843GXDP0RBGX2EQ"
}

variable "allow_plaintext_alb" {
  description = "Opt into HTTP-only ALB (trial/dev only)."
  type        = bool
  default     = false
}

variable "s3_force_destroy" {
  description = "Allow destroy of a non-empty S3 bucket (ephemeral/CI only)."
  type        = bool
  default     = false
}

variable "skip_final_snapshot" {
  description = "Skip the Aurora final snapshot on destroy (ephemeral/CI only)."
  type        = bool
  default     = false
}

variable "proxy_config" {
  description = "LiteLLM proxy config (contents of config.yaml). Empty → defaults."
  type        = any
  default     = {}
}

variable "gateway_extra_env" {
  description = "Plain-text env vars layered onto the all-in-one LiteLLM container."
  type        = map(string)
  default     = {}
}

variable "backend_extra_env" {
  description = "Compatibility env vars merged into LiteLLM. gateway_extra_env wins on collisions."
  type        = map(string)
  default     = {}
}

variable "gateway_extra_secrets" {
  description = "LiteLLM env vars sourced from Secrets Manager (name to ARN)."
  type        = map(string)
  default     = {}
}

variable "backend_extra_secrets" {
  description = "Compatibility secrets merged into LiteLLM. gateway_extra_secrets wins on collisions."
  type        = map(string)
  default     = {}
}
