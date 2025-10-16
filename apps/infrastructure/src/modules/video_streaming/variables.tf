variable "aws_region" {
  description = "The AWS region to deploy resources in."
  type        = string
  default     = "eu-central-1"
}

variable "project_name" {
  description = "A name for the project to prefix resources."
  type        = string
}

variable "ivs_channels" {
  description = "A map of IVS channels to create. The key will be used for resource identification."
  type = map(object({
    name         = string
    latency_mode = optional(string, "LOW")
    type         = optional(string, "STANDARD")
  }))
  default = {}
}