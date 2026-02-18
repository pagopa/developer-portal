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
      distribution_domain_name = aws_cloudfront_distribution.s3_distribution.domain_name
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
