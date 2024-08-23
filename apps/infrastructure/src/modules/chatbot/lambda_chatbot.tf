locals {
  lambda_env_variables = {
    CHB_AWS_S3_BUCKET         = module.s3_bucket_llamaindex.s3_bucket_id
    CHB_AWS_GUARDRAIL_ID      = awscc_bedrock_guardrail.guardrail.guardrail_id
    CHB_AWS_GUARDRAIL_VERSION = awscc_bedrock_guardrail_version.guardrail.id
  }
}

module "lambda_function" {
  source = "git::github.com/terraform-aws-modules/terraform-aws-lambda.git?ref=9633abb6b6d275d3a28604dbfa755098470420d4" # v6.5.0
  providers = {
    aws = aws.eu-south-1
  }

  function_name = "${local.prefix}-api-lambda"
  description   = "Lambda function running APIs of the Developer Portal Chatbot"

  environment_variables = local.lambda_env_variables
  create_package        = false

  package_type  = "Image"
  architectures = ["x86_64"]

  image_uri = "${module.ecr.repository_url}:latest"

  timeout     = 180
  memory_size = 4092

  attach_policy_jsons    = true
  number_of_policy_jsons = 1
  policy_jsons = [
    data.aws_iam_policy_document.lambda_s3_policy.json,
  ]
}

resource "aws_lambda_permission" "lambda_permission" {
  provider      = aws.eu-south-1
  statement_id  = "AllowAPIGWInvoke"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda_function.lambda_function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${module.api_gateway.api_execution_arn}/*/*"
}