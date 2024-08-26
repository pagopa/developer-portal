resource "aws_route53_zone" "dev_portal" {
  name = var.dns_domain_name
}

# Delegation
resource "aws_route53_record" "devportal_delegate" {
  for_each = var.dns_delegate_records

  allow_overwrite = true
  name            = each.key
  ttl             = 3600
  type            = "NS"
  zone_id         = aws_route53_zone.dev_portal.zone_id

  records = each.value
}

// TODO: Once the Terraform module will be fixed, we can remove these two dkim records
// TXT Record SES will use to validate that a message was not forged or altered in transit
resource "aws_route53_record" "devportal_ses_dkim_txt" {
  name    = module.ses_developer_pagopa_it.verification_token.name
  type    = "TXT"
  zone_id = aws_route53_zone.dev_portal.zone_id
  records = [module.ses_developer_pagopa_it.verification_token.value]
  ttl     = 3600
}

// CNAME Record SES will use to validate that a message was not forged or altered in transit
resource "aws_route53_record" "devportal_ses_dkim_cname" {
  count = 3

  zone_id = aws_route53_zone.dev_portal.zone_id
  name    = module.ses_developer_pagopa_it.dkim_tokens[count.index].name
  type    = "CNAME"
  ttl     = 3600
  records = [module.ses_developer_pagopa_it.dkim_tokens[count.index].value]
}

resource "aws_route53_record" "devportal_google_site_verification_txt" {
  count = var.environment == "prod" ? 1 : 0

  name    = ""
  type    = "TXT"
  zone_id = aws_route53_zone.dev_portal.zone_id
  records = ["google-site-verification=Z94dFrXZD0YqP-r5BY5ODb4NsbQBAggTGRZM9fNtOj0"]
  ttl     = 3600
}

# Active Campaign Records
module "active_campaign_dns_records" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-route53.git//modules/records?ref=bc63328714550fd903d2574b263833c9ce1c867e" # v2.11.0"

  zone_id = aws_route53_zone.dev_portal.id
  # Create only on production environment
  create = var.environment == "prod"

  records = [
    {
      name    = "acdkim1._domainkey"
      type    = "CNAME"
      records = ["dkim.acdkim1.acems1.com"]
      ttl     = 3600
    },
    {
      name    = "acdkim2._domainkey"
      type    = "CNAME"
      records = ["dkim.acdkim2.acems1.com"]
      ttl     = 3600
    },
    {
      name    = "em-3628291"
      type    = "CNAME"
      records = ["cmd.emsend1.com"]
      ttl     = 3600
    },
    {
      name    = "_dmarc"
      type    = "TXT"
      records = ["v=DMARC1;p=none;"]
      ttl     = 3600
    }
  ]
}

resource "aws_route53_zone" "chatbot" {
  count = var.create_chatbot ? 1 : 0
  name  = "${var.dns_chatbot_domain_prefix}.${aws_route53_zone.dev_portal.name}"
}

# Delegation
resource "aws_route53_record" "chatbot_ns" {
  count   = var.create_chatbot ? 1 : 0
  zone_id = aws_route53_zone.dev_portal.zone_id
  name    = aws_route53_zone.chatbot[0].name
  type    = "NS"
  ttl     = 300
  records = aws_route53_zone.chatbot[0].name_servers
}