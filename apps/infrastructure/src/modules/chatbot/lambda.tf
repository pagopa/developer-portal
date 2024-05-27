module "website_kb_sync_lambda" {
  source = "git::github.com/terraform-aws-modules/terraform-aws-lambda.git?ref=9633abb6b6d275d3a28604dbfa755098470420d4" # v6.5.0

  function_name = "${local.prefix}-website-kb-sync-lambda"
  description   = "The Lambda function that manages the sync of website s3 bucket to chatbot kb s3 bucket"
  handler       = "main.lambda_handler"
  runtime       = "python3.12"
  timeout       = local.lambda_timeout

  source_path                       = "${path.module}/lambdas/website_kb_sync_lambda"
  cloudwatch_logs_retention_in_days = var.log_retention_days

  environment_variables = {
    CHATBOT_REGION     = var.aws_chatbot_region
    CHATBOT_BUCKET     = module.s3_bucket_kb.s3_bucket_id
    DESTINATION_PREFIX = "website/"
  }

  attach_policy_statements = true
  policy_statements = [{
    actions = [
      "s3:GetObject",
      "s3:ListBucket"
    ]

    resources = [
      "arn:aws:s3:::${var.website_bucket_name}",
      "arn:aws:s3:::${var.website_bucket_name}/*"
    ]
    },
    {
      actions = [
        "s3:PutObject"
      ]

      resources = [
        "arn:aws:s3:::${module.s3_bucket_kb.s3_bucket_id}",
        "arn:aws:s3:::${module.s3_bucket_kb.s3_bucket_id}/*"
      ]
    },
    {
      actions = [
        "sqs:ReceiveMessage",
        "sqs:DeleteMessage",
        "sqs:GetQueueAttributes"
      ]

      resources = [
        aws_sqs_queue.this.arn
      ]
  }]

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