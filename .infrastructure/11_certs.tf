resource "aws_acm_certificate" "website" {
  domain_name       = var.dns_domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  provider = aws.us-east-1
}
