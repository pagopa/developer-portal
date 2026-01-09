resource "aws_iam_role" "apprunner_service_role" {
  name               = "LangfuseAppRunnerECRAccessRole"
  description        = "App Runner service role"
  path               = "/"
  assume_role_policy = data.aws_iam_policy_document.apprunner_service_assume_policy.json
  tags = {
    Name = "langfuse_apprunner_service_role"
  }
}

data "aws_iam_policy_document" "apprunner_service_assume_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["build.apprunner.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "apprunner_service_role_attachment" {
  role       = aws_iam_role.apprunner_service_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

resource "aws_iam_role" "apprunner_langfuse_instance_role" {
  name               = "LangfuseAppRunnerLangfuseInstanceRole"
  description        = "App Runner instance role"
  path               = "/"
  assume_role_policy = data.aws_iam_policy_document.apprunner_instance_assume_policy.json
  tags = {
    Name = "langfuse_apprunner_instance_role"
  }
}

resource "aws_iam_policy" "apprunner_langfuse_policy" {
  name        = "langfuseApprunnerLangfusePolicy"
  description = "App Runner Langfuse policy"
  policy      = data.aws_iam_policy_document.apprunner_langfuse_instance_role_policy.json
  tags = {
    Name = "langfuse_apprunner_langfuse_policy"
  }
}

resource "aws_iam_role_policy_attachment" "apprunner_langfuse_instance_role_attachment" {
  role       = aws_iam_role.apprunner_langfuse_instance_role.name
  policy_arn = aws_iam_policy.apprunner_langfuse_policy.arn
}

data "aws_iam_policy_document" "apprunner_instance_assume_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["tasks.apprunner.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "apprunner_langfuse_instance_role_policy" {
  statement {
    actions   = ["secretsmanager:*", "s3:*"]
    effect    = "Allow"
    resources = ["*"]
  }
}

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
      "secretsmanager:*",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
    ]
    effect    = "Allow"
    resources = ["*"]
  }
}

resource "aws_iam_role_policy_attachment" "ecs_task_execute_role_attachment" {
  role       = aws_iam_role.langfuse_ecs_task_execute_role.name
  policy_arn = aws_iam_policy.langfuse_ecs_task_execute_role_policy.arn
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
