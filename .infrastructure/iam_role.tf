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
#                Define IAM Role to use on strapi deploy                      #
###############################################################################
resource "aws_iam_role" "deploy_cms" {
  name               = "GitHubActionDeployCms"
  description        = "Role to assume to deploy the cms"
  assume_role_policy = data.aws_iam_policy_document.deploy_github.json
}

resource "aws_iam_role_policy_attachment" "deploy_cms" {
  role       = aws_iam_role.deploy_cms.name
  policy_arn = aws_iam_policy.deploy_cms.arn
}

module "iam_role_ecs_task_execution" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-assumable-role?ref=f37809108f86d8fbdf17f735df734bf4abe69315" # v5.34.0

  create_role = true
  role_name   = "ecs-task-execution-role"

  custom_role_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
    module.iam_policy_ecs_task_execution.arn,
  ]
  number_of_custom_role_policy_arns = 3
  trusted_role_services = [
    "ecs-tasks.amazonaws.com"
  ]
  role_requires_mfa = false
}

module "iam_role_task_role" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-assumable-role?ref=f37809108f86d8fbdf17f735df734bf4abe69315" # v5.34.0

  create_role = true
  role_name   = "ecs-task-role"

  custom_role_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role",
    module.iam_policy_ecs_task_role_s3.arn,
  ]
  number_of_custom_role_policy_arns = 2
  trusted_role_services = [
    "ecs-tasks.amazonaws.com"
  ]
  role_requires_mfa = false
}

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
