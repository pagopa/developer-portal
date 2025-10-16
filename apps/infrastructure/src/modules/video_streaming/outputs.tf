output "s3_recording_bucket_name" {
  description = "The name of the S3 bucket where all recordings will be stored."
  value       = aws_s3_bucket.ivs_recordings.id
}

output "ivs_channel_details" {
  description = "A map containing the details for each created IVS channel."
  value = {
    for key, channel in aws_ivs_channel.channels : key => {
      arn             = channel.arn
      ingest_endpoint = "rtmps://${channel.ingest_endpoint}:443/app/"
      playback_url    = channel.playback_url
      stream_key      = data.aws_ivs_stream_key.channels[key].value
    }
  }
  sensitive = true
}