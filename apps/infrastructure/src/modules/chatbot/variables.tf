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
  default = "chatbot"
}

variable "aws_chatbot_region" {
  type        = string
  description = "AWS region to create AI chatbot's resources"
}

variable "log_retention_days" {
  type        = number
  description = "The number of days logs should be retained. Default is 90 days."
  default     = 90
}

variable "website_bucket_name" {
  type        = string
  description = "The name of the website bucket"
}