output "terraform_backend_bucket_name" {
  value = module.identity.terraform_backend_bucket_name
}

output "terraform_lock_dynamodb_table" {
  value = module.identity.terraform_lock_dynamodb_table
}

output "name_servers_records" {
  value = module.core.name_servers_records
}

output "iam_role_deploy_standalone_website_arn" {
  value = module.cicd.iam_role_deploy_standalone_website_arn
}

output "standalone_server" {
  value = module.website.standalone_server
}


## video streaming outputs ##

output "video_streaming" {
  value = {
    s3_recording_bucket_name = module.video_streaming.s3_recording_bucket_name
    ivs_channel_details      = module.video_streaming.ivs_channel_details
    ingest_metrics_endpoint  = module.video_streaming.ingest_metrics_endpoint
  }

  description = "Outputs from the video streaming module."
}

# -----------------
