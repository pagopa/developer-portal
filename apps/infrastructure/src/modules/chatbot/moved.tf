# Moved blocks to avoid drift in terraform plan
moved {
  from = module.lambda_function.aws_lambda_function.this[0]
  to   = aws_lambda_function.chatbot_lambda
}

moved {
  from = module.lambda_function.aws_cloudwatch_log_group.lambda[0]
  to   = aws_cloudwatch_log_group.lambda_logs
}

moved {
  from = module.lambda_function.aws_iam_role.lambda[0]
  to   = aws_iam_role.lambda_role
}

moved {
  from = module.lambda_function.aws_iam_role_policy_attachment.lambda_vpc_access[0]
  to   = aws_iam_role_policy_attachment.lambda_vpc_access
}

moved {
  from = module.lambda_function.aws_iam_role_policy.logs[0]
  to   = aws_iam_role_policy.lambda_s3_policy_attachment
}

moved {
  from = module.lambda_function.aws_iam_role_policy.dynamodb[0]
  to   = aws_iam_role_policy.lambda_dynamodb_policy_attachment
}

moved {
  from = module.lambda_function.aws_iam_role_policy.ssm[0]
  to   = aws_iam_role_policy.lambda_ssm_policy_attachment
}

moved {
  from = module.lambda_function.aws_lambda_permission.api_gw[0]
  to   = aws_lambda_permission.rest_apigw_lambda
}

moved {
  from = module.lambda_function.aws_security_group.lambda[0]
  to   = aws_security_group.lambda
}

moved {
  from = module.lambda_function.aws_security_group_rule.lambda_egress[0]
  to   = aws_security_group_rule.lambda_egress
}

moved {
  from = module.lambda_function.aws_cloudwatch_event_rule.lambda_invocation_rule[0]
  to   = aws_cloudwatch_event_rule.lambda_invocation_rule
}

moved {
  from = module.lambda_function.aws_cloudwatch_event_target.lambda_target[0]
  to   = aws_cloudwatch_event_target.lambda_target
}

moved {
  from = module.lambda_function.aws_lambda_permission.allow_eventbridge[0]
  to   = aws_lambda_permission.allow_eventbridge
}

# IAM policy moved blocks
moved {
  from = module.lambda_function.aws_iam_policy.additional_jsons[0]
  to   = aws_iam_policy.lambda_s3_bedrock_policy
}

moved {
  from = module.lambda_function.aws_iam_policy.additional_jsons[1]
  to   = aws_iam_policy.lambda_dynamodb_policy
}

moved {
  from = module.lambda_function.aws_iam_policy.additional_jsons[2]
  to   = aws_iam_policy.lambda_ssm_policy
}

moved {
  from = module.lambda_function.aws_iam_policy.logs[0]
  to   = aws_iam_policy.lambda_logs_policy
}

moved {
  from = module.lambda_function.aws_iam_policy.vpc[0]
  to   = aws_iam_policy.lambda_vpc_policy
}

# IAM policy attachment moved blocks
moved {
  from = module.lambda_function.aws_iam_role_policy_attachment.additional_jsons[0]
  to   = aws_iam_role_policy_attachment.lambda_s3_bedrock_policy_attachment
}

moved {
  from = module.lambda_function.aws_iam_role_policy_attachment.additional_jsons[1]
  to   = aws_iam_role_policy_attachment.lambda_dynamodb_policy_attachment
}

moved {
  from = module.lambda_function.aws_iam_role_policy_attachment.additional_jsons[2]
  to   = aws_iam_role_policy_attachment.lambda_ssm_policy_attachment
}

moved {
  from = module.lambda_function.aws_iam_role_policy_attachment.logs[0]
  to   = aws_iam_role_policy_attachment.lambda_logs_policy_attachment
}

moved {
  from = module.lambda_function.aws_iam_role_policy_attachment.vpc[0]
  to   = aws_iam_role_policy_attachment.lambda_vpc_policy_attachment
}