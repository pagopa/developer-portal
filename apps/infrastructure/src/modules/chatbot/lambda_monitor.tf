resource "aws_cloudwatch_log_group" "lambda_monitor_logs" {
  name              = "/aws/lambda/${aws_lambda_function.chatbot_monitor_lambda.function_name}"
  retention_in_days = 14
}

resource "aws_iam_role" "lambda_monitor_role" {
  name                  = "${local.prefix}-monitor-lambda"
  force_detach_policies = true
  assume_role_policy    = data.aws_iam_policy_document.lambda_assume_role.json
}


resource "aws_iam_role_policy" "lambda_monitor_policy" {
  name = "${local.prefix}-monitor-lambda"
  role = aws_iam_role.lambda_monitor_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:ListTagsForResource",
          "ecr:ListImages",
          "ecr:GetRepositoryPolicy",
          "ecr:GetLifecyclePolicyPreview",
          "ecr:GetLifecyclePolicy",
          "ecr:DescribeRepositories",
          "ecr:DescribeImages",
          "ecr:DescribeImageScanFindings",
        ]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters"
        ]
        Effect = "Allow"
        Resource = [
          module.langfuse_public_key.ssm_parameter_arn,
          module.langfuse_secret_key.ssm_parameter_arn,
          module.google_api_key_ssm_parameter.ssm_parameter_arn,
          module.langfuse_public_key.ssm_parameter_arn,
          module.langfuse_secret_key.ssm_parameter_arn,
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes",
        ]
        Resource = aws_sqs_queue.chatbot_queue["monitor"].arn
      },
      {
        Effect = "Allow"
        Action = [
          "sqs:SendMessage",

        ]
        Resource = aws_sqs_queue.chatbot_dlq["monitor"].arn
      },
      {
        Effect = "Allow"
        Action = [
          "ec2:CreateNetworkInterface",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:Query",
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem"
        ]
        Resource = [
          module.dynamodb_chatbot_sessions.dynamodb_table_arn,
          "${module.dynamodb_chatbot_sessions.dynamodb_table_arn}/index/*",
          module.dynamodb_chatbot_queries.dynamodb_table_arn,
          "${module.dynamodb_chatbot_queries.dynamodb_table_arn}/index/*",
          module.dynamodb_chatbot_salts.dynamodb_table_arn,
          "${module.dynamodb_chatbot_salts.dynamodb_table_arn}/index/*"
        ]
      }
    ]
  })
}

locals {
  chatbot_monitor_lambda_name = "${local.prefix}-monitor-lambda"
}

resource "aws_lambda_function" "chatbot_monitor_lambda" {
  function_name = local.chatbot_monitor_lambda_name
  description   = "Lambda responsible for monitoring chatbot interactions"

  image_uri    = "${module.ecr["monitor"].repository_url}:latest"
  package_type = "Image"

  timeout       = 600 # 10 minutes
  memory_size   = 848
  architectures = ["arm64"]
  role          = aws_iam_role.lambda_monitor_role.arn

  environment {
    variables = {
      CHB_AWS_SSM_LANGFUSE_PUBLIC_KEY = module.langfuse_public_key.ssm_parameter_name
      CHB_AWS_SSM_LANGFUSE_SECRET_KEY = module.langfuse_secret_key.ssm_parameter_name
      CHB_LANGFUSE_HOST               = "https://${local.priv_monitoring_host}"
      RAGAS_DO_NOT_TRACK              = "True"
    }
  }

  vpc_config {
    subnet_ids         = var.vpc.private_subnets
    security_group_ids = [aws_security_group.lambda.id]
  }

  lifecycle {
    ignore_changes = [
      image_uri
    ]
  }

  depends_on = [module.ecr]

  tags = {
    Name = local.chatbot_monitor_lambda_name
  }
}

resource "aws_lambda_event_source_mapping" "monitor_lambda_sqs" {
  event_source_arn = aws_sqs_queue.chatbot_queue["monitor"].arn
  function_name    = aws_lambda_function.chatbot_monitor_lambda.arn
  enabled          = true
  batch_size       = 5
  #maximum_batching_window_in_seconds = 60
}


# Event invoke configuration for retries
resource "aws_lambda_function_event_invoke_config" "lambda_monitor" {
  function_name = aws_lambda_function.chatbot_monitor_lambda.function_name

  maximum_event_age_in_seconds = 60
  maximum_retry_attempts       = 1

  /*
  destination_config {
    on_failure {
      destination = aws_sqs_queue.chatbot_dlq["monitor"].arn
    }

    on_success {
      destination = aws_sqs_queue.chatbot_dlq["monitor"].arn
    }
  }
  */
}
