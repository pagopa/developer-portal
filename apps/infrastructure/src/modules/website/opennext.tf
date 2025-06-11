/*
  environment_variables = {
    
  }

*/



resource "aws_acm_certificate" "opennext" {

  provider = aws.us-east-1

  domain_name = "*.${local.opennext_domain}"
  subject_alternative_names = [
    local.opennext_domain
  ]
  validation_method = "DNS"
  tags              = var.tags

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "opennext" {
  for_each = {
    for dvo in aws_acm_certificate.opennext.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 3600 # 1 hour
  type            = each.value.type
  zone_id         = var.hosted_zone_id
}


data "aws_ssm_parameter" "cookie_domain_script" {
  name = "COOKIE_DOMAIN_SCRIPT"
}

data "aws_ssm_parameter" "strapi_api_token" {
  name = "STRAPI_API_TOKEN"
}


module "opennext" {
  source = "github.com/pagopa/dx//infra/modules/aws_open_next?ref=opennext-module"

  custom_domain = {
    domain_name         = local.opennext_domain
    acm_certificate_arn = aws_acm_certificate.opennext.arn
    hosted_zone_id      = var.hosted_zone_id
  }

  are_previews_enabled = true
  environment          = var.environment_information

  server = {
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
      NEXT_PUBLIC_FEEDBACK_FORM_ENABLED           = var.environment == "dev" ? "true" : "false"
      NEXT_TELEMETRY_DISABLED                     = "1"
      PATH_TO_GITBOOK_DOCS                        = "docs"
      S3_PATH_TO_GITBOOK_DOCS                     = "docs"
      S3_PATH_TO_GITBOOK_DOCS_ASSETS              = format("https://static-contents.%s/docs", var.dns_domain_name)
      STRAPI_ENDPOINT                             = "https://cms.${var.dns_domain_name}"
      COOKIE_DOMAIN_SCRIPT                        = data.aws_ssm_parameter.cookie_domain_script.value
      STRAPI_API_TOKEN                            = data.aws_ssm_parameter.strapi_api_token.value
      S3_BUCKET_NAME                              = aws_s3_bucket.website_standalone.bucket
      S3_GUIDE_METADATA_JSON_PATH                 = "guides-metadata.json"
      S3_RELEASE_NOTES_METADATA_JSON_PATH         = "release-notes-metadata.json"
      S3_SOLUTIONS_METADATA_JSON_PATH             = "solutions-metadata.json"
      STATIC_CONTENTS_URL                         = format("https://static-contents.%s", var.dns_domain_name)
    }
  }

  enable_alarms = true
  alarms_actions = [aws_sns_topic.metric_alarm.arn]


  tags = var.tags

}


resource "aws_iam_policy" "docs" {
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
  name       = "GetDocs"
  roles      = [module.opennext.server.iam_role.name]
  policy_arn = aws_iam_policy.docs.arn
}
