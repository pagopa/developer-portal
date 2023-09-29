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

  ses_group_name = "DevPortalSES"
  user_name      = "DevPortal"
}

# These are just email addresses used during test
# With sandbox env of SES we can only send email to verified email addresses
# TODO: remove these when we switch to production
resource "aws_sesv2_email_identity" "marco" {
  email_identity = "marco.comi@pagopa.it"
}
resource "aws_sesv2_email_identity" "alessandro" {
  email_identity = "alessandro.ferlin@pagopa.it"
}
resource "aws_sesv2_email_identity" "kada" {
  email_identity = "carloalberto.degliatti@pagopa.it"
}
resource "aws_sesv2_email_identity" "andrea" {
  email_identity = "andrea.gurrieri@pagopa.it"
}
resource "aws_sesv2_email_identity" "fabrizio" {
  email_identity = "fabrizio.ulisse@pagopa.it"
}
resource "aws_sesv2_email_identity" "monica" {
  email_identity = "monica.costantini@pagopa.it"
}
resource "aws_sesv2_email_identity" "norma" {
  email_identity = "norma.cocito@pagopa.it"
}
resource "aws_sesv2_email_identity" "marco_bot" {
  email_identity = "marco.bottaro@uqido.com"
}
resource "aws_sesv2_email_identity" "marco_ponchia" {
  email_identity = "marco.ponchia@uqido.com"
}
resource "aws_sesv2_email_identity" "jeremy" {
  email_identity = "jeremy.gordillo@uqido.com"
}
resource "aws_sesv2_email_identity" "tommaso" {
  email_identity = "tommaso.rosso@uqido.com"
}
