variable "artifact_bucket_name" {
  description = "Name of the S3 bucket containing canary run artifacts."
  type        = string
}

variable "artifact_prefix" {
  description = "S3 key prefix for this canary's run artifacts."
  type        = string
}

variable "execution_policy_name" {
  description = "Name of the canary's IAM execution policy."
  type        = string
}

variable "execution_role_name" {
  description = "Name of the canary's IAM execution role."
  type        = string
}

variable "log_group_names" {
  description = "Existing Lambda log group names, keyed by browser."
  type        = map(string)
}

variable "memory_in_mb" {
  description = "Memory allocated to each canary run."
  type        = number
  default     = 1500
}

variable "name" {
  description = "Name of the Synthetics canary."
  type        = string
}

variable "runtime_version" {
  description = "Synthetics Puppeteer runtime version."
  type        = string
  default     = "syn-nodejs-puppeteer-18.0"
}

variable "schedule_expression" {
  description = "Rate or cron expression controlling canary runs."
  type        = string
  default     = "rate(10 minutes)"
}

variable "tags" {
  description = "Cost allocation and ownership tags."
  type        = map(string)
}

variable "timeout_in_seconds" {
  description = "Maximum duration of each canary run."
  type        = number
  default     = 600
}

variable "urls" {
  description = "Ordered list of URLs checked by the heartbeat."
  type        = list(string)

  validation {
    condition     = length(var.urls) > 0 && alltrue([for url in var.urls : can(regex("^https?://[^/\\s]+", url))])
    error_message = "Provide at least one absolute HTTP or HTTPS URL."
  }
}
