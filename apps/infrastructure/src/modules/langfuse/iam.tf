resource "aws_iam_role" "langfuse_ecs_task_execute_role" {
  name               = "Langfuse${title(var.environment)}EcsTaskExecuteRole"
  description        = "ECS Task Execution Role for Langfuse"
  path               = "/"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_execute_assume_policy.json
  tags = {
    Name = "langfuse_ecs_task_execute_role"
  }
}

data "aws_iam_policy_document" "ecs_task_execute_assume_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_policy" "langfuse_ecs_task_execute_role_policy" {
  name        = "langfuse${title(var.environment)}EcsTaskExecuteRolePolicy"
  description = "ECS Task Execution Policy for Langfuse"
  policy      = data.aws_iam_policy_document.ecs_task_execute_role_policy.json
  tags = {
    Name = "ecs_task_execute_role_policy"
  }
}

data "aws_iam_policy_document" "ecs_task_execute_role_policy" {
  statement {
    actions = [
      "secretsmanager:GetSecretValue",
    ]
    effect = "Allow"
    resources = [
      aws_secretsmanager_secret.clickhouse_password.arn,
      aws_secretsmanager_secret.langfuse_db_password.arn,
      aws_secretsmanager_secret.langfuse_database_url.arn,
    ]
  }

  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    effect = "Allow"
    resources = [
      "${aws_cloudwatch_log_group.clickhouse.arn}:*",
      "${aws_cloudwatch_log_group.langfuse_worker.arn}:*",
      "${aws_cloudwatch_log_group.langfuse_web.arn}:*",
    ]
  }

  # GetAuthorizationToken does not support resource-level permissions
  statement {
    actions = [
      "ecr:GetAuthorizationToken",
    ]
    effect    = "Allow"
    resources = ["*"]
  }

  # Image pull operations scoped to specific ECR repositories
  statement {
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
    ]
    effect = "Allow"
    resources = [
      for repo in aws_ecr_repository.repositories : repo.arn
    ]
  }
}

resource "aws_iam_role_policy_attachment" "ecs_task_execute_role_attachment" {
  role       = aws_iam_role.langfuse_ecs_task_execute_role.name
  policy_arn = aws_iam_policy.langfuse_ecs_task_execute_role_policy.arn
}

resource "aws_iam_policy" "langfuse_ssm_read" {
  name        = "Langfuse${title(var.environment)}SSMReadPolicy"
  description = "Task Role SSM Read Policy for Langfuse"
  policy      = data.aws_iam_policy_document.langfuse_ssm_read_policy_doc.json
  tags = {
    Name = "langfuse_ssm_read_policy"
  }
}

data "aws_iam_policy_document" "langfuse_ssm_read_policy_doc" {
  statement {
    actions = [
      "ssm:GetParameter",
      "ssm:GetParameters",
    ]
    effect = "Allow"
    resources = [
      "arn:aws:ssm:${var.region}:${data.aws_caller_identity.current.account_id}:parameter/chatbot/langfuse/*",
      # Include also chatbot monitoring parameters for shared use
      "arn:aws:ssm:${var.region}:${data.aws_caller_identity.current.account_id}:parameter/chatbot/monitoring/*",
    ]
  }
}

resource "aws_iam_role_policy_attachment" "langfuse_attach_ssm" {
  role       = aws_iam_role.langfuse_ecs_task_execute_role.name
  policy_arn = aws_iam_policy.langfuse_ssm_read.arn
}

resource "aws_iam_role" "langfuse_task_role" {
  name               = "Langfuse${title(var.environment)}TaskRole"
  description        = "Task Role for Langfuse"
  path               = "/"
  assume_role_policy = data.aws_iam_policy_document.langfuse_task_role_assume_policy.json
  tags = {
    Name = "langfuse_task_role"
  }
}

resource "aws_iam_policy" "langfuse_task_role_policy" {
  name        = "langfuse${title(var.environment)}TaskRolePolicy"
  description = "Task Role Policy for Langfuse"
  policy      = data.aws_iam_policy_document.langfuse_instance_role_policy.json
  tags = {
    Name = "task_role_policy"
  }
}

resource "aws_iam_role_policy_attachment" "task_role_policy_attachment" {
  role       = aws_iam_role.langfuse_task_role.name
  policy_arn = aws_iam_policy.langfuse_task_role_policy.arn
}

data "aws_iam_policy_document" "langfuse_task_role_assume_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "langfuse_instance_role_policy" {
  statement {
    actions = [
      "secretsmanager:*",
      "s3:*",
      "elasticfilesystem:ClientMount",
      "elasticfilesystem:ClientWrite",
    ]
    effect    = "Allow"
    resources = ["*"]
  }
}
