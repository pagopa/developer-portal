# Lambda Function
output "lambda_function_arn" {
  description = "The ARN of the Lambda Function"
  value       = aws_lambda_function.chatbot_lambda.arn
}

output "lambda_function_arn_static" {
  description = "The static ARN of the Lambda Function. Use this when you don't need to access a function version"
  value       = aws_lambda_function.chatbot_lambda.arn
}

output "lambda_function_invoke_arn" {
  description = "The Invoke ARN of the Lambda Function"
  value       = aws_lambda_function.chatbot_lambda.invoke_arn
}

output "lambda_function_name" {
  description = "The name of the Lambda Function"
  value       = aws_lambda_function.chatbot_lambda.function_name
}

output "lambda_function_qualified_arn" {
  description = "The ARN identifying your Lambda Function Version"
  value       = aws_lambda_function.chatbot_lambda.qualified_arn
}

output "lambda_function_qualified_invoke_arn" {
  description = "The invoke ARN identifying your Lambda Function Version"
  value       = aws_lambda_function.chatbot_lambda.qualified_invoke_arn
}

output "lambda_function_version" {
  description = "Latest published version of Lambda Function"
  value       = aws_lambda_function.chatbot_lambda.version
}

output "lambda_function_last_modified" {
  description = "The date Lambda Function resource was last modified"
  value       = aws_lambda_function.chatbot_lambda.last_modified
}

output "lambda_function_kms_key_arn" {
  description = "The ARN for the KMS encryption key of Lambda Function"
  value       = aws_lambda_function.chatbot_lambda.kms_key_arn
}

output "lambda_function_source_code_hash" {
  description = "Base64-encoded representation of raw SHA-256 sum of the zip file"
  value       = aws_lambda_function.chatbot_lambda.source_code_hash
}

output "lambda_function_source_code_size" {
  description = "The size in bytes of the function .zip file"
  value       = aws_lambda_function.chatbot_lambda.source_code_size
}

# Lambda Function URL
output "lambda_function_url" {
  description = "The URL of the Lambda Function URL"
  value       = null # La nostra funzione Lambda non ha URL diretto, usiamo API Gateway
}

output "lambda_function_url_id" {
  description = "Lambda Function URL ID"
  value       = null # La nostra funzione Lambda non ha URL diretto, usiamo API Gateway
}

# Lambda Layer
output "lambda_layer_arn" {
  description = "The ARN of the Lambda Layer with version"
  value       = null # Non utilizziamo layer Lambda
}

output "lambda_layer_layer_arn" {
  description = "The ARN of the Lambda Layer without version"
  value       = null # Non utilizziamo layer Lambda
}

output "lambda_layer_created_date" {
  description = "The date Lambda Layer resource was created"
  value       = null # Non utilizziamo layer Lambda
}

output "lambda_layer_source_code_size" {
  description = "The size in bytes of the Lambda Layer .zip file"
  value       = null # Non utilizziamo layer Lambda
}

output "lambda_layer_version" {
  description = "The Lambda Layer version"
  value       = null # Non utilizziamo layer Lambda
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

output "lambda_role_unique_id" {
  description = "The unique id of the IAM role created for the Lambda Function"
  value       = aws_iam_role.lambda_role.unique_id
}

output "lambda_env_variables" {
  description = "Environment variables of the Lambda Function"
  value       = local.lambda_env_variables
}

# CloudWatch Log Group
output "lambda_cloudwatch_log_group_arn" {
  description = "The ARN of the Cloudwatch Log Group"
  value       = aws_cloudwatch_log_group.lambda_logs.arn
}

output "security_groups" {
  value = {
    redis = aws_security_group.nlb.id
  }
}
