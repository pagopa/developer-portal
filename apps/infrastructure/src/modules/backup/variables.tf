variable "environment" {
  description = "Deployment environment used to name backup resources."
  type        = string

  validation {
    condition     = contains(["dev", "uat", "prod"], var.environment)
    error_message = "Environment must be dev, uat, or prod."
  }
}

variable "region" {
  description = "AWS region of the provider passed to this module; used to keep names unique across regional instances."
  type        = string

  validation {
    condition     = can(regex("^[a-z]{2}-[a-z]+-[0-9]$", var.region))
    error_message = "Region must be a valid AWS region name, for example eu-south-1."
  }
}
