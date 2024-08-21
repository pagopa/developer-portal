locals {
  lambda_env_variables = {
    CHB_AWS_S3_BUCKET         = module.s3_bucket_llamaindex.s3_bucket_id
    CHB_AWS_GUARDRAIL_ID      = awscc_bedrock_guardrail.guardrail.guardrail_id
    CHB_AWS_GUARDRAIL_VERSION = awscc_bedrock_guardrail_version.guardrail.id
  }
}

module "lambda_function" {
  source = "git::github.com/terraform-aws-modules/terraform-aws-lambda.git?ref=9633abb6b6d275d3a28604dbfa755098470420d4" # v6.5.0

  function_name = "chatbot-api-tf"
  description   = "chatbot"

  environment_variables = local.lambda_env_variables
  create_package        = false

  package_type  = "Image"
  architectures = ["x86_64"]

  image_uri = module.ecr.repository_url

  timeout     = 180
  memory_size = 4092

  create_lambda_function_url = true
  authorization_type         = "AWS_IAM"
  cors = {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["*"]
    allow_headers     = ["date", "keep-alive"]
    expose_headers    = ["keep-alive", "date"]
    max_age           = 86400
  }
  invoke_mode = "RESPONSE_STREAM"
}
