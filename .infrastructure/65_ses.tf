module "ses_developer_pagopa_it" {
  source              = "github.com/pagopa/terraform-aws-ses.git?ref=v1.2.0"
  aws_region          = aws_route53_zone.dev_portal.zone_id
  domain              = var.dns_domain_name

  iam_permissions = [
    "ses:SendCustomVerificationEmail",
    "ses:SendEmail",
    "ses:SendRawEmail",
    "ses:SendTemplatedEmail"
  ]

  mail_from_subdomain = "email"
  ses_group_name = "DevPortalSES"
  user_name      = "DevPortal"
}
