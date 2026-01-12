## Certificate HTTPS for CMS Strapi
module "cms_ssl_certificate" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-acm.git?ref=5d113fa07675fc42237907a621b68ac97109043e" # v6.3.0

  domain_name = keys(var.dns_domain_name_cms)[0]
  zone_id     = var.hosted_zone_id

  subject_alternative_names = [
    "www.${keys(var.dns_domain_name_cms)[0]}"
  ]

  wait_for_validation = false # https://github.com/terraform-aws-modules/terraform-aws-acm/blob/8d0b22f1f242a1b36e29b8cb38aaeac9b887500d/README.md?plain=1#L174
  validation_method   = "DNS"
  dns_ttl             = 3600
}

## SSL certificate for Strapi Media Library CDN
module "strapi_media_library_ssl_certificate" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-acm.git?ref=5d113fa07675fc42237907a621b68ac97109043e" # v6.3.0

  domain_name = format("cdn.%s", var.dns_domain_name)
  zone_id     = var.hosted_zone_id

  providers = {
    aws = aws.us-east-1
  }

  # Because it is ran in an automated pipeline
  # https://github.com/terraform-aws-modules/terraform-aws-acm/blob/8d0b22f1f242a1b36e29b8cb38aaeac9b887500d/README.md?plain=1#L174
  wait_for_validation = false
  validation_method   = "DNS"
  dns_ttl             = 3600
}
