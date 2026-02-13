data "aws_iam_policy_document" "lambda_s3_policy" {
  statement {
    sid       = "ListObjectsInBucket"
    effect    = "Allow"
    actions   = ["s3:ListBucket"]
    resources = [module.s3_bucket_llamaindex.s3_bucket_arn, module.s3_bucket_kb.s3_bucket_arn]
  }

  statement {
    sid       = "ReadWriteInBucket"
    effect    = "Allow"
    actions   = ["s3:*Object"]
    resources = ["${module.s3_bucket_llamaindex.s3_bucket_arn}/*", "${module.s3_bucket_kb.s3_bucket_arn}/*"]
  }
}

data "aws_iam_policy_document" "lambda_dynamodb_policy" {
  statement {
    sid    = "AllowDynamoDBItemOperations"
    effect = "Allow"
    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:BatchWriteItem",
      "dynamodb:ConditionCheckItem",
      "dynamodb:PutItem",
      "dynamodb:DeleteItem",
      "dynamodb:GetItem",
      "dynamodb:Scan",
      "dynamodb:Query",
      "dynamodb:UpdateItem",
      "dynamodb:GetRecords"
    ]
    resources = [
      module.dynamodb_chatbot_queries.dynamodb_table_arn,
      "${module.dynamodb_chatbot_queries.dynamodb_table_arn}/*",
      module.dynamodb_chatbot_sessions.dynamodb_table_arn,
      "${module.dynamodb_chatbot_sessions.dynamodb_table_arn}/*",
      module.dynamodb_chatbot_salts.dynamodb_table_arn,
      "${module.dynamodb_chatbot_salts.dynamodb_table_arn}/*"
    ]
  }
}

data "aws_iam_policy_document" "lambda_ssm_policy" {
  statement {
    sid    = "AllowSSMOperations"
    effect = "Allow"
    actions = [
      "ssm:GetParameter",
      "ssm:GetParameters"
    ]
    resources = ["arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/chatbot/*"]
  }
}


data "aws_caller_identity" "current" {}

data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_iam_policy_document" "ecs_task_role_ssm" {
  statement {
    effect = "Allow"
    actions = [
      "ssmmessages:CreateControlChannel",
      "ssmmessages:CreateDataChannel",
      "ssmmessages:OpenControlChannel",
      "ssmmessages:OpenDataChannel"
    ]
    resources = [
      "*"
    ]
  }
}

data "aws_iam_policy_document" "apigateway_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["apigateway.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "apigateway_cloudwatch" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:DescribeLogGroups",
      "logs:DescribeLogStreams",
      "logs:PutLogEvents",
      "logs:GetLogEvents",
      "logs:FilterLogEvents",
    ]

    resources = ["*"]
  }
}

data "aws_iam_policy_document" "deploy_github" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_repository}:*"]
    }

    condition {
      test     = "ForAllValues:StringEquals"
      variable = "token.actions.githubusercontent.com:iss"
      values   = ["https://token.actions.githubusercontent.com"]
    }

    condition {
      test     = "ForAllValues:StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
  }
}

resource "aws_iam_policy" "deploy_chatbot" {
  name        = "DeployChatbot"
  description = "Policy to allow to deploy the chatbot"
  policy      = data.aws_iam_policy_document.deploy_chatbot.json
}

data "aws_iam_policy_document" "deploy_chatbot" {
  # ECR GetAuthorizationToken is a global action and cannot be scoped
  statement {
    sid       = "ECRGetAuthorizationToken"
    effect    = "Allow"
    actions   = ["ecr:GetAuthorizationToken"]
    resources = ["*"]
  }

  # ECR push permissions scoped to chatbot repositories
  statement {
    sid    = "ECRPushImages"
    effect = "Allow"
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:BatchGetImage",
      "ecr:CompleteLayerUpload",
      "ecr:InitiateLayerUpload",
      "ecr:PutImage",
      "ecr:UploadLayerPart",
    ]
    resources = [for repo in local.ecr_repos : "arn:aws:ecr:${var.aws_region}:${data.aws_caller_identity.current.account_id}:repository/${repo.repository_name}"]
  }

  # Lambda update permissions scoped to chatbot functions
  statement {
    sid    = "LambdaUpdateFunctionCode"
    effect = "Allow"
    actions = [
      "lambda:GetFunction",
      "lambda:UpdateFunctionCode",
    ]
    resources = [
      "arn:aws:lambda:${var.aws_region}:${data.aws_caller_identity.current.account_id}:function:${local.prefix}-api-lambda",
      "arn:aws:lambda:${var.aws_region}:${data.aws_caller_identity.current.account_id}:function:${local.prefix}-evaluate-lambda",
      "arn:aws:lambda:${var.aws_region}:${data.aws_caller_identity.current.account_id}:function:${local.prefix}-index-lambda",
      "arn:aws:lambda:${var.aws_region}:${data.aws_caller_identity.current.account_id}:function:${local.prefix}-monitor-lambda",
    ]
  }
}

data "aws_iam_policy_document" "ecs_monitoring_ssm_policy" {
  statement {
    sid    = "AllowSSMOperations"
    effect = "Allow"
    actions = [
      "ssm:GetParameter",
      "ssm:GetParameters"
    ]
    resources = ["arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/chatbot/monitoring/*"]
  }
}
