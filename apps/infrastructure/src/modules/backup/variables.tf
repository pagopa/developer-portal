variable "environment" {
  description = "Deployment environment used to name backup resources."
  type        = string

  validation {
    condition     = contains(["dev", "uat", "prod"], var.environment)
    error_message = "Environment must be dev, uat, or prod."
  }
}
