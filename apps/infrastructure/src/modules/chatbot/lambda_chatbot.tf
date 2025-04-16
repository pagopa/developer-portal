locals {
  lambda_env_variables = {
    AUTH_COGNITO_USERPOOL_ID           = var.cognito_user_pool.id
    CHB_AWS_BEDROCK_EMBED_REGION       = "eu-central-1"
    CHB_AWS_BEDROCK_LLM_REGION         = var.aws_chatbot_region
    CHB_AWS_GUARDRAIL_ID               = awscc_bedrock_guardrail.guardrail.guardrail_id
    CHB_AWS_GUARDRAIL_VERSION          = awscc_bedrock_guardrail_version.guardrail.version
    CHB_AWS_S3_BUCKET                  = module.s3_bucket_llamaindex.s3_bucket_id
    CHB_AWS_SSM_GOOGLE_API_KEY         = module.google_api_key_ssm_parameter.ssm_parameter_name
    CHB_AWS_SSM_GOOGLE_SERVICE_ACCOUNT = module.google_service_account_ssm_parameter.ssm_parameter_name
    CHB_AWS_SSM_LANGFUSE_PUBLIC_KEY    = module.langfuse_public_key.ssm_parameter_name
    CHB_AWS_SSM_LANGFUSE_SECRET_KEY    = module.langfuse_secret_key.ssm_parameter_name
    CHB_AWS_SSM_LLAMAINDEX_INDEX_ID    = module.index_id_ssm_parameter.ssm_parameter_name
    CHB_EMBED_MODEL_ID                 = "amazon.titan-embed-text-v2:0"
    CHB_ENGINE_USE_ASYNC               = "False"
    CHB_ENGINE_USE_STREAMING           = "False"
    CHB_ENGINE_SIMILARITY_CUTOFF       = "0.2"
    CHB_ENGINE_SIMILARITY_TOPK         = "5"
    CHB_GOOGLE_PROJECT_ID              = module.google_project_id_ssm_parameter.ssm_parameter_name
    CHB_LANGFUSE_HOST                  = "https://${local.priv_monitoring_host}"
    CHB_MODEL_ID                       = "mistral.mistral-large-2402-v1:0"
    CHB_MODEL_MAXTOKENS                = "768"
    CHB_MODEL_TEMPERATURE              = "0.3"
    # Be extremely careful when changing the provider
    # both the generation and the embedding models would be changed
    # embeddings size change would break the application and requires reindexing
    CHB_PROVIDER           = "aws"
    CHB_QUERY_TABLE_PREFIX = local.prefix
    CHB_REDIS_URL          = "redis://${module.nlb.dns_name}:${var.ecs_redis.port}"
    CHB_USE_PRESIDIO       = "True"
    CHB_WEBSITE_URL        = "https://${var.dns_domain_name}"
    CORS_DOMAINS           = var.environment == "dev" ? jsonencode(["https://www.${var.dns_domain_name}", "https://${var.dns_domain_name}", "http://localhost:3000"]) : jsonencode(["https://www.${var.dns_domain_name}", "https://${var.dns_domain_name}"])
    ENVIRONMENT            = var.environment
    LLAMA_INDEX_CACHE_DIR  = "/tmp"
    LOG_LEVEL              = "INFO"
    NLTK_DATA              = "_static/nltk_cache/"
  }
}

module "lambda_function" {
  source = "git::github.com/terraform-aws-modules/terraform-aws-lambda.git?ref=9633abb6b6d275d3a28604dbfa755098470420d4" # v6.5.0

  function_name = "${local.prefix}-api-lambda"
  description   = "Lambda function running APIs of the Developer Portal Chatbot"

  environment_variables = local.lambda_env_variables
  create_package        = false

  package_type  = "Image"
  architectures = ["x86_64"]

  image_uri = "${module.ecr.repository_url}:latest"

  timeout     = local.lambda_timeout
  memory_size = 4092

  vpc_subnet_ids         = var.vpc.private_subnets
  vpc_security_group_ids = [aws_security_group.lambda.id]
  attach_network_policy  = true

  attach_policy_jsons    = true
  number_of_policy_jsons = 3

  policy_jsons = [
    data.aws_iam_policy_document.lambda_s3_policy.json,
    data.aws_iam_policy_document.lambda_dynamodb_policy.json,
    data.aws_iam_policy_document.lambda_ssm_policy.json
  ]
}

resource "aws_lambda_permission" "rest_apigw_lambda" {
  action        = "lambda:InvokeFunction"
  function_name = module.lambda_function.lambda_function_name
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
  arn       = module.lambda_function.lambda_function_arn
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
  function_name = module.lambda_function.lambda_function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.lambda_invocation_rule.arn
  statement_id  = "AllowExecutionFromEventBridge"
}
