resource "aws_cloudfront_origin_access_identity" "main" {
  comment = "Identity to access S3 bucket."
}

resource "aws_cloudfront_response_headers_policy" "websites" {
  name    = "websites"
  comment = "Response custom headers for public static website"

  dynamic "custom_headers_config" {
    for_each = length(var.cdn_custom_headers) > 0 ? ["dummy"] : []
    content {
      dynamic "items" {
        for_each = var.cdn_custom_headers
        content {
          header   = items.value.header
          override = items.value.override
          value    = items.value.value
        }
      }
    }

  }

  security_headers_config {
    content_security_policy {
      content_security_policy = "script-src 'self' 'unsafe-inline' www.youtube.com https://*.cookielaw.org https://*.onetrust.com https://www.google-analytics.com https://cdn.matomo.cloud/pagopa.matomo.cloud https://pagopa.matomo.cloud https://recaptcha.net https://www.gstatic.com https://www.google.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' recaptcha.net; object-src 'none'; form-action 'self'; font-src data: 'self'; connect-src 'self' https://*.cookielaw.org https://*.onetrust.com https://www.google-analytics.com https://api.io.italia.it *.google-analytics.com; img-src data: 'self' recaptcha.net; frame-src https://www.google.com https://recaptcha.net https://www.youtube.com https://pagopa.applytojob.com"
      override                = true
    }
  }
}

## Function to manipulate the request
resource "aws_cloudfront_function" "website_viewer_request_handler" {
  name    = "website-viewer-request-handler"
  runtime = "cloudfront-js-1.0"
  publish = true
  code    = file("${path.module}/../apps/cloudfront-functions/dist/viewer-request-handler.js")
}

## Static website CDN
resource "aws_cloudfront_distribution" "website" {

  origin {
    domain_name = aws_s3_bucket.website.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.website.bucket

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path
    }
  }

  enabled             = true # enable CloudFront distribution
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for the static website."
  default_root_object = "index.html"

  aliases = []

  custom_error_response {
    error_code         = 404
    response_code      = 404
    response_page_path = "/404.html"
  }

  default_cache_behavior {
    # HTTPS requests we permit the distribution to serve
    allowed_methods            = ["GET", "HEAD", "OPTIONS", ]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = aws_s3_bucket.website.bucket
    response_headers_policy_id = aws_cloudfront_response_headers_policy.websites.id

    forwarded_values {
      query_string = false
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
    cloudfront_default_certificate = true
    acm_certificate_arn            = null
    ssl_support_method             = null
  }
}
