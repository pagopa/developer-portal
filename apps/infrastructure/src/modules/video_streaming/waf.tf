module "video_waf" {
  source = "../waf"

  providers = {
    aws = aws.us-east-1
  }

  environment              = var.environment
  name                     = "${var.project_name}-video-waf"
  metric_name_prefix       = "devportal-${var.environment}-alb" # Retain existing rule metric names.
  scope                    = "CLOUDFRONT"
  sampled_requests_enabled = false
}
