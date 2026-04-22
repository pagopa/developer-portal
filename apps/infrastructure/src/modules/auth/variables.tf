variable "aws_region" {
  type        = string
  description = "AWS region to create resources. Default Milan"
  default     = "eu-south-1"
}

variable "environment" {
  type        = string
  description = "Environment"
}

variable "dns_domain_name" {
  description = "DNS domain for the Developer Portal product"
  type        = string
}

variable "hosted_zone_id" {
  type        = string
  description = "The ID of the hosted zone to create the public DNS records in"
}

variable "ses_domain_identity_arn" {
  type        = string
  description = "The ARN of the SES domain identity"
}

variable "mfa_code_duration_in_minutes" {
  type        = number
  description = "The duration for which the MFA code is valid in minutes"
  default     = 15
}

variable "signup_allowed_email_domains" {
  type        = list(string)
  description = "List of allowed email domains for signup"
  default     = ["pagopa.it", "uqido.com", "aizoongroup.com", "dgsspa.com"]
}

variable "log_retention_days" {
  type        = number
  description = "The number of days logs should be retained. Default is 90 days."
  default     = 90
}
