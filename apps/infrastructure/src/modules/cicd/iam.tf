resource "aws_iam_policy" "deploy_website" {
  name        = "${local.prefix}-deploy-website"
  description = "Policy to allow to deploy the website"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = concat([
      {
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:PutObjectAcl",
          "s3:DeleteObject"
        ]
        Effect = "Allow"
        Resource = [
          format("%s/*", var.website_bucket.arn)
        ]
      },
      {
        Action = [
          "s3:ListBucket"
        ]
        Effect = "Allow"
        Resource = [
          var.website_bucket.arn
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
          "bedrock:ApplyGuardrail",
          "bedrock:ListGuardrails",
          "bedrock:GetGuardrail",
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream",
          "bedrock:ListFoundationModels",
          "bedrock:Rerank"
        ]
        Resource = ["*"]
      },
      {
        Effect = "Allow"
        Action = [
          "lambda:*"
        ]
        Resource = ["arn:aws:lambda:${var.aws_region}:${data.aws_caller_identity.current.account_id}:function:*chatbot*"]
      }
      ], var.website_is_standalone ? [] : [{
        Action = [
          "cloudfront:CreateInvalidation"
        ]
        Effect = "Allow"
        Resource = [
          var.website_cdn.arn
        ]
    }])
  })
}

resource "aws_iam_role_policy_attachment" "deploy_website" {
  role       = module.codebuild.iam_role.name
  policy_arn = aws_iam_policy.deploy_website.arn
}