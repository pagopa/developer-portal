module "ses_developer_pagopa_it" {
  source     = "github.com/pagopa/terraform-aws-ses.git?ref=58c1263afa441692e67d1be5dca809e65d6852df" # v1.2.1
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
