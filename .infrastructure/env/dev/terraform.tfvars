aws_region        = "eu-south-1"
environment       = "dev"
github_repository = "pagopa/developer-portal"

tags = {
  CreatedBy   = "Terraform"
  Environment = "dev"
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

dns_domain_name = "dev.developer.pagopa.it"

use_custom_certificate = true

# CMS Strapi DNS
dns_domain_name_cms = {
  "cms.dev.developer.pagopa.it" = {
    comment = "DNS domain name of the Developer Portal's CMS"
  }
}