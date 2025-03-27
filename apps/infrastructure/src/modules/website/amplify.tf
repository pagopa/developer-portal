
module "amplify" {
  for_each = local.is_standalone
  source   = "github.com/pagopa/dx//infra/modules/aws_web_app?ref=static-websites-module" # to substitute with registry path when released

  environment = var.environment_information
  repository = {
    organization = split("/", var.github_repository)[0]
    name         = split("/", var.github_repository)[1]
    branch_name  = "poc-standalone"
  }

  github_authorization_type = "AWS"
  is_ssr                    = true

  build_information = {
    app_path         = "apps/nextjs-website"
    build_path       = "apps/nextjs-website/.next"
    install_commands = ["npm install"]
    build_commands   = ["npm run compile", "env >> apps/nextjs-website/.env", "npm run build -w nextjs-website"]
  }

  custom_domain = {
    zone_name   = var.dns_domain_name
    zone_id     = var.hosted_zone_id
    sub_domains = ["", "www"]
  }

  environment_variables = {
    ENVIRONMENT                                 = var.environment
    FETCH_FROM_STRAPI                           = "true"
    NEXT_PUBLIC_CHATBOT_ACTIVE                  = var.create_chatbot ? "true" : "false"
    NEXT_PUBLIC_CHATBOT_HOST                    = var.create_chatbot ? "https://api.chatbot.${var.dns_domain_name}" : ""
    NEXT_PUBLIC_CHAT_MAX_HISTORY_MESSAGES       = "5"
    NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID        = aws_cognito_identity_pool.devportal.id
    NEXT_PUBLIC_COGNITO_REGION                  = var.aws_region
    NEXT_PUBLIC_COGNITO_USER_POOL_ID            = aws_cognito_user_pool.devportal.id
    NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID = aws_cognito_user_pool_client.devportal_website.id
    NEXT_PUBLIC_ENVIRONMENT                     = var.environment
    NEXT_PUBLIC_ORGANIZATION_SOCIAL_LINKS       = "https://x.com/PagoPA,https://www.instagram.com/pagopaspa/,https://www.linkedin.com/company/pagopa/,https://medium.com/pagopa-spa"
    NEXT_PUBLIC_WEBSITE_NAME                    = "DevPortal"
    NEXT_TELEMETRY_DISABLED                     = "1"
    PATH_TO_GITBOOK_DOCS                        = "docs"
    S3_PATH_TO_GITBOOK_DOCS                     = "docs"
    S3_PATH_TO_GITBOOK_DOCS_ASSETS              = "${aws_s3_bucket.website_standalone.bucket_regional_domain_name}/docs/"
    STRAPI_ENDPOINT                             = "https://cms.${var.dns_domain_name}"
    "_LIVE_UPDATES"                             = jsonencode([{ name = "Next.js version", pkg = "next-version", type = "internal", version = var.nextjs_version }])
  }

  secrets = [
    {
      name = "COOKIE_DOMAIN_SCRIPT"
    },
    {
      name = "STRAPI_API_TOKEN"
    }
  ]

  tags = var.tags
}

resource "aws_iam_policy" "docs" {
  for_each    = local.is_standalone
  name        = "GetDocs"
  description = "Policy to allow the website to get the static documentation"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:*Object"
        ]
        Effect = "Allow"
        Resource = [
          "${aws_s3_bucket.website.arn}/*",
          "${aws_s3_bucket.website_standalone.arn}/*"
        ]
      },
      {
        Action = [
          "s3:ListBucket"
        ]
        Effect = "Allow"
        Resource = [
          aws_s3_bucket.website.arn,
          aws_s3_bucket.website_standalone.arn
        ]
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "docs" {
  for_each   = local.is_standalone
  name       = "GetDocs"
  roles      = [module.amplify["standalone"].iam_role.name]
  policy_arn = aws_iam_policy.docs["standalone"].arn
}