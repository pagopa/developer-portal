locals {
  lambda_env_variables = {
    CHB_AWS_S3_BUCKET         = module.s3_bucket_llamaindex.s3_bucket_id
    CHB_AWS_GUARDRAIL_ID      = awscc_bedrock_guardrail.guardrail.guardrail_id
    CHB_AWS_GUARDRAIL_VERSION = awscc_bedrock_guardrail_version.guardrail.version
    CHB_AWS_DEFAULT_REGION    = var.aws_chatbot_region
    CHB_REDIS_URL             = "redis://${module.redis.endpoint}:${module.redis.port}"
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

  timeout     = 180
  memory_size = 4092

  vpc_subnet_ids         = var.vpc.private_subnets
  vpc_security_group_ids = [aws_security_group.lambda.id]
  attach_network_policy  = true

  attach_policy_jsons    = true
  number_of_policy_jsons = 1

  policy_jsons = [
    data.aws_iam_policy_document.lambda_s3_policy.json,
  ]
}

resource "aws_lambda_permission" "lambda_permission" {
  statement_id  = "AllowAPIGWInvoke"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda_function.lambda_function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${module.api_gateway.api_execution_arn}/*/*"
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