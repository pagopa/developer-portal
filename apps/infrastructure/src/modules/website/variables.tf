variable "aws_region" {
  type        = string
  description = "AWS region to create resources. Default Milan"
  default     = "eu-south-1"
}

variable "environment" {
  type        = string
  description = "Environment"
}

variable "environment_information" {
  type = object({
    prefix          = string
    env_short       = string
    location        = string
    domain          = optional(string)
    app_name        = string
    instance_number = string
  })

  description = "Values which are used to generate resource names and location short names. They are all mandatory except for domain, which should not be used only in the case of a resource used by multiple domains."
}

variable "github_repository" {
  type        = string
  description = "The repository where the IaC workflows will run"
}

variable "tags" {
  type = map(any)
  default = {
    CreatedBy = "Terraform"
  }
}

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

variable "publish_cloudfront_functions" {
  type        = bool
  description = "Defines if cloudfront functions should be published"
  default     = false
}

variable "dns_domain_name" {
  description = "DNS domain for the Developer Portal product"
  type        = string
}

variable "dns_delegate_records" {
  type        = map(any)
  description = "DNS delegate records"
  default     = {}
}

variable "use_custom_certificate" {
  type        = bool
  description = "Enable CDN https support with a custom certificate instead using the default one"
  default     = true
}

variable "log_retention_days" {
  type        = number
  description = "The number of days logs should be retained. Default is 90 days."
  default     = 90
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
  default     = ["pagopa.it", "uqido.com", "aizoongroup.com"]
}

variable "nextjs_version" {
  type        = string
  description = "The version of Next.js to use"
}

variable "website_is_standalone" {
  type        = bool
  description = "If true, the website will be deployed in standalone mode (Amplify), otherwise static deployment is used (S3 + Cloudfront)"
  default     = false
}

variable "create_chatbot" {
  type        = bool
  description = "Defines if chatbot should be created"
  default     = false
}