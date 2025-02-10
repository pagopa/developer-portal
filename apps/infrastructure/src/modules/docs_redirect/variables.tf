variable "aws_region" {
  type        = string
  description = "AWS region to create resources. Default Milan"
  default     = "eu-south-1"
}

variable "environment" {
  type        = string
  description = "Environment"
}

variable "tags" {
  type = map(any)
  default = {
    CreatedBy = "Terraform"
  }
}

variable "domain_to_redirect" {
  type = object({
    from = string
    to   = string
  })
  default = {
    from = "docs.pagopa.it"
    to   = "developer.pagopa.it"
  }

  description = "Domain to redirect from and to"
}

variable "use_custom_certificate" {
  type        = bool
  default     = true
  description = "Use custom certificate for the cloudfront distribution"
}