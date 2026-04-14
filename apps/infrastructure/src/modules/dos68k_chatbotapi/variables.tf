variable "environment" {
  type        = string
  description = "Environment (dev, uat, prod)"
}

variable "aws_region" {
  type        = string
  description = "AWS region to create resources"
  default     = "eu-south-1"
}

variable "tags" {
  type = map(any)
  default = {
    CreatedBy = "Terraform"
  }
}

variable "vpc" {
  type = object({
    id              = string
    private_subnets = list(string)
  })
  description = "The VPC used to deploy the resources"
}

variable "security_groups" {
  type        = map(string)
  description = "The security groups used to deploy the resources"
}

variable "dns_domain_name" {
  description = "DNS domain for the Developer Portal product"
  type        = string
}

variable "ecs_chatbotapi" {
  type = object({
    cpu       = optional(number, 1024)
    memory    = optional(number, 2048)
    image_tag = optional(string, "latest")
  })
  description = "ECS task configuration for the chatbot API"

  default = {
    cpu       = 1024
    memory    = 2048
    image_tag = "latest"
  }
}

variable "redis_host" {
  type        = string
  description = "The Redis host (NLB DNS name from the chatbot module)"
}

variable "redis_nlb_security_group_id" {
  type        = string
  description = "Security group ID of the Redis NLB to add ingress rule for this module's ECS tasks"
}

variable "redis_port" {
  type        = number
  description = "The Redis port"
  default     = 6379
}

variable "enable_scheduled_scaling" {
  type        = bool
  description = "Enable scheduled autoscaling to scale down to 0 outside working hours (Mon-Fri 09:00-19:00 CET)"
  default     = false
}
