locals {
  cognito_lambda_functions_artifact_path = "../apps/cognito-functions/out/cognito-functions.zip"
  /* FIXME: at the moment we need to add all the env variables required to all Lambda functions
   * because of a runtime error during the env parsing.
   * We should find a way to add only the variables required to the Lambda.
  */
  lambda_env_variables = {
    DOMAIN             = var.dns_domain_name
    FROM_EMAIL_ADDRESS = local.from_email_address
  }
  lambda_timeout = 15
}

module "cognito_custom_message_function" {
  source = "git::github.com/terraform-aws-modules/terraform-aws-lambda.git?ref=9633abb6b6d275d3a28604dbfa755098470420d4" # v6.5.0

  function_name = "cognito_custom_message"
  description   = "The Lambda function executed to customize the email address verification message"
  handler       = "main.customMessageHandler"
  runtime       = "nodejs18.x"
  timeout       = local.lambda_timeout

  create_package                          = false
  local_existing_package                  = local.cognito_lambda_functions_artifact_path
  create_current_version_allowed_triggers = false
  cloudwatch_logs_retention_in_days       = var.log_retention_days

  environment_variables = local.lambda_env_variables

  allowed_triggers = {
    cognito_devportal = {
      principal  = "cognito-idp.amazonaws.com"
      source_arn = aws_cognito_user_pool.devportal.arn
    }
  }
}

module "cognito_post_confirmation_function" {
  source = "git::github.com/terraform-aws-modules/terraform-aws-lambda.git?ref=9633abb6b6d275d3a28604dbfa755098470420d4" # v6.5.0

  function_name = "cognito_post_confirmation"
  description   = "The Lambda function executed after post confirmation of email address"
  handler       = "main.postConfirmationHandler"
  runtime       = "nodejs18.x"
  timeout       = local.lambda_timeout

  create_package                          = false
  local_existing_package                  = local.cognito_lambda_functions_artifact_path
  create_current_version_allowed_triggers = false
  cloudwatch_logs_retention_in_days       = var.log_retention_days

  environment_variables = local.lambda_env_variables

  attach_policy_statements = true
  policy_statements = {
    ses = {
      effect    = "Allow",
      actions   = ["ses:SendEmail", "ses:SendRawEmail"],
      resources = [module.ses_developer_pagopa_it.ses_domain_identity_arn]
    },
  }

  allowed_triggers = {
    cognito_devportal = {
      principal  = "cognito-idp.amazonaws.com"
      source_arn = aws_cognito_user_pool.devportal.arn
    }
  }
}

module "cognito_define_auth_challenge_function" {
  source = "git::github.com/terraform-aws-modules/terraform-aws-lambda.git?ref=9633abb6b6d275d3a28604dbfa755098470420d4" # v6.5.0

  function_name = "cognito_define_auth_challenge"
  description   = "This Lambda function is invoked to initiate the custom authentication flow."
  handler       = "main.defineAuthChallengeHandler"
  runtime       = "nodejs18.x"
  timeout       = local.lambda_timeout

  create_package                          = false
  local_existing_package                  = local.cognito_lambda_functions_artifact_path
  create_current_version_allowed_triggers = false
  cloudwatch_logs_retention_in_days       = var.log_retention_days

  environment_variables = local.lambda_env_variables

  allowed_triggers = {
    cognito_devportal = {
      principal  = "cognito-idp.amazonaws.com"
      source_arn = aws_cognito_user_pool.devportal.arn
    }
  }
}

module "cognito_create_auth_challenge_function" {
  source = "git::github.com/terraform-aws-modules/terraform-aws-lambda.git?ref=9633abb6b6d275d3a28604dbfa755098470420d4" # v6.5.0

  function_name = "cognito_create_auth_challenge"
  description   = "This Lambda function is invoked to create a challenge to present to the user."
  handler       = "main.createAuthChallengeHandler"
  runtime       = "nodejs18.x"
  timeout       = local.lambda_timeout

  create_package                          = false
  local_existing_package                  = local.cognito_lambda_functions_artifact_path
  create_current_version_allowed_triggers = false
  cloudwatch_logs_retention_in_days       = var.log_retention_days

  environment_variables = local.lambda_env_variables

  attach_policy_statements = true
  policy_statements = {
    ses = {
      effect    = "Allow",
      actions   = ["ses:SendEmail", "ses:SendRawEmail"],
      resources = [module.ses_developer_pagopa_it.ses_domain_identity_arn]
    },
  }

  allowed_triggers = {
    cognito_devportal = {
      principal  = "cognito-idp.amazonaws.com"
      source_arn = aws_cognito_user_pool.devportal.arn
    }
  }
}

module "cognito_verify_auth_challenge_function" {
  source = "git::github.com/terraform-aws-modules/terraform-aws-lambda.git?ref=9633abb6b6d275d3a28604dbfa755098470420d4" # v6.5.0

  function_name = "cognito_verify_auth_challenge"
  description   = "This Lambda function is invoked to verify if the response from the user for a custom Auth Challenge is valid or not."
  handler       = "main.verifyAuthChallengeHandler"
  runtime       = "nodejs18.x"
  timeout       = local.lambda_timeout

  create_package                          = false
  local_existing_package                  = local.cognito_lambda_functions_artifact_path
  create_current_version_allowed_triggers = false
  cloudwatch_logs_retention_in_days       = var.log_retention_days

  environment_variables = local.lambda_env_variables

  allowed_triggers = {
    cognito_devportal = {
      principal  = "cognito-idp.amazonaws.com"
      source_arn = aws_cognito_user_pool.devportal.arn
    }
  }
}
