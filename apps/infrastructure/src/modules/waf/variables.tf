variable "alerting" {
  description = "Optional SNS destination and per-minute CountedRequests alarm thresholds for a regional web ACL"
  type = object({
    topic_arn                  = string
    ip_rate_limit_threshold    = optional(number, 100)
    known_bad_inputs_threshold = optional(number, 25)
  })
  default = null
}

variable "environment" {
  description = "Environment used to name the web ACL"
  type        = string
}

variable "scope" {
  description = "WAF scope: REGIONAL for regional resources or CLOUDFRONT for CloudFront distributions"
  type        = string
  default     = "REGIONAL"

  validation {
    condition     = contains(["REGIONAL", "CLOUDFRONT"], var.scope)
    error_message = "The WAF scope must be REGIONAL or CLOUDFRONT."
  }
}

variable "associated_resource_arns" {
  description = "Map of stable resource keys to regional resource ARNs; CloudFront associations are configured on the distribution"
  type        = map(string)
  default     = {}

  validation {
    condition     = var.scope == "REGIONAL" || length(var.associated_resource_arns) == 0
    error_message = "Associated resource ARNs can only be provided for a REGIONAL web ACL."
  }
}

variable "name" {
  description = "Optional name for the web ACL"
  type        = string
  default     = null
}

variable "metric_name_prefix" {
  description = "Optional prefix for WAF CloudWatch metric names"
  type        = string
  default     = null
}

variable "rate_limit" {
  description = "Requests per IP during the rate-based rule's 60-second evaluation window"
  type        = number
  default     = 100

  validation {
    condition     = var.rate_limit >= 10 && floor(var.rate_limit) == var.rate_limit
    error_message = "The rate limit must be an integer of at least 10 requests."
  }
}

variable "tags" {
  description = "Tags applied to the web ACL"
  type        = map(string)
  default     = {}
}
