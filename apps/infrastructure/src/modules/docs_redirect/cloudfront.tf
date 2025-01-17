## Function to manipulate the request
resource "aws_cloudfront_function" "website_viewer_request_handler" {
  name    = "website-viewer-request-handler"
  runtime = "cloudfront-js-1.0"
  # publish this version only if the env is true
  publish = var.publish_cloudfront_functions
  code    = file("${path.root}/../../cloudfront-functions/dist/viewer-request-handler.js")
}

## Static website CDN
resource "aws_cloudfront_distribution" "website" {

  origin {
    domain_name = "hosting.gitbook.io"
    origin_id = "hosting.gitbook.io"
  }

  enabled             = true # enable CloudFront distribution
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for docs.pagopa.it redirect."
  default_root_object = "index.html"

  aliases = var.use_custom_certificate && var.dns_domain_name != "" ? [format("www.%s", var.dns_domain_name), var.dns_domain_name] : []

  custom_error_response {
    error_code         = 404
    response_code      = 404
    response_page_path = "/404.html"
  }

  default_cache_behavior {
    # HTTPS requests we permit the distribution to serve
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "hosting.gitbook.io"
    response_headers_policy_id = aws_cloudfront_response_headers_policy.websites.id

    forwarded_values {
      query_string = true
      headers      = []
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0     # min time for objects to live in the distribution cache
    default_ttl            = 3600  # default time for objects to live in the distribution cache
    max_ttl                = 86400 # max time for objects to live in the distribution cache

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.website_viewer_request_handler.arn
    }
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.use_custom_certificate ? false : true
    acm_certificate_arn            = var.use_custom_certificate ? aws_acm_certificate.website.arn : null
    ssl_support_method             = var.use_custom_certificate ? "sni-only" : null
  }
}
