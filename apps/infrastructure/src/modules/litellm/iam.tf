data "aws_iam_policy_document" "task_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "task_execution" {
  name               = "${local.name}-task-execution"
  assume_role_policy = data.aws_iam_policy_document.task_assume.json
  tags               = local.tags
}

resource "aws_iam_role_policy_attachment" "task_execution" {
  role       = aws_iam_role.task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

locals {
  extra_secret_value_froms = concat(
    values(local.extra_secrets),
    var.database_url_secret_arn != "" ? [var.database_url_secret_arn] : [],
    var.otel_headers_secret_arn != "" ? [var.otel_headers_secret_arn] : [],
  )

  # ECS JSON-key and version suffixes are not part of the IAM resource ARN.
  extra_secret_arns = distinct([
    for value_from in local.extra_secret_value_froms :
    join(":", slice(split(":", value_from), 0, 7))
  ])
}

data "aws_iam_policy_document" "secrets_access" {
  statement {
    actions = ["secretsmanager:GetSecretValue"]
    resources = concat(
      [aws_secretsmanager_secret.master_key.arn],
      aws_secretsmanager_secret.license[*].arn,
      aws_secretsmanager_secret.ui_password[*].arn,
      aws_secretsmanager_secret.billing_metrics_client_cert[*].arn,
      aws_secretsmanager_secret.billing_metrics_client_key[*].arn,
      aws_secretsmanager_secret.billing_metrics_ca_cert[*].arn,
      aws_secretsmanager_secret.database_url[*].arn,
      aws_secretsmanager_secret.redis_url[*].arn,
      local.extra_secret_arns,
    )
  }
}

resource "aws_iam_policy" "secrets_access" {
  name   = "${local.name}-secrets-access"
  policy = data.aws_iam_policy_document.secrets_access.json
  tags   = local.tags
}

resource "aws_iam_role_policy_attachment" "task_execution_secrets" {
  role       = aws_iam_role.task_execution.name
  policy_arn = aws_iam_policy.secrets_access.arn
}

resource "aws_iam_role" "task" {
  name               = "${local.name}-task"
  assume_role_policy = data.aws_iam_policy_document.task_assume.json
  tags               = local.tags
}
