locals {
  lambda_env_variables = {
    AUTH_COGNITO_USERPOOL_ID           = var.cognito_user_pool.id
    CHB_AWS_S3_BUCKET                  = module.s3_bucket_llamaindex.s3_bucket_id
    CHB_AWS_SSM_GOOGLE_API_KEY         = module.google_api_key_ssm_parameter.ssm_parameter_name
    CHB_AWS_SSM_GOOGLE_SERVICE_ACCOUNT = module.google_service_account_ssm_parameter.ssm_parameter_name
    # --- TODO ---#
    # REMOVE ALL LANGFUSE VARIABLES, THEY ARE NOT USED IN THIS LAMBDA, AND SHOULD NOT BE PRESENT
    CHB_AWS_SSM_LANGFUSE_PUBLIC_KEY = module.langfuse_public_key.ssm_parameter_name
    CHB_AWS_SSM_LANGFUSE_SECRET_KEY = module.langfuse_secret_key.ssm_parameter_name
    CHB_AWS_SSM_LLAMAINDEX_INDEX_ID = module.index_id_ssm_parameter.ssm_parameter_name
    CHB_LLAMAINDEX_INDEX_ID         = module.index_id_ssm_parameter.ssm_parameter_name
    CHB_EMBED_MODEL_ID              = var.models.embeddings
    CHB_ENGINE_USE_ASYNC            = "False"
    CHB_ENGINE_USE_STREAMING        = "False"
    CHB_ENGINE_SIMILARITY_TOPK      = "5"
    CHB_GOOGLE_PROJECT_ID           = module.google_project_id_ssm_parameter.ssm_parameter_name
    CHB_GOOGLE_API_KEY              = "/chatbot/google_api_key"
    CHB_LANGFUSE_HOST               = module.langfuse[0].service_discovery_endpoint
    CHB_MODEL_ID                    = var.models.generation
    CHB_MODEL_MAXTOKENS             = 2048
    CHB_MODEL_TEMPERATURE           = "0.3"
    # Be extremely careful when changing the provider
    # both the generation and the embedding models would be changed
    # embeddings size change would break the application and requires reindexing
    CHB_PROVIDER                          = var.models.provider
    CHB_QUERY_TABLE_PREFIX                = local.prefix
    CHB_REDIS_URL                         = "redis://${module.nlb.dns_name}:${var.ecs_redis.port}"
    CHB_RERANKER_ID                       = var.models.reranker
    CHB_USE_PRESIDIO                      = "True"
    CHB_WEBSITE_URL                       = "https://${var.dns_domain_name}"
    CHB_AWS_S3_BUCKET_NAME_STATIC_CONTENT = var.s3_bucket_name_static_content
    CORS_DOMAINS                          = var.environment == "dev" ? jsonencode(["https://www.${var.dns_domain_name}", "https://${var.dns_domain_name}", "http://localhost:3000"]) : jsonencode(["https://www.${var.dns_domain_name}", "https://${var.dns_domain_name}"])
    ENVIRONMENT                           = var.environment
    LLAMA_INDEX_CACHE_DIR                 = "/tmp"
    LOG_LEVEL                             = "INFO"
    NLTK_DATA                             = "_static/nltk_cache/"
    TIKTOKEN_CACHE_DIR                    = "/tmp/tiktoken"
    #--- TODO ---#
    # REMOVE THE FOLLOWING VARIABLE, THE CHATBOT LAMBDA API WILL INTERACT WITH LAMBDA MONITOR VIA ITS QUEUE.
    CHB_AWS_SQS_QUEUE_EVALUATE_NAME = aws_sqs_queue.chatbot_queue["evaluate"].name
    CHB_AWS_SQS_QUEUE_MONITOR_NAME  = aws_sqs_queue.chatbot_queue["monitor"].name
  }
}

locals {
  chatbot_lambda_name = "${local.prefix}-api-lambda"
}


resource "aws_lambda_function" "chatbot_lambda" {
  function_name = local.chatbot_lambda_name
  description   = "Lambda function running APIs of the Developer Portal Chatbot"

  image_uri    = "${module.ecr["chatbot"].repository_url}:latest"
  package_type = "Image"

  timeout       = local.lambda_timeout
  memory_size   = 4092
  architectures = ["x86_64"]
  role          = aws_iam_role.lambda_role.arn

  vpc_config {
    subnet_ids         = var.vpc.private_subnets
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = local.lambda_env_variables
  }

  lifecycle {
    ignore_changes = [
      image_uri
    ]
  }

  tags = {
    Name = local.chatbot_lambda_name
  }
}

resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${aws_lambda_function.chatbot_lambda.function_name}"
  retention_in_days = 14
}

resource "aws_iam_role" "lambda_role" {
  name                  = "${local.prefix}-api-lambda"
  force_detach_policies = true
  assume_role_policy    = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_lambda_permission" "rest_apigw_lambda" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.chatbot_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
  statement_id  = "AllowExecutionFromAPIGateway"
}

resource "aws_security_group" "lambda" {
  name        = "${local.prefix}-lambda"
  description = "Chatbot Lambda"
  vpc_id      = var.vpc.id

  # https://registry.terraform.io/providers/hashicorp/aws/5.35.0/docs/resources/security_group#recreating-a-security-group
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group_rule" "lambda_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.lambda.id
}


module "google_api_key_ssm_parameter" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/chatbot/google_api_key"
  value                = "Set the Google Gemini API Key in the AWS console"
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}

module "google_project_id_ssm_parameter" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/chatbot/google_project_id"
  value                = "Set the Google Gemini Project ID in the AWS console"
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}

module "google_service_account_ssm_parameter" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/chatbot/google_service_account"
  value                = "Set the Google Gemini Service Account in the AWS console"
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}

module "index_id_ssm_parameter" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/chatbot/index_id"
  value                = "49c13f0d-d164-49f1-b5d4-8bdc0632d0dc"
  type                 = "String"
  secure_type          = true
  ignore_value_changes = true
}

module "index_id_ssm_parameter_local" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/chatbot/index_id_local"
  value                = "49c13f0d-d164-49f1-b5d4-8bdc0632d0de"
  type                 = "String"
  secure_type          = true
  ignore_value_changes = true
}

# Invoke the lambda function every 3 minutes from 6:00 am to 11:00 pm to keep it warm
resource "aws_cloudwatch_event_rule" "lambda_invocation_rule" {
  name                = "${local.prefix}-lambda-invocation-rule"
  schedule_expression = "cron(0/3 6-23 * * ? *)"
}

resource "aws_cloudwatch_event_target" "lambda_target" {
  rule      = aws_cloudwatch_event_rule.lambda_invocation_rule.name
  target_id = "keep-chatbot-lambda-warm"
  arn       = aws_lambda_function.chatbot_lambda.arn
  input = jsonencode({
    resource                        = "/{proxy+}",
    path                            = "/healthz",
    httpMethod                      = "GET",
    requestContext                  = {},
    multiValueQueryStringParameters = null
  })
}

resource "aws_lambda_permission" "allow_eventbridge" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.chatbot_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.lambda_invocation_rule.arn
  statement_id  = "AllowExecutionFromEventBridge"
}

# IAM Policy Resources

resource "aws_iam_policy" "lambda_chatbot_ecr_access" {

  name        = "chatbot-lambda-ecr-access"
  description = "Allow Lambda to pull images from ECR chatbot repositories"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:ListTagsForResource",
          "ecr:ListImages",
          "ecr:GetRepositoryPolicy",
          "ecr:GetLifecyclePolicyPreview",
          "ecr:GetLifecyclePolicy",
          "ecr:GetDownloadUrlForLayer",
          "ecr:GetAuthorizationToken",
          "ecr:DescribeRepositories",
          "ecr:DescribeImages",
          "ecr:DescribeImageScanFindings",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      }
    ]
  })
}



resource "aws_iam_policy" "lambda_s3_chatbot_policy" {
  name = "chatbot-${var.environment}-api-lambda-s3"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "ListObjectsInBucket"
        Effect   = "Allow"
        Action   = "s3:ListBucket"
        Resource = [module.s3_bucket_llamaindex.s3_bucket_arn, module.s3_bucket_kb.s3_bucket_arn]
      },
      {
        Sid      = "ReadWriteInBucket"
        Effect   = "Allow"
        Action   = "s3:*Object"
        Resource = ["${module.s3_bucket_llamaindex.s3_bucket_arn}/*", "${module.s3_bucket_kb.s3_bucket_arn}/*"]
      },
      {
        Sid = "ReadStaticContent"
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
  tags = var.tags
}

resource "aws_iam_policy" "lambda_dynamodb_policy" {
  name = "chatbot-${var.environment}-api-lambda-dynamodb"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowDynamoDBItemOperations"
        Effect = "Allow"
        Action = [
          "dynamodb:UpdateItem",
          "dynamodb:Scan",
          "dynamodb:Query",
          "dynamodb:PutItem",
          "dynamodb:GetRecords",
          "dynamodb:GetItem",
          "dynamodb:DeleteItem",
          "dynamodb:ConditionCheckItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:BatchGetItem"
        ]
        Resource = [
          module.dynamodb_chatbot_queries.dynamodb_table_arn,
          "${module.dynamodb_chatbot_queries.dynamodb_table_arn}/*",
          module.dynamodb_chatbot_sessions.dynamodb_table_arn,
          "${module.dynamodb_chatbot_sessions.dynamodb_table_arn}/*",
          module.dynamodb_chatbot_salts.dynamodb_table_arn,
          "${module.dynamodb_chatbot_salts.dynamodb_table_arn}/*"
        ]
      }
    ]
  })
  tags = var.tags
}

resource "aws_iam_policy" "lambda_ssm_policy" {
  name = "chatbot-${var.environment}-api-lambda-ssm"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowSSMOperations"
        Effect = "Allow"
        Action = [
          "ssm:GetParameters",
          "ssm:GetParameter"
        ]
        Resource = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/chatbot/*"
      }
    ]
  })
  tags = var.tags
}

# IAM Policy SQS send messages

resource "aws_iam_policy" "chatbot_monitor_queue" {
  name        = "lambda-sqs-send"
  description = "Allow Lambda to send messages to SQS queue"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["sqs:SendMessage", "sqs:GetQueueUrl"]
        Resource = aws_sqs_queue.chatbot_queue["evaluate"].arn
      }
    ]
  })
}

# IAM Role Policy Attachments
resource "aws_iam_role_policy_attachment" "lambda_s3_chatbot_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_s3_chatbot_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_dynamodb_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_dynamodb_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_ssm_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_ssm_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_logs_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}


resource "aws_iam_role_policy_attachment" "lambda_chatbot_ecr_access_attach" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_chatbot_ecr_access.arn
}

resource "aws_iam_role_policy_attachment" "lambda_vpc_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy_attachment" "chatbot_monitor_queue" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.chatbot_monitor_queue.arn
}
