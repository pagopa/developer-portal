## Function to manipulate the request
resource "aws_cloudfront_function" "redirect_viewer_request_handler" {
  name    = "redirect-viewer-request-handler"
  runtime = "cloudfront-js-2.0"
  comment = "Redirects ${var.domain_to_redirect.from} requests to the correct domain"
  # publish this version only if the env is true
  publish = true
  code    = var.cloudfront_function_code
}

resource "aws_cloudfront_response_headers_policy" "redirect" {
  name    = "redirect-response-headers-policy"
  comment = "Response headers policy for redirect distribution"

  custom_headers_config {
    items {
      header   = "Server"
      override = true
      value    = "None"
    }
  }
}

resource "aws_cloudfront_distribution" "redirect" {

  origin {
    domain_name = "hosting.gitbook.io"
    origin_id   = "hosting.gitbook.io"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "match-viewer"
      origin_ssl_protocols   = ["TLSv1.1", "TLSv1.2"]
    }
  }

  enabled         = true # enable CloudFront distribution
  is_ipv6_enabled = true
  comment         = "CloudFront distribution for ${var.domain_to_redirect.from} redirect."

  aliases = var.use_custom_certificate && var.domain_to_redirect.from != "" ? [var.domain_to_redirect.from] : []

  default_cache_behavior {
    # HTTPS requests we permit the distribution to serve
    allowed_methods  = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "hosting.gitbook.io"

    cache_policy_id            = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" # Managed-CachingDisabled
    origin_request_policy_id   = "216adef6-5c7f-47e4-b989-5492eafa07d3" # Managed-AllViewer
    response_headers_policy_id = aws_cloudfront_response_headers_policy.redirect.id

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0 # min time for objects to live in the distribution cache
    default_ttl            = 0 # default time for objects to live in the distribution cache
    max_ttl                = 0 # max time for objects to live in the distribution cache

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
    acm_certificate_arn            = var.use_custom_certificate ? module.redirect_certificate.acm_certificate_arn : null
    ssl_support_method             = var.use_custom_certificate ? "sni-only" : null
    minimum_protocol_version       = var.use_custom_certificate ? "TLSv1.2_2021" : null
  }
}
