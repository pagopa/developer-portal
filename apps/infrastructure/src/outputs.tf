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
    s3_recording_bucket_name   = module.video_streaming.s3_recording_bucket_name
    ivs_channel_details        = module.video_streaming.ivs_channel_details
    api_gateway_invoke_url     = module.video_streaming.webinar_metrics_api_url
    deploy_lambda_iam_role_arn = module.video_streaming.deploy_lambda_role_arn
  }

  description = "Outputs from the video streaming module."
}
