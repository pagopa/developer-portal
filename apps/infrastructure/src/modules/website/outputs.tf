output "website_bucket" {
  value = {
    name = aws_s3_bucket.website.id
    arn  = aws_s3_bucket.website.arn
  }
}

output "website_cdn" {
  value = {
    arn = aws_cloudfront_distribution.website.arn
  }
}

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