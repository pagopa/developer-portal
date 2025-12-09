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

output "dead_letter_queue_url" {
  description = "The URL of the SQS dead letter queue for failed Lambda invocations."
  value       = aws_sqs_queue.ivs_video_processing_dlq.url
}

output "dead_letter_queue_arn" {
  description = "The ARN of the SQS dead letter queue for failed Lambda invocations."
  value       = aws_sqs_queue.ivs_video_processing_dlq.arn
}