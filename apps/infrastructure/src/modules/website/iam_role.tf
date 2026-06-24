###############################################################################
#                Define IAM Role to use on website deploy                     #
###############################################################################
resource "aws_iam_role" "deploy_website" {
  name               = "GitHubActionDeployWebsite"
  description        = "Role to assume to deploy the website"
  assume_role_policy = data.aws_iam_policy_document.deploy_github.json
}

resource "aws_iam_role_policy_attachment" "deploy_website" {
  role       = aws_iam_role.deploy_website.name
  policy_arn = aws_iam_policy.deploy_website.arn
}

###############################################################################
#     DynamoDB policies for Cognito authenticated users (roles from auth)     #
###############################################################################
resource "aws_iam_role_policy" "devportal_authenticated_user" {
  name = "DevPortalAuthenticatedUserPolicy"
  role = var.cognito_authenticated_user_role_id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:PutItem",
        ],
        Resource = [
          "${module.dynamodb_webinar_questions.dynamodb_table_arn}",
          "${module.dynamodb_webinar_subscriptions.dynamodb_table_arn}",
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "dynamodb:Query",
          "dynamodb:DeleteItem",
        ],
        Resource = [
          "${module.dynamodb_webinar_subscriptions.dynamodb_table_arn}",
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy" "devportal_authenticated_host_user" {
  name = "DevPortalAuthenticatedHostUserPolicy"
  role = var.cognito_authenticated_host_user_role_id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:PutItem",
          "dynamodb:Query",
          "dynamodb:UpdateItem",
        ],
        Resource = [
          "${module.dynamodb_webinar_questions.dynamodb_table_arn}",
        ]
      },
      {
        Action = [
          "dynamodb:PutItem",
          "dynamodb:Query",
          "dynamodb:DeleteItem"
        ],
        Effect = "Allow",
        Resource = [
          "${module.dynamodb_webinar_subscriptions.dynamodb_table_arn}",
        ]
      }
    ]
  })
}
