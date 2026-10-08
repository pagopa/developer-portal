variable "agent_space_description" {
  description = "Description of the DevOps Agent Space."
  type        = string
}

variable "agent_space_name" {
  description = "Name of the DevOps Agent Space."
  type        = string
}

variable "name_postfix" {
  description = "Stable suffix for both IAM role names. Preserve the existing suffix when importing."
  type        = string

  validation {
    condition     = can(regex("^[A-Za-z0-9_+=,.@-]{1,35}$", var.name_postfix))
    error_message = "The suffix must contain 1-35 IAM role name characters."
  }
}

variable "tags" {
  description = "Cost-allocation and ownership tags for the agent space and IAM roles."
  type        = map(string)
}
