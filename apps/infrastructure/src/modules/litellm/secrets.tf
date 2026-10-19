resource "random_password" "master_key" {
  length      = 48
  special     = false
  min_lower   = 4
  min_upper   = 4
  min_numeric = 4
}

# Reuse the existing password for the managed Aurora connection URL.
resource "random_password" "db_master_password" {
  count       = var.create_database ? 1 : 0
  length      = 32
  special     = false
  min_lower   = 4
  min_upper   = 4
  min_numeric = 4
}

# LITELLM_MASTER_KEY — must begin with `sk-` per the proxy's validator.
resource "aws_secretsmanager_secret" "master_key" {
  name                    = "${local.name}-master-key"
  description             = "LITELLM_MASTER_KEY for LiteLLM."
  recovery_window_in_days = 0

  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "master_key" {
  secret_id = aws_secretsmanager_secret.master_key.id
  # When the operator passes litellm_master_key, use it verbatim. Otherwise
  # fall back to the auto-generated `sk-…` value (trial / OSS path).
  secret_string = coalesce(var.litellm_master_key, "sk-${random_password.master_key.result}")
}

# LITELLM_LICENSE — only created when the operator supplies one. The
# task-execution role gets GetSecretValue via iam.tf.
resource "aws_secretsmanager_secret" "license" {
  count = nonsensitive(var.litellm_license != "") ? 1 : 0

  name                    = "${local.name}-license"
  description             = "LITELLM_LICENSE for LiteLLM."
  recovery_window_in_days = 0

  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "license" {
  count = nonsensitive(var.litellm_license != "") ? 1 : 0

  secret_id     = aws_secretsmanager_secret.license[0].id
  secret_string = var.litellm_license
}

# UI_PASSWORD is optional; otherwise LiteLLM uses its master key for UI login.
resource "aws_secretsmanager_secret" "ui_password" {
  count = nonsensitive(var.ui_password != "") ? 1 : 0

  name                    = "${local.name}-ui-password"
  description             = "UI_PASSWORD for LiteLLM admin login."
  recovery_window_in_days = 0

  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "ui_password" {
  count = nonsensitive(var.ui_password != "") ? 1 : 0

  secret_id     = aws_secretsmanager_secret.ui_password[0].id
  secret_string = var.ui_password
}

# Billing-metrics mTLS material — only created when metering is enabled
# (billing_metrics_endpoint non-empty) and the operator supplied the PEM.
# The task-execution role gets GetSecretValue via iam.tf.
resource "aws_secretsmanager_secret" "billing_metrics_client_cert" {
  count = local.billing_metrics_client_cert_enabled ? 1 : 0

  name                    = "${local.name}-billing-metrics-client-cert"
  description             = "LITELLM_BILLING_METRICS_CLIENT_CERT for LiteLLM."
  recovery_window_in_days = 0

  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "billing_metrics_client_cert" {
  count = local.billing_metrics_client_cert_enabled ? 1 : 0

  secret_id     = aws_secretsmanager_secret.billing_metrics_client_cert[0].id
  secret_string = var.billing_metrics_client_cert_pem
}

resource "aws_secretsmanager_secret" "billing_metrics_client_key" {
  count = local.billing_metrics_client_key_enabled ? 1 : 0

  name                    = "${local.name}-billing-metrics-client-key"
  description             = "LITELLM_BILLING_METRICS_CLIENT_KEY for LiteLLM."
  recovery_window_in_days = 0

  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "billing_metrics_client_key" {
  count = local.billing_metrics_client_key_enabled ? 1 : 0

  secret_id     = aws_secretsmanager_secret.billing_metrics_client_key[0].id
  secret_string = var.billing_metrics_client_key_pem
}

resource "aws_secretsmanager_secret" "billing_metrics_ca_cert" {
  count = local.billing_metrics_ca_cert_enabled ? 1 : 0

  name                    = "${local.name}-billing-metrics-ca-cert"
  description             = "LITELLM_BILLING_METRICS_CA_CERT for LiteLLM."
  recovery_window_in_days = 0

  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "billing_metrics_ca_cert" {
  count = local.billing_metrics_ca_cert_enabled ? 1 : 0

  secret_id     = aws_secretsmanager_secret.billing_metrics_ca_cert[0].id
  secret_string = var.billing_metrics_ca_cert_pem
}

resource "aws_secretsmanager_secret" "db_master_password" {
  count                   = var.create_database ? 1 : 0
  name                    = "${local.name}-db-master-password"
  description             = "Aurora master-user credentials used by LiteLLM."
  recovery_window_in_days = 0

  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "db_master_password" {
  count     = var.create_database ? 1 : 0
  secret_id = aws_secretsmanager_secret.db_master_password[0].id
  secret_string = jsonencode({
    username = var.db_master_username
    password = random_password.db_master_password[0].result
    host     = aws_rds_cluster.this[0].endpoint
    port     = aws_rds_cluster.this[0].port
    dbname   = var.db_name
  })
}

# Bring-your-own connection strings. Both hold credentials, so they go to
# Secrets Manager and reach the containers as ECS `secrets` rather than as
# plain-text env in the task definition.
resource "aws_secretsmanager_secret" "database_url" {
  count = local.manage_database_url ? 1 : 0

  name                    = "${local.name}-database-url"
  description             = "Password-based PostgreSQL DATABASE_URL for LiteLLM."
  recovery_window_in_days = 0

  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "database_url" {
  count = local.manage_database_url ? 1 : 0

  secret_id = aws_secretsmanager_secret.database_url[0].id
  secret_string = var.create_database ? format(
    "postgresql://%s:%s@%s:%s/%s?sslmode=require",
    urlencode(var.db_master_username),
    urlencode(random_password.db_master_password[0].result),
    aws_rds_cluster.this[0].endpoint,
    aws_rds_cluster.this[0].port,
    urlencode(var.db_name),
  ) : var.database_url
}

resource "aws_secretsmanager_secret" "redis_url" {
  count = local.byo_redis ? 1 : 0

  name                    = "${local.name}-redis-url"
  description             = "REDIS_URL for an existing Redis, used when create_redis = false."
  recovery_window_in_days = 0

  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "redis_url" {
  count = local.byo_redis ? 1 : 0

  secret_id     = aws_secretsmanager_secret.redis_url[0].id
  secret_string = var.redis_url
}
