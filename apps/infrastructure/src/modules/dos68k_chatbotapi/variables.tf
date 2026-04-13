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
