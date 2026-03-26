locals {
  ecr_repositories = {
    langfuse-web = {
      display_name = "Langfuse Web"
    }
    langfuse-worker = {
      display_name = "Langfuse Worker"
    }
    clickhouse = {
      display_name = "Clickhouse"
    }
  }
}

resource "aws_ecr_repository" "repositories" {
  for_each = local.ecr_repositories

  name                 = each.key
  image_tag_mutability = "MUTABLE"
  force_delete         = var.force_delete

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = merge(
    {
      Module      = var.module,
      Environment = var.environment,
      Name        = each.value.display_name
    }
  )
}

resource "aws_ecr_lifecycle_policy" "image_count_cleanup" {
  for_each = local.ecr_repositories

  repository = aws_ecr_repository.repositories[each.key].name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Retain the 5 most recent images and delete the others"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 5
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

