resource "aws_route53_zone" "dev_portal" {
  name = keys(var.public_dns_zones)[0]
}
