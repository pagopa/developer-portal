variable "aws_region" {
  type        = string
  description = "AWS region to create resources. Default Milan"
  default     = "eu-south-1"
}

variable "environment" {
  type        = string
  description = "Environment"
}

variable "github_repository" {
  type        = string
  description = "The repository where the IaC workflows will run"
}

variable "app_name" {
  type        = string
  description = "App name."
}

variable "tags" {
  type = map(any)
  default = {
    CreatedBy = "Terraform"
  }
}

# ## Public Dns zones
# variable "public_dns_zones" {
#   type        = map(any)
#   description = "Route53 Hosted Zone"
#   default     = null
# }

# variable "dns_record_ttl" {
#   type        = number
#   description = "Dns record ttl (in sec)"
#   default     = 86400 # 24 hours
# }

variable "cdn_custom_headers" {
  type = list(object(
    {
      header   = string
      override = bool
      value    = string
    }
  ))
  default = []
}
