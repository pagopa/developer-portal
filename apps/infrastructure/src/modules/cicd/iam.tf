resource "aws_iam_policy" "deploy_website" {
  name        = "${local.prefix}-deploy-website"
  description = "Policy to allow to deploy the website"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = concat([
      {
        Action = [
          "ssm:GetParameter",
          "ssm:PutParameter"
        ]
        Effect   = "Allow"
        Resource = ["arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/chatbot/*"]
      },
      {
        Effect = "Allow"
        Action = [
          "lambda:*"
        ]
        Resource = ["arn:aws:lambda:${var.aws_region}:${data.aws_caller_identity.current.account_id}:function:*chatbot*"]
      }
    ])
  })
}

resource "aws_iam_role_policy_attachment" "deploy_website" {
  role       = module.codebuild.iam_role.name
  policy_arn = aws_iam_policy.deploy_website.arn
}

resource "aws_iam_role" "github_deploy_opennext" {
  name               = "${local.prefix}-deploy-opennext"
  description        = "Role to deploy lambda functions with github actions."
  assume_role_policy = local.assume_role_policy_github
}


# Role to deploy lambda functions with github actions.
resource "aws_iam_policy" "github_deploy_opennext" {
  name        = "${local.prefix}-deploy-lambda"
  description = "Policy to deploy Lambda functions"

  policy = jsonencode({

    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "lambda:CreateFunction",
          "lambda:UpdateFunctionCode",
          "lambda:UpdateFunctionConfiguration",
          "lambda:GetFunctionConfiguration",
          "lambda:PublishVersion",
          "lambda:UpdateAlias"
        ]
        Resource = "arn:aws:lambda:${var.aws_region}:${data.aws_caller_identity.current.account_id}:function:*"
      },
      {
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Effect = "Allow"
        Resource = [
          "${var.assets_opennext_bucket.arn}/*",
          "${var.assets_opennext_bucket.arn}"
        ]
      },
      {
        Action = [
          "s3:PutObject",
          "s3:GetObject"
        ]
        Effect = "Allow"
        Resource = [
          "${var.lambda_code_opennext_bucket.arn}/*",

        ]
      },
      {
        Effect   = "Allow"
        Action   = "lambda:InvokeFunction"
        Resource = "${var.lambda_initializer_arn}"
      },
      {
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation"
        ]
        Resource = "arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:distribution/${var.opennext_cdn_distribution_id}"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "github_deploy_opennext" {
  role       = aws_iam_role.github_deploy_opennext.name
  policy_arn = aws_iam_policy.github_deploy_opennext.arn
}

resource "aws_iam_role" "github_chatbot_reindex" {
  name               = "${local.prefix}-chatbot-reindex"
  description        = "Role to reindex chatbot data."
  assume_role_policy = local.assume_role_policy_github
}

# Role to reindex chatbot data with GitHub actions.
resource "aws_iam_policy" "github_chatbot_reindex" {
  name        = "${local.prefix}-chatbot-reindex"
  description = "Policy to reindex chatbot data"

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
          "${var.assets_opennext_bucket.arn}/*",
          "${var.website_standalone_bucket.arn}/*"
        ]
      },
      {
        Action = [
          "s3:ListBucket"
        ]
        Effect = "Allow"
        Resource = [
          var.assets_opennext_bucket.arn,
          var.website_standalone_bucket.arn
        ]
      },
      {
        Action = [
          "ssm:GetParameter",
          "ssm:PutParameter"
        ]
        Effect   = "Allow"
        Resource = ["arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/chatbot/*"]
      },
      {
        Effect = "Allow"
        Action = [
          "lambda:*"
        ]
        Resource = ["arn:aws:lambda:${var.aws_region}:${data.aws_caller_identity.current.account_id}:function:*chatbot*"]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "github_chatbot_reindex" {
  role       = aws_iam_role.github_chatbot_reindex.name
  policy_arn = aws_iam_policy.github_chatbot_reindex.arn
}