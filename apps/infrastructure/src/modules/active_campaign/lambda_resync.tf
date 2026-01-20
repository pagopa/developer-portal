# Lambda Function for SQS FIFO
module "lambda_resync" {
  source = "git::github.com/terraform-aws-modules/terraform-aws-lambda.git?ref=177ee12ae387ed683c8cce5992b0278311951e8d" # 8.2.0

  function_name = "${local.prefix}-resync-lambda"
  description   = "Lambda function that resyncs Active Campaign failed events"

  environment_variables = {
    AC_API_KEY_PARAM           = module.active_campaign_api_key.ssm_parameter_name
    AC_BASE_URL_PARAM          = module.active_campaign_base_url.ssm_parameter_name
    COGNITO_USER_POOL_ID       = var.cognito_user_pool.id
    DYNAMO_WEBINARS_TABLE_NAME = var.webinar_subscriptions_ddb.name
  }

  runtime       = "nodejs20.x"
  architectures = ["x86_64"]

  handler                                 = "index.resyncQueue"
  source_path                             = "${path.module}/functions"
  ignore_source_code_hash                 = true
  create_current_version_allowed_triggers = false

  timeout                = 120
  memory_size            = 256
  maximum_retry_attempts = 3

  event_source_mapping = {
    sqs = {
      event_source_arn = aws_sqs_queue.fifo_dlq_queue.arn
      batch_size       = 1
      scaling_config = {
        maximum_concurrency = 2
      }
    }
  }

  allowed_triggers = {
    sqs = {
      principal  = "sqs.amazonaws.com"
      source_arn = aws_sqs_queue.fifo_dlq_queue.arn
    }
  }

  tags = var.tags
}
