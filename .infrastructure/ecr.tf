## ECR Container Registry for CMS Strapi
module "ecr" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ecr.git?ref=9f4b587846551110b0db199ea5599f016570fefe" # v1.6.0

  repository_name                 = "strapi"
  repository_image_scan_on_push   = "true"
  repository_image_tag_mutability = "IMMUTABLE"
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