resource "aws_cloudfront_response_headers_policy" "cms_media_library" {
  name    = "cms-media-library-response-headers-policy"
  comment = "Response headers policy for CMS media library distribution"

  custom_headers_config {
    items {
      header   = "Server"
      override = true
      value    = "None"
    }
  }
}

## CDN to Media Library for CMS Strapi
module "cloudfront_cms" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudfront.git?ref=ed0f1f983f606304e00ad9f48399bd2fe0b79233" # v3.2.2

  create_origin_access_identity = true
  origin_access_identities = {
    s3_cms = "Identity to access S3 bucket"
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
  comment         = "CloudFront distribution for the CMS Media Library"

  viewer_certificate = {
    cloudfront_default_certificate = false
    acm_certificate_arn            = module.strapi_media_library_ssl_certificate.acm_certificate_arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2021"
  }

  aliases = module.strapi_media_library_ssl_certificate.distinct_domain_names

  default_cache_behavior = {
    allowed_methods            = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods             = ["GET", "HEAD", "OPTIONS"]
    target_origin_id           = "s3_one"
    viewer_protocol_policy     = "redirect-to-https"
    min_ttl                    = 0     # min time for objects to live in the distribution cache
    default_ttl                = 3600  # default time for objects to live in the distribution cache
    max_ttl                    = 86400 # max time for objects to live in the distribution cache
    response_headers_policy_id = aws_cloudfront_response_headers_policy.cms_media_library.id

    forwarded_values = {
      query_string = false
      headers      = []
      cookies = {
        forward = "none"
      }
    }
  }

  geo_restriction = {
    restriction_type = "none"
  }
}
