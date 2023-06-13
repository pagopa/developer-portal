resource "aws_route53_zone" "dev_portal" {
  name = var.dns_domain_name
}
