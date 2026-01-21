resource "random_password" "langfuse_db_password" {
  length           = 16
  special          = true
  override_special = "_!%^"
}

resource "aws_secretsmanager_secret" "langfuse_db_password" {
  name_prefix = "langfuse_database_password"
}

resource "aws_secretsmanager_secret_version" "langfuse_db_password" {
  secret_id     = aws_secretsmanager_secret.langfuse_db_password.id
  secret_string = random_password.langfuse_db_password.result
}

resource "aws_secretsmanager_secret" "langfuse_database_url" {
  name_prefix = "langfuse_database_url"
}

resource "aws_secretsmanager_secret_version" "langfuse_database_url" {
  secret_id     = aws_secretsmanager_secret.langfuse_database_url.arn
  secret_string = "postgresql://${var.database_user}:${aws_secretsmanager_secret_version.langfuse_db_password.secret_string}@${aws_rds_cluster.langfuse_aurora_cluster.endpoint}:5432/langfuse"
}

resource "random_password" "clickhouse_password" {
  length           = 16
  special          = true
  override_special = "_!%^"
}

resource "aws_secretsmanager_secret" "clickhouse_password" {
  name_prefix = "clickhouse_password"
}

resource "aws_secretsmanager_secret_version" "clickhouse_password" {
  secret_id     = aws_secretsmanager_secret.clickhouse_password.id
  secret_string = random_password.clickhouse_password.result
}

# resource "random_password" "grafana_admin_password" {
#   length           = 16
#   special          = true
#   override_special = "!#$%&*()-_=+[]{}<>:?"
# }
#
# resource "aws_secretsmanager_secret" "grafana_admin_password" {
#   name_prefix = "grafana_admin_password"
# }
#
# resource "aws_secretsmanager_secret_version" "grafana_admin_password" {
#   secret_id     = aws_secretsmanager_secret.grafana_admin_password.id
#   secret_string = random_password.grafana_admin_password.result
# }
