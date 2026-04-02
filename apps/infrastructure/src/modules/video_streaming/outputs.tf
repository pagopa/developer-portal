output "s3_recording_bucket_name" {
  description = "The name of the S3 bucket where all recordings will be stored."
  value       = aws_s3_bucket.ivs_recordings.id
}

output "ivs_channel_details" {
  description = "A map containing the details for each created IVS channel."
  value = {
    for key, channel in aws_ivs_channel.channels : key => {
      arn                      = channel.arn
      ingest_endpoint          = "rtmps://${channel.ingest_endpoint}:443/app/"
      playback_url             = channel.playback_url
      distribution_domain_name = aws_cloudfront_distribution.vod.domain_name
    }
  }

}

output "cloudfront_logs_bucket_name" {
  description = "The name of the S3 bucket where CloudFront access logs are stored."
  value       = aws_s3_bucket.cloudfront_logs.id
}

output "athena_database_name" {
  description = "The name of the Athena database for querying CloudFront access logs."
  value       = aws_athena_database.cloudfront_logs.name
}

output "athena_workgroup_name" {
  description = "The name of the Athena workgroup for running queries."
  value       = aws_athena_workgroup.cloudfront_logs.name
}

output "athena_results_bucket_name" {
  description = "The name of the S3 bucket where Athena query results are stored."
  value       = aws_s3_bucket.athena_results.id
}

output "webinar_metrics_lambda_arn" {
  description = "The ARN of the webinar metrics Lambda function."
  value       = aws_lambda_function.webinar_metrics.arn
}

output "webinar_metrics_lambda_name" {
  description = "The name of the webinar metrics Lambda function."
  value       = aws_lambda_function.webinar_metrics.function_name
}

output "webinar_metrics_api_url" {
  description = "The invoke URL of the webinar metrics API Gateway."
  value       = "${aws_api_gateway_stage.webinar_metrics.invoke_url}/metrics"
}

output "webinar_metrics_api_key_id" {
  description = "The ID of the API key for the webinar metrics API. Retrieve the value with: aws apigateway get-api-key --api-key <id> --include-value"
  value       = aws_api_gateway_api_key.webinar_metrics.id
}

output "deploy_lambda_role_arn" {
  description = "The ARN of the IAM role used by GitHub Actions to deploy the IVS video processing Lambda."
  value       = aws_iam_role.deploy_lambda.arn
}

output "ingest_api_endpoint" {
  description = "The domain of the HTTP API for the ingest Lambda."
  value       = "https://${var.custom_domain_name}/ingest"
}