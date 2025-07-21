resource "aws_cloudwatch_log_group" "lambda_monitor_logs" {
  name              = "/aws/lambda/${aws_lambda_function.chatbot_monitor_lambda.function_name}"
  retention_in_days = 14
}

resource "aws_iam_role" "lambda_monitor_role" {
  name                  = "${local.prefix}-monitor-lambda"
  force_detach_policies = true
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
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
          "ecr:BatchGetImage"
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
          module.langfuse_secret_key.ssm_parameter_arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes",
        ]
        Resource = aws_sqs_queue.chatbot_monitor_queue.arn
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

resource "aws_lambda_function" "chatbot_monitor_lambda" {
  function_name = "${local.prefix}-monitor-lambda"
  description   = "Lambda responsible injecting messages into langfuse"

  image_uri    = "${module.ecr["monitor"].repository_url}:latest"
  package_type = "Image"

  timeout       = 30
  memory_size   = 1024
  architectures = ["x86_64"]
  role          = aws_iam_role.lambda_monitor_role.arn

  environment {
    variables = {
      CHB_AWS_SSM_LANGFUSE_PUBLIC_KEY = module.langfuse_public_key.ssm_parameter_name
      CHB_AWS_SSM_LANGFUSE_SECRET_KEY = module.langfuse_secret_key.ssm_parameter_name
      CHB_LANGFUSE_HOST               = "https://${local.priv_monitoring_host}"
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
}

resource "aws_lambda_event_source_mapping" "monitor_lambda_sqs" {
  event_source_arn = aws_sqs_queue.chatbot_monitor_queue.arn
  function_name    = aws_lambda_function.chatbot_monitor_lambda.arn
  enabled          = true
  batch_size       = 10
  #maximum_batching_window_in_seconds = 60
}