env_short   = "d"
environment = "dev"

cdn_custom_headers = [
  {
    header   = "X-Robots-Tag"
    override = true
    value    = "noindex"
  }
]

# Ref: https://pagopa.atlassian.net/wiki/spaces/DEVOPS/pages/132810155/Azure+-+Naming+Tagging+Convention#Tagging
tags = {
  CreatedBy   = "Terraform"
  Environment = "Dev"
  Owner       = "developer-portal"
  Source      = "pagopa/developer-portal"
  CostCenter  = "BD100 - STRATEGIC INNOVATION"
}
