# Lambda Function
output "lambda_function_arn" {
  description = "The ARN of the Lambda Function"
  value       = aws_lambda_function.chatbot_lambda.arn
}

output "lambda_function_name" {
  description = "The name of the Lambda Function"
  value       = aws_lambda_function.chatbot_lambda.function_name
}

# IAM Role
output "lambda_role_arn" {
  description = "The ARN of the IAM role created for the Lambda Function"
  value       = aws_iam_role.lambda_role.arn
}

output "lambda_role_name" {
  description = "The name of the IAM role created for the Lambda Function"
  value       = aws_iam_role.lambda_role.name
}

output "lambda_env_variables" {
  description = "Environment variables of the Lambda Function"
  value       = local.lambda_env_variables
}

output "security_groups" {
  value = {
    redis = aws_security_group.nlb.id
  }
}

output "cognito_user_pool_id" {
  description = "ID of the Cognito user pool used for chatbot authentication"
  value       = aws_cognito_user_pool.monitoring.id
}

output "cognito_user_pool_endpoint" {
  description = "Endpoint of the Cognito user pool used for chatbot authentication"
  value       = aws_cognito_user_pool.monitoring.endpoint
}

output "cognito_master_user_password_param_arn" {
  description = "ARN of the SSM parameter storing the chatbot Cognito master user password"
  value       = module.master_user_password.ssm_parameter_arn
}
