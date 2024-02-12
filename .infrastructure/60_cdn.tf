locals {
  script_src  = "'self' 'unsafe-inline' www.youtube.com https://*.cookielaw.org/ https://*.onetrust.com https://www.google-analytics.com https://cdn.matomo.cloud/pagopa.matomo.cloud/ https://pagopa.matomo.cloud/ https://recaptcha.net https://www.gstatic.com https://www.google.com https://www.googletagmanager.com"
  style_src   = "'self' 'unsafe-inline' recaptcha.net https://privacyportalde-cdn.onetrust.com/privacy-notice-scripts/css/"
  object_src  = "'none'"
  form_action = "'self'"
  font_src    = "data: 'self' https://privacyportalde-cdn.onetrust.com/privacy-notice-scripts/icons/"
  connect_src = "'self' https://cognito-identity.eu-south-1.amazonaws.com/ https://dynamodb.eu-south-1.amazonaws.com/ https://cognito-idp.eu-south-1.amazonaws.com/ https://raw.githubusercontent.com/pagopa/ https://raw.githubusercontent.com/teamdigitale/ https://*.cookielaw.org https://*.onetrust.com https://www.google-analytics.com https://api.io.italia.it *.google-analytics.com https://pagopa.matomo.cloud/"
  img_src     = "data: 'self' https://i.vimeocdn.com/ https://io.italia.it/assets/ https://raw.githubusercontent.com/pagopa/ https://www.pagopa.gov.it/assets/ https://*.cookielaw.org/logos/ recaptcha.net"
  frame_src   = "https://vimeo.com/ https://demo.arcade.software/ https://www.google.com https://recaptcha.net https://www.youtube.com https://pagopa.applytojob.com https://www.figma.com/ https://codepen.io/"
}

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
    cloudfront_default_certificate = var.use_custom_certificate ? false : true
    acm_certificate_arn            = var.use_custom_certificate ? aws_acm_certificate.website.arn : null
    ssl_support_method             = var.use_custom_certificate ? "sni-only" : null
  }
}

## CDN to Medialibrary for CMS Strapi
module "cloudfront_cms" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudfront.git?ref=ed0f1f983f606304e00ad9f48399bd2fe0b79233" # v3.2.2

  create_origin_access_identity = true
  origin_access_identities = {
    s3_cms = "Identity to access S3 bucket."
  }

  origin = {
    s3_one = {
      domain_name = module.s3_bucket_cms.s3_bucket_bucket_regional_domain_name
      s3_origin_config = {
        origin_access_identity = "s3_cms"
      }
    }
  }

  enabled         = true
  is_ipv6_enabled = true
  comment         = "CloudFront distribution for the medialibrary cms."

  default_cache_behavior = {
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    target_origin_id       = "s3_one" #module.s3_bucket_cms.s3_bucket_bucket_regional_domain_name
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0     # min time for objects to live in the distribution cache
    default_ttl            = 3600  # default time for objects to live in the distribution cache
    max_ttl                = 86400 # max time for objects to live in the distribution cache

    forwarded_values = {
      query_string = false
      headers      = []
      cookies = {
        forward = "none"
      }
    }

    viewer_certificate = {
      cloudfront_default_certificate = true
    }

    geo_restriction = {
      restriction_type = "none"
    }
  }
}
