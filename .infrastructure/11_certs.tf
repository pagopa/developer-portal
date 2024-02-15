resource "aws_acm_certificate" "website" {
  domain_name               = var.dns_domain_name
  validation_method         = "DNS"
  subject_alternative_names = [format("www.%s", var.dns_domain_name)]

  lifecycle {
    create_before_destroy = true
  }

  provider = aws.us-east-1
}

resource "aws_acm_certificate" "auth" {
  domain_name       = format("auth.%s", var.dns_domain_name)
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  provider = aws.us-east-1
}

## Certificate HTTPS for CMS Strapi
module "cms_ssl_certificate" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-acm.git?ref=8d0b22f1f242a1b36e29b8cb38aaeac9b887500d" # v5.0.0

  domain_name = keys(var.dns_domain_name_cms)[0]
  zone_id     = module.dns_zone_cms.route53_zone_zone_id[keys(var.dns_domain_name_cms)[0]]

  subject_alternative_names = [
    "www.${keys(var.dns_domain_name_cms)[0]}"
  ]

  wait_for_validation = true
  validation_method   = "DNS"
  dns_ttl             = 3600
}
