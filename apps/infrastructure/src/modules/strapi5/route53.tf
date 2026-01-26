locals {
  domain_validations_options = setunion(
    module.cms_ssl_certificate.acm_certificate_domain_validation_options,
    module.strapi_media_library_ssl_certificate.acm_certificate_domain_validation_options
  )
}


resource "aws_route53_record" "certificate" {
  for_each = {
    for dvo in local.domain_validations_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 3600 # 1 hour
  type            = each.value.type
  zone_id         = var.hosted_zone_id
}


# Add DNS record for CMS Strapi
module "cms_dns_records" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-route53.git//modules/records?ref=bc63328714550fd903d2574b263833c9ce1c867e" # v2.11.0"

  zone_id = var.hosted_zone_id

  records = [
    {
      name = "strapiv5"
      type = "A"
      alias = {
        name                   = module.cms_load_balancer.dns_name
        zone_id                = module.cms_load_balancer.zone_id
        evaluate_target_health = false
      }
    }
  ]
}

// This Route53 record will point at the Strapi Media Library CDN
resource "aws_route53_record" "strapi_media_library" {
  zone_id = var.hosted_zone_id
  name    = format("cdnv5.%s", var.dns_domain_name)
  type    = "A"

  alias {
    name                   = module.cloudfront_cms.cloudfront_distribution_domain_name
    zone_id                = module.cloudfront_cms.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}
