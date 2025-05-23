aws_region        = "eu-south-1"
environment       = "uat"
github_repository = "pagopa/developer-portal"

tags = {
  CreatedBy   = "Terraform"
  Environment = "uat"
  Owner       = "Devportal"
  Source      = "https://github.com/pagopa/developer-portal"
  CostCenter  = "BD110 - PORTALS and TOOLS"
}

cdn_custom_headers = [
  {
    header   = "X-Robots-Tag"
    override = true
    value    = "noindex"
  }
]

dns_domain_name = "uat.developer.pagopa.it"

use_custom_certificate = true

# CMS Strapi DNS
dns_domain_name_cms = {
  "cms.uat.developer.pagopa.it" = {
    comment = "DNS domain name of the Developer Portal's CMS"
  }
}

create_chatbot            = true
ac_integration_is_enabled = false
docs_redirect_is_enabled  = false
website_is_standalone     = true