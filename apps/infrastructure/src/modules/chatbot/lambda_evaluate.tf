resource "aws_cloudwatch_log_group" "lambda_evaluate_logs" {
  name              = "/aws/lambda/${aws_lambda_function.chatbot_evaluate_lambda.function_name}"
  retention_in_days = 14
}

resource "aws_iam_role" "lambda_evaluate_role" {
  name                  = "${local.prefix}-evaluate-lambda"
  force_detach_policies = true
  assume_role_policy    = data.aws_iam_policy_document.lambda_assume_role.json
}


resource "aws_iam_role_policy" "lambda_evaluate_policy" {
  name = "${local.prefix}-evaluate-lambda"
  role = aws_iam_role.lambda_evaluate_role.id
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
        Resource = aws_sqs_queue.chatbot_queue["evaluate"].arn
      },
      {
        Effect = "Allow"
        Action = [
          "sqs:SendMessage",

        ]
        Resource = aws_sqs_queue.chatbot_dlq["evaluate"].arn
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
    ]
  })
}

locals {
  chatbot_evaluate_lambda_name = "${local.prefix}-evaluate-lambda"
}

resource "aws_lambda_function" "chatbot_evaluate_lambda" {
  function_name = local.chatbot_evaluate_lambda_name
  description   = "Lambda responsible injecting messages into langfuse"

  image_uri    = "${module.ecr["evaluate"].repository_url}:latest"
  package_type = "Image"

  timeout       = 600 # 10 minutes
  memory_size   = 848
  architectures = ["x86_64"]
  role          = aws_iam_role.lambda_evaluate_role.arn

  environment {
    variables = {
      #--- TODO ---#
      # REMOVE ALL LANGFUSE VARIABLES, THEY ARE NOT USED IN THIS LAMBDA, AND SHOULD NOT BE PRESENT
      CHB_AWS_SSM_LANGFUSE_PUBLIC_KEY = module.langfuse_public_key.ssm_parameter_name
      CHB_AWS_SSM_LANGFUSE_SECRET_KEY = module.langfuse_secret_key.ssm_parameter_name
      CHB_LANGFUSE_HOST               = "https://${local.priv_monitoring_host}"
      CHB_MODEL_TEMPERATURE           = 0
      CHB_MODEL_MAXTOKENS             = 2048
      CHB_AWS_SSM_GOOGLE_API_KEY      = module.google_api_key_ssm_parameter.ssm_parameter_name
      CHB_AWS_SSM_LANGFUSE_PUBLIC_KEY = module.langfuse_public_key.ssm_parameter_name
      CHB_AWS_SSM_LANGFUSE_SECRET_KEY = module.langfuse_secret_key.ssm_parameter_name
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
    Name = local.chatbot_evaluate_lambda_name
  }
}

resource "aws_lambda_event_source_mapping" "evaluate_lambda_sqs" {
  event_source_arn = aws_sqs_queue.chatbot_queue["evaluate"].arn
  function_name    = aws_lambda_function.chatbot_evaluate_lambda.arn
  enabled          = true
  batch_size       = 5
  #maximum_batching_window_in_seconds = 60
}


# Event invoke configuration for retries
resource "aws_lambda_function_event_invoke_config" "lambda_evaluate" {
  function_name = aws_lambda_function.chatbot_evaluate_lambda.function_name

  maximum_event_age_in_seconds = 60
  maximum_retry_attempts       = 1

  /*
  destination_config {
    on_failure {
      destination = aws_sqs_queue.chatbot_dlq["evaluate"].arn
    }

    on_success {
      destination = aws_sqs_queue.chatbot_dlq["evaluate"].arn
    }
  }
  */
}

