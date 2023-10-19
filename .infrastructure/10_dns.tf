resource "aws_route53_zone" "dev_portal" {
  name = var.dns_domain_name
}

# Delegation
resource "aws_route53_record" "devportal_delegate" {
  for_each = var.dns_delegate_records

  allow_overwrite = true
  name            = each.key
  ttl             = 3600
  type            = "NS"
  zone_id         = aws_route53_zone.dev_portal.zone_id

  records = each.value
}

locals {
  domain_validations_options = setunion(
    aws_acm_certificate.website.domain_validation_options,
    aws_acm_certificate.auth.domain_validation_options
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
  zone_id         = aws_route53_zone.dev_portal.zone_id
}

// This Route53 record will point at our CloudFront distribution.
resource "aws_route53_record" "www_website" {
  zone_id = aws_route53_zone.dev_portal.zone_id
  name    = format("www.%s", var.dns_domain_name)
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "website" {
  zone_id = aws_route53_zone.dev_portal.zone_id
  name    = var.dns_domain_name
  type    = "A"

  alias {
    name                   = aws_route53_record.www_website.name
    zone_id                = aws_route53_record.www_website.zone_id
    evaluate_target_health = false
  }
}

// This Route53 record point to Cognito UI.
resource "aws_route53_record" "devportal_cognito_A" {
  name    = aws_cognito_user_pool_domain.devportal.domain
  type    = "A"
  zone_id = aws_route53_zone.dev_portal.zone_id
  alias {
    evaluate_target_health = false

    name    = aws_cognito_user_pool_domain.devportal.cloudfront_distribution
    zone_id = aws_cognito_user_pool_domain.devportal.cloudfront_distribution_zone_id
  }
}

// TODO: Once the Terraform module will be fixed, we can remove these two dkim records
// TXT Record SES will use to validate that a message was not forged or altered in transit
resource "aws_route53_record" "devportal_ses_dkim_txt" {
  name    = module.ses_developer_pagopa_it.verification_token.name
  type    = "TXT"
  zone_id = aws_route53_zone.dev_portal.zone_id
  records = [module.ses_developer_pagopa_it.verification_token.value]
  ttl     = 3600
}

// CNAME Record SES will use to validate that a message was not forged or altered in transit
resource "aws_route53_record" "devportal_ses_dkim_cname" {
  count = 3

  zone_id = aws_route53_zone.dev_portal.zone_id
  name    = module.ses_developer_pagopa_it.dkim_tokens[count.index].name
  type    = "CNAME"
  ttl     = 3600
  records = [module.ses_developer_pagopa_it.dkim_tokens[count.index].value]
}
