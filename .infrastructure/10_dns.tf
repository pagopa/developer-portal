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
