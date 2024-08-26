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

## CMS Strapi App Port
variable "cms_app_port" {
  description = "The standard app port used by CMS Strapi"
  default     = 1337
}

## CMS Strapi CPU
variable "cms_app_cpu" {
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units)"
  default     = "1024" ##### 1 vCPU
}

## CMS Strapi RAM
variable "cms_app_memory" {
  description = "Fargate instance memory to provision (in MiB)"
  default     = "3072" ##### 3 GB RAM
}

# CMS Strapi DNS
variable "dns_domain_name_cms" {
  description = "DNS domain name of the Developer Portal's CMS"
  type        = map(any)
  default     = null
}

variable "aws_chatbot_region" {
  type        = string
  description = "AWS region to create AI chatbot's resources"
  default     = "eu-west-3"
}

variable "create_chatbot" {
  type        = bool
  description = "Defines if chatbot should be created"
  default     = false
}

variable "chatbot_redis" {
  type = object({
    cluster_creating                 = optional(bool, true)
    cluster_size                     = optional(number, 1)
    instance_type                    = optional(string, "cache.t4g.small")
    engine_version                   = optional(string, "7.0")
    family                           = optional(string, "redis7")
    at_rest_encryption_enabled       = optional(bool, true)
    transit_encryption_enabled       = optional(bool, true)
    automatic_failover               = optional(bool, true)
    multi_az                         = optional(bool, false)
    snapshot_retention_limit         = optional(number, 0)
    snapshot_windows                 = optional(string, "06:30-07:30")
    cloudwatch_metric_alarms_enabled = optional(bool, true)
    auto_minor_version_upgrade       = optional(bool, false)
  })
  description = "Redis configuration for the AI chatbot"

  default = {}
}