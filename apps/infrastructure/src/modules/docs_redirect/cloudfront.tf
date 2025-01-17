## Function to manipulate the request
resource "aws_cloudfront_function" "redirect_viewer_request_handler" {
  name    = "redirect-viewer-request-handler"
  runtime = "cloudfront-js-2.0"
  comment = "Redirects ${var.domain_to_redirect.from} requests to the correct domain"
  # publish this version only if the env is true
  publish = true
  code    = file("${path.root}/../../cloudfront-functions/dist/viewer-request-handler.js")
}

resource "aws_cloudfront_distribution" "redirect" {

  origin {
    domain_name = "hosting.gitbook.io"
    origin_id   = "hosting.gitbook.io"
  }

  enabled             = true # enable CloudFront distribution
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for ${var.domain_to_redirect.from} redirect."
  default_root_object = "index.html"

  aliases = var.use_custom_certificate && var.domain_to_redirect.from != "" ? [ var.domain_to_redirect.from ] : []

  default_cache_behavior {
    # HTTPS requests we permit the distribution to serve
    allowed_methods            = ["GET", "HEAD", "OPTIONS", "POST"]
    cached_methods             = []
    target_origin_id           = "hosting.gitbook.io"

    cache_policy_id          = data.aws_cloudfront_cache_policy.this.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.this.id

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0     # min time for objects to live in the distribution cache
    default_ttl            = 3600  # default time for objects to live in the distribution cache
    max_ttl                = 86400 # max time for objects to live in the distribution cache

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.redirect_viewer_request_handler.arn
    }
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.use_custom_certificate ? false : true
    acm_certificate_arn            = var.use_custom_certificate ? aws_acm_certificate.redirect.arn : null
    ssl_support_method             = var.use_custom_certificate ? "sni-only" : null
  }
}
