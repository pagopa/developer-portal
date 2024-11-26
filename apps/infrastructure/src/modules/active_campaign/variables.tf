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
  default     = "ac"
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

variable "webinar_subscriptions_ddb_stream_arn" {
  type = string
  description = "The ARN of the webinar subscriptions ddb stream"
}