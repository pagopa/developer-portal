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
    CreatedBy = "Terraform"
  }
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

variable "dns_chatbot_domain_prefix" {
  type        = string
  description = "DNS chatbot domain prefix"
  default     = "chatbot"
}

variable "create_chatbot" {
  type        = bool
  description = "Defines if chatbot should be created"
  default     = false
}