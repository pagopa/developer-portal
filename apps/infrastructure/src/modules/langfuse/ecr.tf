# resource "aws_ecr_repository" "langfuse_web" {
#   name                 = "langfuse-web"
#   image_tag_mutability = "MUTABLE"
#   force_delete         = var.force_delete
#
#   image_scanning_configuration {
#     scan_on_push = true
#   }
#   tags = {
#     Name = "langfuse_web"
#   }
# }
#
# resource "aws_ecr_lifecycle_policy" "image_count_cleanup_langfuse_web" {
#   repository = aws_ecr_repository.langfuse_web.name
#
#   policy = jsonencode({
#     rules = [
#       {
#         rulePriority = 1
#         description  = "Retain the 5 most recent images and delete the others"
#         selection = {
#           tagStatus   = "any"
#           countType   = "imageCountMoreThan"
#           countNumber = 5
#         }
#         action = {
#           type = "expire"
#         }
#       }
#     ]
#   })
# }
#
# resource "aws_ecr_repository" "langfuse_worker" {
#   name                 = "langfuse-worker"
#   image_tag_mutability = "MUTABLE"
#   force_delete         = var.force_delete
#
#   image_scanning_configuration {
#     scan_on_push = true
#   }
#   tags = {
#     Name = "langfuse_worker"
#   }
# }
#
# resource "aws_ecr_lifecycle_policy" "image_count_cleanup_langfuse_worker" {
#   repository = aws_ecr_repository.langfuse_worker.name
#
#   policy = jsonencode({
#     rules = [
#       {
#         rulePriority = 1
#         description  = "Retain the 5 most recent images and delete the others"
#         selection = {
#           tagStatus   = "any"
#           countType   = "imageCountMoreThan"
#           countNumber = 5
#         }
#         action = {
#           type = "expire"
#         }
#       }
#     ]
#   })
# }

resource "aws_ecr_repository" "clickhouse" {
  name                 = "clickhouse"
  image_tag_mutability = "MUTABLE"
  force_delete         = var.force_delete

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = merge(
    {
      Module      = var.module,
      Environment = var.environment,
      Name        = "Clickhouse"
    }
  )
}

resource "aws_ecr_lifecycle_policy" "image_count_cleanup_clickhouse" {
  repository = aws_ecr_repository.clickhouse.name

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

# resource "aws_ecr_repository" "grafana" {
#   name                 = "grafana"
#   image_tag_mutability = "MUTABLE"
#   force_delete         = var.force_delete
#
#   image_scanning_configuration {
#     scan_on_push = true
#   }
#
#   tags = {
#     Name = "grafana"
#   }
# }
#
# resource "aws_ecr_lifecycle_policy" "image_count_cleanup_grafana" {
#   repository = aws_ecr_repository.grafana.name
#
#   policy = jsonencode({
#     rules = [
#       {
#         rulePriority = 1
#         description  = "Retain the 5 most recent images and delete the others"
#         selection = {
#           tagStatus   = "any"
#           countType   = "imageCountMoreThan"
#           countNumber = 5
#         }
#         action = {
#           type = "expire"
#         }
#       }
#     ]
#   })
# }
