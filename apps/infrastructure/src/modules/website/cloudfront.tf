# CSP entries
locals {
  script_src  = "'self' 'unsafe-inline' www.youtube.com https://*.cookielaw.org/ https://*.onetrust.com https://www.google-analytics.com https://cdn.matomo.cloud/pagopa.matomo.cloud/ https://pagopa.matomo.cloud/ https://recaptcha.net https://www.gstatic.com https://www.google.com https://www.googletagmanager.com"
  style_src   = "'self' 'unsafe-inline' recaptcha.net https://privacyportalde-cdn.onetrust.com/privacy-notice-scripts/css/"
  object_src  = "'none'"
  form_action = "'self'"
  font_src    = "data: 'self' https://privacyportalde-cdn.onetrust.com/privacy-notice-scripts/icons/"
  connect_src = "'self' https://cognito-identity.eu-south-1.amazonaws.com/ https://dynamodb.eu-south-1.amazonaws.com/ https://cognito-idp.eu-south-1.amazonaws.com/ https://raw.githubusercontent.com/pagopa/ https://raw.githubusercontent.com/teamdigitale/ https://*.cookielaw.org https://*.onetrust.com https://www.google-analytics.com https://api.io.italia.it *.google-analytics.com https://pagopa.matomo.cloud/ https://*.${var.dns_domain_name}"
  img_src     = "data: 'self' https://i.vimeocdn.com/ https://io.italia.it/assets/ https://raw.githubusercontent.com/pagopa/ https://www.pagopa.gov.it/assets/ https://*.cookielaw.org/logos/ recaptcha.net  https://*.googleusercontent.com https://*.dev.developer.pagopa.it https://*.developer.pagopa.it"
  frame_src   = "https://player.vimeo.com/ https://vimeo.com/ https://demo.arcade.software/ https://www.google.com https://recaptcha.net https://www.youtube.com https://pagopa.applytojob.com https://www.figma.com/ https://codepen.io/"
}

resource "aws_cloudfront_origin_access_identity" "main" {
  comment = "Identity to access S3 bucket."
}

resource "aws_cloudfront_response_headers_policy" "websites" {
  name    = "websites"
  comment = "Response custom headers for public static website"

  custom_headers_config {
    items {
      header   = "Server"
      override = true
      value    = "None"
    }

    dynamic "items" {
      for_each = var.cdn_custom_headers
      content {
        header   = items.value.header
        override = items.value.override
        value    = items.value.value
      }
    }
  }

  security_headers_config {
    content_security_policy {
      content_security_policy = format("script-src %s; style-src %s; object-src %s; form-action %s; font-src %s; connect-src %s; img-src %s; frame-src %s", local.script_src, local.style_src, local.object_src, local.form_action, local.font_src, local.connect_src, local.img_src, local.frame_src)
      override                = true
    }
  }
}

## Function to manipulate the request
resource "aws_cloudfront_function" "website_viewer_request_handler" {
  name    = "website-viewer-request-handler"
  runtime = "cloudfront-js-1.0"
  # publish this version only if the env is true
  publish = var.publish_cloudfront_functions
  code    = file("${path.root}/../../cloudfront-functions/dist/viewer-request-handler.js")
}


# cloudfront distribution for standalone static content

resource "aws_cloudfront_response_headers_policy" "static_content_cors" {
  name    = "cors-policy"
  comment = "Cors policy for static contents"

  custom_headers_config {
    items {
      header   = "Server"
      override = true
      value    = "None"
    }
  }

  cors_config {
    access_control_allow_credentials = false

    access_control_allow_headers {
      items = ["*"]
    }


    access_control_allow_methods {
      items = ["GET", "HEAD"]
    }


    access_control_allow_origins {
      items = ["https://${var.dns_domain_name}"]
    }

    origin_override = true
  }
}


## Static website CDN
resource "aws_cloudfront_distribution" "static_contents" {

  origin {
    domain_name = aws_s3_bucket.website_standalone.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.website_standalone.bucket
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path
    }
  }


  enabled         = true # enable CloudFront distribution
  is_ipv6_enabled = true
  comment         = "CloudFront distribution for the static contetnts."


  aliases = [local.dns_domain_name_static_contents]


  default_cache_behavior {
    # HTTPS requests we permit the distribution to serve
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = aws_s3_bucket.website_standalone.bucket
    response_headers_policy_id = aws_cloudfront_response_headers_policy.static_content_cors.id

    forwarded_values {
      query_string = false
      headers      = []
      cookies {
        forward = "none"
      }
    }


    viewer_protocol_policy = "redirect-to-https"
    # aggerssive caching for versioned static contents
    min_ttl     = 3600
    default_ttl = 86400
    max_ttl     = 31536000

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
    cloudfront_default_certificate = false
    acm_certificate_arn            = aws_acm_certificate.static_contents.arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2021"
  }
}
