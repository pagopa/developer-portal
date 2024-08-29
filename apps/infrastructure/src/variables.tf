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

variable "chatbot_opensearch" {
  type = object({
    instance_count           = optional(number, 1)
    dedicated_master_instance_type = optional(string, null)
    node_instance_type = optional(string, "t3.small.search")
    engine_version = optional(string, "OpenSearch_2.13")
    ebs_options = optional(object({
      ebs_enabled = optional(bool, true)
      iops        = optional(number, 3000)
      throughput  = optional(number, 125)
      volume_type = optional(string, "gp3")
      volume_size = optional(number, 30)
    }), {
      ebs_enabled = true
      iops        = 3000
      throughput  = 125
      volume_type = "gp3"
      volume_size = 30
    })
  })
  description = "OpenSearch configuration for the AI chatbot"
}