module "ses_developer_pagopa_it" {
  source     = "github.com/pagopa/terraform-aws-ses.git?ref=aaa7462dca50e83809ca614314a3c0da7a6174c4" # v1.2.0
  aws_region = var.aws_region
  domain     = var.dns_domain_name

  iam_permissions = [
    "ses:SendCustomVerificationEmail",
    "ses:SendEmail",
    "ses:SendRawEmail",
    "ses:SendTemplatedEmail"
  ]

  mail_from_subdomain = "email"
  ses_group_name      = "DevPortalSES"
  user_name           = "DevPortal"
}
