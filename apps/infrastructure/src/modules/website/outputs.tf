output "website_bucket_name" {
  value = aws_s3_bucket.website.id
}

output "cognito_user_pool" {
  value = {
    client_id = aws_cognito_user_pool_client.devportal_website.id
    arn = aws_cognito_user_pool.devportal.arn
    domain = aws_cognito_user_pool_domain.devportal.domain
  }
}