locals {
  dns_enabled        = var.dns_hosted_zone_id != "" && var.dns_record_name != ""
  create_certificate = local.dns_enabled && var.acm_certificate_arn == ""
  domain_name        = local.dns_enabled ? "${var.dns_record_name}.${trimsuffix(data.aws_route53_zone.this[0].name, ".")}" : ""
  certificate_arn    = local.create_certificate ? aws_acm_certificate_validation.this[0].certificate_arn : var.acm_certificate_arn
}

data "aws_route53_zone" "this" {
  count   = local.dns_enabled ? 1 : 0
  zone_id = var.dns_hosted_zone_id

  lifecycle {
    postcondition {
      condition     = !self.private_zone
      error_message = "dns_hosted_zone_id must identify a public hosted zone for the internet-facing ALB and ACM DNS validation."
    }
  }
}

resource "aws_acm_certificate" "this" {
  count = local.create_certificate ? 1 : 0

  domain_name       = local.domain_name
  validation_method = "DNS"
  tags              = local.tags

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "certificate_validation" {
  count = local.create_certificate ? 1 : 0

  zone_id = data.aws_route53_zone.this[0].zone_id
  name    = one(aws_acm_certificate.this[0].domain_validation_options).resource_record_name
  type    = one(aws_acm_certificate.this[0].domain_validation_options).resource_record_type
  ttl     = 60
  records = [one(aws_acm_certificate.this[0].domain_validation_options).resource_record_value]
}

resource "aws_acm_certificate_validation" "this" {
  count = local.create_certificate ? 1 : 0

  certificate_arn         = aws_acm_certificate.this[0].arn
  validation_record_fqdns = [aws_route53_record.certificate_validation[0].fqdn]
}

resource "aws_route53_record" "alb" {
  count = local.dns_enabled ? 1 : 0

  zone_id = data.aws_route53_zone.this[0].zone_id
  name    = local.domain_name
  type    = "A"

  alias {
    name                   = aws_lb.this.dns_name
    zone_id                = aws_lb.this.zone_id
    evaluate_target_health = true
  }
}
