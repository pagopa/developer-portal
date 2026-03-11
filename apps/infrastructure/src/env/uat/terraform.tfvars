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
  },
  {
    header   = "Server"
    override = true
    value    = "None"
  }
]

dns_domain_name = "uat.developer.pagopa.it"

use_custom_certificate = true

cms_app_image_tag = "be063f4cb6aa1e5d37ba16d02568702129721543"

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