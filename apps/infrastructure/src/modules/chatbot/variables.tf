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
    CreatedBy      = "Terraform",
    Wbs            = "BD110 - PORTALS E TOOLS"
    CostCenter     = "BD110 - PORTALS E TOOLS"
    Owner          = "CloudGaaP-AI"
    ManagementTeam = "team_cloudgaap_ai"
  }
}

variable "module" {
  type        = string
  description = "Prefix for resources"
  default     = "chatbot"
}

variable "aws_chatbot_region" {
  type        = string
  description = "AWS region to create AI chatbot's resources"
}

variable "website_bucket_name" {
  type        = string
  description = "The name of the website bucket"
}

variable "dns_chatbot_hosted_zone" {
  type = object({
    name = string
    id   = string
  })
  description = "The name of the chatbot hosted zone"
}

variable "cognito_user_pool" {
  type = object({
    id        = string
    arn       = string
    domain    = string
    region    = string
    client_id = string
    endpoint  = string
  })
  sensitive   = true
  description = "The cognito user pool used to authenticate api calls"
}

variable "vpc" {
  type = object({
    id                  = string
    public_subnets      = list(string)
    database_subnets    = list(string)
    private_subnets     = list(string)
    elasticache_subnets = list(string)
  })

  description = "The VPC used to deploy the resources"
}

################################################################################
# ElastiCache - Redis
################################################################################

variable "chatbot_redis" {
  type = object({
    cluster_creating                 = optional(bool, true)
    cluster_size                     = optional(number, 1)
    instance_type                    = string
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
}
