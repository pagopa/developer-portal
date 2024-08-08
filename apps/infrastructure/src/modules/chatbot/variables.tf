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

variable "chatbot_lambda_image_container_url" {
  type        = string
  description = "Chatbot Lambda image container URL"
}

variable "CHB_AWS_S3_BUCKET" {
  type        = string
}

variable "CHB_AWS_GUARDRAIL_ID" {
  type        = string
}

variable "CHB_AWS_GUARDRAIL_VERSION" {
  type        = string
  default = "DRAFT"
}
