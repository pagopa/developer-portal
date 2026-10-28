variable "environment" {
  description = "Deployment environment used to name backup resources."
  type        = string
}

variable "region" {
  description = "AWS region of the provider passed to this module; used to keep names unique across regional instances."
  type        = string

  validation {
    condition     = can(regex("^[a-z]{2}-[a-z]+-[0-9]$", var.region))
    error_message = "Region must be a valid AWS region name, for example eu-south-1."
  }
}
