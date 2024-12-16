output "base_url_param" {
  value = module.active_campaign_base_url.ssm_parameter_arn
}

output "api_key_param" {
  value = module.active_campaign_api_key.ssm_parameter_arn
}