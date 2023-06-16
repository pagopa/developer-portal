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

resource "aws_route53_record" "certificate" {
  for_each = {
    for dvo in aws_acm_certificate.website.domain_validation_options : dvo.domain_name => {
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
resource "aws_route53_record" "website" {
  zone_id = aws_route53_zone.dev_portal.zone_id
  name    = var.dns_domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }
}
