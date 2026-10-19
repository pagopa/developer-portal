locals {
  create_certificate = var.acm_certificate_arn == "" && !var.allow_plaintext_alb
}

data "aws_route53_zone" "litellm" {
  count = local.create_certificate ? 1 : 0

  zone_id = var.hosted_zone_id
}

resource "aws_acm_certificate" "litellm" {
  count = local.create_certificate ? 1 : 0

  domain_name       = "litellm.${trimsuffix(data.aws_route53_zone.litellm[0].name, ".")}"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "certificate_validation" {
  count = local.create_certificate ? 1 : 0

  zone_id = data.aws_route53_zone.litellm[0].zone_id
  name    = one(aws_acm_certificate.litellm[0].domain_validation_options).resource_record_name
  type    = one(aws_acm_certificate.litellm[0].domain_validation_options).resource_record_type
  records = [one(aws_acm_certificate.litellm[0].domain_validation_options).resource_record_value]
  ttl     = 300
}

resource "aws_acm_certificate_validation" "litellm" {
  count = local.create_certificate ? 1 : 0

  certificate_arn         = aws_acm_certificate.litellm[0].arn
  validation_record_fqdns = [for record in aws_route53_record.certificate_validation : record.fqdn]
}

resource "aws_route53_record" "litellm" {
  count = local.create_certificate ? 1 : 0

  zone_id = data.aws_route53_zone.litellm[0].zone_id
  name    = aws_acm_certificate.litellm[0].domain_name
  type    = "CNAME"
  records = [module.litellm.alb_dns_name]
  ttl     = 300
}
