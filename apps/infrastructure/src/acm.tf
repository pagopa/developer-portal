resource "aws_acm_certificate" "website" {
  domain_name               = var.dns_domain_name
  validation_method         = "DNS"
  subject_alternative_names = [format("www.%s", var.dns_domain_name)]

  lifecycle {
    create_before_destroy = true
  }

  # TLS certificate generated in us-east because it is related to the CDN which is a global resource
  provider = aws.us-east-1
}

resource "aws_acm_certificate" "auth" {
  domain_name       = format("auth.%s", var.dns_domain_name)
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  # TLS certificate generated in us-east because it is related to the CDN which is a global resource
  provider = aws.us-east-1
}

## Certificate HTTPS for CMS Strapi
module "cms_ssl_certificate" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-acm.git?ref=8d0b22f1f242a1b36e29b8cb38aaeac9b887500d" # v5.0.0

  domain_name = keys(var.dns_domain_name_cms)[0]
  zone_id     = aws_route53_zone.dev_portal.id

  subject_alternative_names = [
    "www.${keys(var.dns_domain_name_cms)[0]}"
  ]

  wait_for_validation = false # https://github.com/terraform-aws-modules/terraform-aws-acm/blob/8d0b22f1f242a1b36e29b8cb38aaeac9b887500d/README.md?plain=1#L174
  validation_method   = "DNS"
  dns_ttl             = 3600
}

## SSL certificate for Strapi Media Library CDN
module "strapi_media_library_ssl_certificate" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-acm.git?ref=8d0b22f1f242a1b36e29b8cb38aaeac9b887500d" # v5.0.0

  domain_name = format("cdn.%s", var.dns_domain_name)
  zone_id     = aws_route53_zone.dev_portal.id

  providers = {
    aws = aws.us-east-1
  }

  # Because it is ran in an automated pipeline
  # https://github.com/terraform-aws-modules/terraform-aws-acm/blob/8d0b22f1f242a1b36e29b8cb38aaeac9b887500d/README.md?plain=1#L174
  wait_for_validation = false
  validation_method   = "DNS"
  dns_ttl             = 3600
}
