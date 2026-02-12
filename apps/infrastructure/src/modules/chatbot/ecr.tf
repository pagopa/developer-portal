locals {
  ecr_repos = {
    chatbot = {
      repository_name = "chatbot"
    }
    evaluate = {
      repository_name = "evaluate"
    }
    monitor = {
      repository_name = "chatbot-monitor"
    }
    chatbotindex = {
      repository_name = "chatbot-index"
    }
  }
}

module "ecr" {
  source   = "git::https://github.com/terraform-aws-modules/terraform-aws-ecr.git?ref=9f4b587846551110b0db199ea5599f016570fefe"
  for_each = local.ecr_repos

  repository_name                   = each.value.repository_name
  repository_image_scan_on_push     = "true"
  repository_image_tag_mutability   = "IMMUTABLE"
  repository_read_write_access_arns = []
  attach_repository_policy          = false
  repository_lifecycle_policy = jsonencode({
    rules = [
      {
        rulePriority = 1,
        description  = "Keep last 5 images",
        selection = {
          tagStatus   = "any",
          countType   = "imageCountMoreThan",
          countNumber = 5
        },
        action = {
          type = "expire"
        }
      }
    ]
  })
}
