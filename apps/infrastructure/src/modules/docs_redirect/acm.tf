resource "aws_acm_certificate" "redirect" {
  domain_name               = var.domain_to_redirect.from
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  # TLS certificate generated in us-east because it is related to the CDN which is a global resource
  provider = aws.us-east-1
}
