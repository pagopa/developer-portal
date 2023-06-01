variable "github_repository" {
  type        = string
  description = "The repository where the IaC workflows will run"
  # e.g. username/repository
}

variable "tags" {
  type = map(any)
  default = {
    CreatedBy = "Terraform"
  }
}
