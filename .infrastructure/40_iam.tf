data "aws_caller_identity" "current" {}

###############################################################################
#                      Define IAM Role to use on deploy                       #
###############################################################################
resource "aws_iam_role" "deploy_website" {
  name        = "GitHubActionDeployToS3"
  description = "Role to assume to deploy the website to S3"


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

resource "aws_iam_policy" "publish_to_s3" {
  name        = "PublishWebsite"
  description = "Policy to allow to publish the website to S3"

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
  policy_arn = aws_iam_policy.publish_to_s3.arn
}
