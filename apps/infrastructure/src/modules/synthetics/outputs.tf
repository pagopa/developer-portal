output "artifact_bucket_name" {
  description = "S3 bucket storing canary run artifacts."
  value       = aws_s3_bucket.artifacts.bucket
}

output "canary_name" {
  description = "Name of the heartbeat canary."
  value       = awscc_synthetics_canary.heartbeat.name
}
