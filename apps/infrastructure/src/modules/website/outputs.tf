output "website_bucket" {
  value = {
    name = aws_s3_bucket.website.id
    arn  = aws_s3_bucket.website.arn
  }
}

output "website_cdn" {
  value = {
    arn = var.website_is_standalone ? null : aws_cloudfront_distribution.website.arn
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

output "webinar_subscriptions_ddb" {
  value = {
    name       = module.dynamodb_webinar_subscriptions.dynamodb_table_id
    arn        = module.dynamodb_webinar_subscriptions.dynamodb_table_arn
    stream_arn = module.dynamodb_webinar_subscriptions.dynamodb_table_stream_arn
  }
}

output "assets_opennext_bucket" {
  value = {
    name = module.opennext.assets.bucket.name
    arn  = module.opennext.assets.bucket.arn
  }
}

output "lambda_code_opennext_bucket" {
  value = {
    name = module.opennext.common.lambda_code_bucket.name
    arn  = module.opennext.common.lambda_code_bucket.arn
  }
}

output "standalone_server" {
  value = module.opennext.server
}

output "lambda_initializer" {
  value = {
    name = module.opennext.initializer.lambda_function.name
    arn  = module.opennext.initializer.lambda_function.arn
  }
}

output "opennext_cdn_distribution_id" {
  value = module.opennext.cloudfront.distribution_id
}

output "website_standalone_bucket" {
  value = {
    name = aws_s3_bucket.website_standalone.id
    arn  = aws_s3_bucket.website_standalone.arn
  }
}