# Lambda Function for SQS FIFO
module "lambda_sync" {
  source = "git::github.com/terraform-aws-modules/terraform-aws-lambda.git?ref=9633abb6b6d275d3a28604dbfa755098470420d4" # v6.5.0

  function_name = "${local.prefix}-sync-lambda"
  description   = "Lambda function that syncs Active Campaign"

  environment_variables = {
    AC_API_KEY_PARAM     = module.active_campaign_api_key.ssm_parameter_name
    AC_BASE_URL_PARAM    = module.active_campaign_base_url.ssm_parameter_name
    COGNITO_USER_POOL_ID = var.cognito_user_pool.id
    AC_COMPANY_TYPE_FIELD_ID = module.active_campaign_company_type_field.ssm_parameter_name
    AC_JOB_ROLE_FIELD_ID = module.active_campaign_job_role_field.ssm_parameter_name
    AC_MAILING_LIST_ACCEPTED_FIELD_ID = module.active_campaign_mailing_list_accepted_field.ssm_parameter_name
    AC_SURVEY_ACCEPTED_FIELD_ID = module.active_campaign_survey_accepted_field.ssm_parameter_name
    AC_PREFERRED_LANGUAGE_FIELD_ID = module.active_campaign_preferred_language_field.ssm_parameter_name
  }

  runtime       = "nodejs20.x"
  architectures = ["x86_64"]

  handler                                 = "index.sqsQueue"
  source_path                             = "${path.module}/functions"
  ignore_source_code_hash                 = true
  create_current_version_allowed_triggers = false

  timeout                = 30
  memory_size            = 256
  maximum_retry_attempts = 0

  event_source_mapping = {
    sqs = {
      event_source_arn = aws_sqs_queue.fifo_queue.arn
      batch_size       = 1
      scaling_config = {
        maximum_concurrency = 2
      }
    }
  }

  allowed_triggers = {
    sqs = {
      principal  = "sqs.amazonaws.com"
      source_arn = aws_sqs_queue.fifo_queue.arn
    }
  }

  tags = var.tags
}

module "active_campaign_api_key" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/ac/api_key"
  value                = "Substitute with real api key from the console"
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}

module "active_campaign_base_url" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/ac/base_url"
  value                = "Substitute with real api key from the console"
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}

module "active_campaign_company_type_field" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/ac/company_type_field_id"
  value                = "Substitute with real company type field id from the console"
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}

module "active_campaign_job_role_field" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/ac/job_role_field_id"
  value                = "Substitute with real job role field id from the console"
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}

module "active_campaign_mailing_list_accepted_field" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/ac/mailing_list_accepted_field_id"
  value                = "Substitute with real mailing list accepted field id from the console"
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}

module "active_campaign_survey_accepted_field" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/ac/survey_accepted_field_id"
  value                = "Substitute with real survey accepted field id from the console"
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}

module "active_campaign_preferred_language_field" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/ac/preferred_language_field_id"
  value                = "Substitute with real preferred language field id from the console"
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}

