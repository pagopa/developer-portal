output "cognito_user_pool" {
  value = {
    id        = aws_cognito_user_pool.devportal.id
    arn       = aws_cognito_user_pool.devportal.arn
    domain    = aws_cognito_user_pool_domain.devportal.domain
    region    = var.aws_region
    client_id = aws_cognito_user_pool_client.devportal_website.id
    endpoint  = aws_cognito_user_pool.devportal.endpoint
  }

  sensitive = true
}

output "cognito_identity_pool_id" {
  description = "The ID of the Cognito Identity Pool"
  value       = aws_cognito_identity_pool.devportal.id
}

output "authenticated_user_role_arn" {
  description = "The ARN of the IAM role for authenticated users"
  value       = aws_iam_role.devportal_authenticated_user.arn
}

output "authenticated_user_role_id" {
  description = "The ID (name) of the IAM role for authenticated users"
  value       = aws_iam_role.devportal_authenticated_user.id
}

output "authenticated_host_user_role_arn" {
  description = "The ARN of the IAM role for authenticated host users"
  value       = aws_iam_role.devportal_authenticated_host_user.arn
}

output "authenticated_host_user_role_id" {
  description = "The ID (name) of the IAM role for authenticated host users"
  value       = aws_iam_role.devportal_authenticated_host_user.id
}
