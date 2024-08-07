locals {
  lambda_env_variables = {
    CHB_AWS_ACCESS_KEY_ID=var.CHB_AWS_ACCESS_KEY_ID
    CHB_AWS_SECRET_ACCESS_KEY=var.CHB_AWS_SECRET_ACCESS_KEY
    CHB_AWS_DEFAULT_REGION=var.CHB_AWS_DEFAULT_REGION
    CHB_AWS_S3_BUCKET=var.CHB_AWS_S3_BUCKET
    CHB_AWS_GUARDRAIL_ID=var.CHB_AWS_GUARDRAIL_ID
    CHB_AWS_GUARDRAIL_VERSION=var.CHB_AWS_GUARDRAIL_VERSION
  }
}

module "lambda_function" {
  source = "git::github.com/terraform-aws-modules/terraform-aws-lambda.git?ref=9633abb6b6d275d3a28604dbfa755098470420d4" # v6.5.0

  function_name = "${random_pet.this.id}-chatbot-api-tf"
  description   = "chatbot"

  environment_variables = local.lambda_env_variables
  create_package = false

  package_type  = "Image"
  architectures = ["x86_64"]

  image_uri = var.chatbot_lambda_image_container_url

  timeout = 180
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

resource "random_pet" "this" {
  length = 2
}
