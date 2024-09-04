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

  statement {
    sid    = "BedrockPermissions"
    effect = "Allow"
    actions = [
      "bedrock:ApplyGuardrail",
      "bedrock:ListGuardrails",
      "bedrock:GetGuardrail",
      "bedrock:InvokeModel",
      "bedrock:InvokeModelWithResponseStream",
      "bedrock:ListFoundationModels"
    ]
    resources = ["*"]
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