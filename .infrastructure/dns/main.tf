resource "aws_route53_zone" "prod" {
  name = "developer.pagopa.it"
  comment = "DNS zone for production"
}

resource "aws_route53_zone" "dev" {
  name = "dev.developer.pagopa.it"
  comment = "DNS zone for development"
}
