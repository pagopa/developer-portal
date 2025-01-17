data "aws_cloudfront_cache_policy" "this" {
  name = "Managed-AllViewer"
}

data "aws_cloudfront_origin_request_policy" "this" {
  name = "Managed-CachingDisabled"
}