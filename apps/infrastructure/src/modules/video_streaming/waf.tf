module "video_waf" {
  source = "../waf"

  providers = {
    aws = aws.us-east-1
  }

  environment              = var.environment
  name                     = "${var.project_name}-video-waf"
  scope                    = "CLOUDFRONT"
  sampled_requests_enabled = false
}
