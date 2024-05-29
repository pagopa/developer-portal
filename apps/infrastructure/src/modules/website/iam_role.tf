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
#                Define IAM Role to use on Cognito users                      #
###############################################################################
resource "aws_iam_role" "devportal_authenticated_user" {
  name               = "DevPortalAuthenticatedUser"
  description        = "The role assumed by the authenticated devportal users"
  assume_role_policy = data.aws_iam_policy_document.authenticated_users_policy.json
}

resource "aws_iam_role" "devportal_authenticated_host_user" {
  name               = "DevPortalAuthenticatedHostUser"
  description        = "The role assumed by the authenticated host devportal users"
  assume_role_policy = data.aws_iam_policy_document.authenticated_users_policy.json
}

resource "aws_iam_role_policy" "devportal_authenticated_user" {
  name = "DevPortalAuthenticatedUserPolicy"
  role = aws_iam_role.devportal_authenticated_user.id
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
  role = aws_iam_role.devportal_authenticated_host_user.id
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
      }
    ]
  })
}
