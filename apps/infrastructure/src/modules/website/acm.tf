resource "aws_acm_certificate" "website" {
  domain_name               = var.dns_domain_name
  validation_method         = "DNS"
  subject_alternative_names = [format("www.%s", var.dns_domain_name)]

  lifecycle {
    create_before_destroy = true
  }

  # TLS certificate generated in us-east because it is related to the CDN which is a global resource
  provider = aws.us-east-1
}

resource "aws_acm_certificate" "auth" {
  domain_name       = format("auth.%s", var.dns_domain_name)
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  # TLS certificate generated in us-east because it is related to the CDN which is a global resource
  provider = aws.us-east-1
}


# Route53 DNS validation records for the website ACM certificate

resource "aws_acm_certificate" "static_contents" {
  domain_name       = local.dns_domain_name_static_contents
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  # TLS certificate generated in us-east because it is related to the CDN which is a global resource
  provider = aws.us-east-1
}