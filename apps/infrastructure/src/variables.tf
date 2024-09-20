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

################################################################################
# ECS - Chatbot Redis
################################################################################

variable "chatbot_ecs_redis" {
  type = object({
    cpu       = optional(number, 2048)
    memory    = optional(number, 4096)
    image_uri = optional(string, "redis/redis-stack-server@sha256:887cf87cc744e4588ccade336d0dbb943e4e46330f738653ccb3a7a55df2f186")
    port      = optional(number, 6379)
  })
  description = "Redis configuration for the AI chatbot"

  default = {
    cpu       = 2048
    memory    = 4096
    image_uri = "redis/redis-stack-server@sha256:887cf87cc744e4588ccade336d0dbb943e4e46330f738653ccb3a7a55df2f186"
    port      = 6379
  }
}

variable "CHB_QUERY_TABLE_PREFIX" {
  type        = string
  description = "dynamodb table name prefix"
  default     = "chatbot-dev"
}
