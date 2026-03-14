resource "aws_cloudwatch_log_group" "lambda_index_logs" {
  name              = "/aws/lambda/${aws_lambda_function.chatbot_index_lambda.function_name}"
  retention_in_days = 14
}

resource "aws_iam_role" "lambda_index_role" {
  name                  = "${local.prefix}-index-lambda"
  force_detach_policies = true
  assume_role_policy    = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role_policy" "lambda_index_policy" {
  name = "${local.prefix}-index-lambda"
  role = aws_iam_role.lambda_index_role.id
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
          module.google_api_key_ssm_parameter.ssm_parameter_arn,
        ]
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
        Action = [
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Effect = "Allow"
        Resource = [
          "arn:aws:s3:::${var.s3_bucket_name_static_content}/*",
          "arn:aws:s3:::${var.s3_bucket_name_static_content}"
        ]
      }
    ]
  })
}

locals {
  chatbot_index_lambda_name = "${local.prefix}-index-lambda"
}

resource "aws_lambda_function" "chatbot_index_lambda" {
  function_name = local.chatbot_index_lambda_name
  description   = "Lambda function for indexing chatbot data."
  image_uri     = format("%s:latest", module.ecr["chatbotindex"].repository_url)
  package_type  = "Image"

  timeout       = 900 # 15 minutes
  memory_size   = 1024
  architectures = ["x86_64"]
  role          = aws_iam_role.lambda_index_role.arn

  environment {
    variables = {
      CHB_AWS_SSM_GOOGLE_API_KEY            = module.google_api_key_ssm_parameter.ssm_parameter_name
      CHB_AWS_SSM_GOOGLE_SERVICE_ACCOUNT    = module.google_service_account_ssm_parameter.ssm_parameter_name
      CHB_EMBED_BATCH_SIZE                  = 100
      CHB_EMBEDDING_DIM                     = 768
      CHB_EMBED_MODEL_ID                    = var.models.embeddings
      CHB_EMBED_RETRIES                     = 30
      CHB_EMBED_RETRY_MIN_SECONDS           = 1.5
      CHB_MODEL_MAXTOKENS                   = 2048
      CHB_MODEL_ID                          = var.models.generation
      CHB_MODEL_TEMPERATURE                 = 0.3
      CHB_PROVIDER                          = var.models.provider
      CHB_AWS_S3_BUCKET_NAME_STATIC_CONTENT = var.s3_bucket_name_static_content
      CHB_REDIS_URL                         = "redis://${module.nlb.dns_name}:${var.ecs_redis.port}"
      CHB_WEBSITE_URL                       = "https://${var.dns_domain_name}"
      NLTK_DATA                             = "/tmp"

    }
  }

  vpc_config {
    subnet_ids         = var.vpc.private_subnets
    security_group_ids = [aws_security_group.lambda.id]
  }

  lifecycle {
    ignore_changes = [
      image_uri,
    ]
  }

  tags = {
    Name = local.chatbot_index_lambda_name
  }
}

resource "aws_lambda_permission" "allow_s3_invoke_index" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.chatbot_index_lambda.arn
  principal     = "s3.amazonaws.com"
  source_arn    = "arn:aws:s3:::${var.s3_bucket_name_static_content}"
}

resource "aws_s3_bucket_notification" "index_lambda_trigger" {
  bucket = var.s3_bucket_name_static_content

  lambda_function {
    lambda_function_arn = aws_lambda_function.chatbot_index_lambda.arn
    events              = ["s3:ObjectCreated:*", "s3:ObjectRemoved:*"]
    filter_prefix       = ""
    filter_suffix       = ".md"
  }

  lambda_function {
    lambda_function_arn = aws_lambda_function.chatbot_index_lambda.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = ""
    filter_suffix       = "main-guide-versions-dirNames-to-remove.json"
  }

  depends_on = [aws_lambda_permission.allow_s3_invoke_index]
}