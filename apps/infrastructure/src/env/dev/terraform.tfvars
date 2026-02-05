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
    }, {
    header   = "Server"
    override = true
    value    = "None"
  }
]

dns_domain_name = "dev.developer.pagopa.it"

use_custom_certificate = true

cms_app_image_tag = "2f58049234766894fdfbd4a1d2ae1ccc74c37503"

strapi_v5_image_tag = "361cd936ff7ad44b960c1667d847f7ee615290c6"

# CMS Strapi DNS
dns_domain_name_cms = {
  "cms.dev.developer.pagopa.it" = {
    comment = "DNS domain name of the Developer Portal's CMS"
  }
}

rds_cms_scaling_configuration = {
  min_capacity = 1.0
  max_capacity = 3.0
}

create_chatbot            = true
ac_integration_is_enabled = true
docs_redirect_is_enabled  = false

