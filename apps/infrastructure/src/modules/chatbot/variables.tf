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
    client_id = string
    arn       = string
    domain    = string
  })
  description = "The cognito user pool used to authenticate api calls"
}
