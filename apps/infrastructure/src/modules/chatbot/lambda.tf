module "cognito_custom_message_function" {
  source = "git::github.com/terraform-aws-modules/terraform-aws-lambda.git?ref=9633abb6b6d275d3a28604dbfa755098470420d4" # v6.5.0

  function_name = "${local.prefix}-website-kb-sync-lambda"
  description   = "The Lambda function that manages the sync of website s3 bucket to chatbot kb s3 bucket"
  handler       = "main.lambda_handler"
  runtime       = "python3.12"
  timeout       = local.lambda_timeout

  source_path = "${path.module}/lambdas/website_kb_sync_lambda"
  create_package                          = false
  local_existing_package                  = local.cognito_lambda_functions_artifact_path
  cloudwatch_logs_retention_in_days       = var.log_retention_days

  environment_variables = {
    CHATBOT_REGION = var.aws_chatbot_region
    CHATBOT_BUCKET = module.s3_bucket_kb.name
  }

  attach_policy_statements = true
  policy_statements = data.aws_iam_policy_document.lambda_policy.json

  event_source_mapping = {
    sqs = {
      event_source_arn        = aws_sqs_queue.this.arn
      function_response_types = ["ReportBatchItemFailures"]
      scaling_config = {
        maximum_concurrency = 20
      }
    }
  }

  allowed_triggers = {
    sqs = {
      principal  = "sqs.amazonaws.com"
      source_arn = aws_sqs_queue.this.arn
    }
  }
}