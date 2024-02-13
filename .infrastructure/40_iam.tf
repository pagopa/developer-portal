data "aws_caller_identity" "current" {}

###############################################################################
#                      Define IAM Role to use on deploy                       #
###############################################################################
resource "aws_iam_role" "deploy_website" {
  name        = "GitHubActionDeployWebsite"
  description = "Role to assume to deploy the website"


  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          "Federated" : "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
        },
        Action = "sts:AssumeRoleWithWebIdentity",
        Condition = {
          StringLike = {
            "token.actions.githubusercontent.com:sub" : "repo:${var.github_repository}:*"
          },
          "ForAllValues:StringEquals" = {
            "token.actions.githubusercontent.com:iss" : "https://token.actions.githubusercontent.com",
            "token.actions.githubusercontent.com:aud" : "sts.amazonaws.com"
          }
        }
      }
    ]
  })
}

resource "aws_iam_policy" "deploy_website" {
  name        = "DeployWebsite"
  description = "Policy to allow to deploy the website"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:PutObjectAcl",
          "s3:DeleteObject"
        ]
        Effect = "Allow"
        Resource = [
          format("%s/*", aws_s3_bucket.website.arn)
        ]
      },
      {
        Action = [
          "s3:ListBucket"
        ]
        Effect = "Allow"
        Resource = [
          aws_s3_bucket.website.arn
        ]
      },
      {
        Action = [
          "cloudfront:CreateInvalidation"
        ]
        Effect = "Allow"
        Resource = [
          aws_cloudfront_distribution.website.arn
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "deploy_website" {
  role       = aws_iam_role.deploy_website.name
  policy_arn = aws_iam_policy.deploy_website.arn
}

## IAM Role  GitHub for deploy CMS Strapi
data "aws_caller_identity" "current" {}

data "aws_iam_policy_document" "deploy_github" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_repository}:*"]
    }

    condition {
      test     = "ForAllValues:StringEquals"
      variable = "token.actions.githubusercontent.com:iss"
      values   = ["https://token.actions.githubusercontent.com"]
    }

    condition {
      test     = "ForAllValues:StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "deploy_ecs" {
  name               = "GitHubActionDeployECS"
  description        = "Role to assume to deploy on ECS."
  assume_role_policy = data.aws_iam_policy_document.deploy_github.json
}

resource "aws_iam_policy" "deploy_ecs" {
  name        = "DeployECS"
  description = "Policy to allow deploy on ECS."

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ecs:DescribeTaskDefinition",
          "ecs:RegisterTaskDefinition",
          "ecs:DescribeServices",
          "ecs:UpdateService",
          "ecr:GetAuthorizationToken",
          "ecr:CompleteLayerUpload",
          "ecr:GetAuthorizationToken",
          "ecr:UploadLayerPart",
          "ecr:InitiateLayerUpload",
          "ecr:BatchCheckLayerAvailability",
          "ecr:PutImage",
          "ecr:BatchGetImage"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action = [
          "iam:PassRole"
        ]
        Effect = "Allow"
        Resource = [
          module.iam_role_ecs_task_execution.iam_role_arn,
          module.iam_role_task_role.iam_role_arn
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "deploy_ecs" {
  role       = aws_iam_role.deploy_ecs.name
  policy_arn = aws_iam_policy.deploy_ecs.arn
}