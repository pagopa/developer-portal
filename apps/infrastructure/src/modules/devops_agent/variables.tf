# Variables for AWS DevOps Agent Configuration

variable "aws_region" {
  description = "AWS region for DevOps Agent deployment"
  type        = string
  default     = "eu-central-1"
}

variable "agent_space_name" {
  description = "Name for the DevOps Agent Space"
  type        = string
}

variable "agent_space_description" {
  description = "Description for the DevOps Agent Space"
  type        = string
  default     = "AgentSpace for monitoring my application"
}

variable "service_account_id" {
  description = "Account ID of the secondary (service) account for cross-account monitoring. Leave empty to skip."
  type        = string
  default     = ""
}

variable "agent_space_arn" {
  description = "ARN of the Agent Space from the primary deployment. Required before deploying the service account resources."
  type        = string
  default     = ""
}

variable "name_postfix" {
  description = "Postfix for resource names to ensure uniqueness"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
}
