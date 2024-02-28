###############################################################################
#                Define IAM Role to use on website deploy                     #
###############################################################################
resource "aws_iam_role" "deploy_website" {
  name               = "GitHubActionDeployWebsite"
  description        = "Role to assume to deploy the website"
  assume_role_policy = data.aws_iam_policy_document.deploy_github.json
}

###############################################################################
#                Define IAM Role to use on strapi deploy                      #
###############################################################################
resource "aws_iam_role" "deploy_cms" {
  name               = "GitHubActionDeployCms"
  description        = "Role to assume to deploy the cms"
  assume_role_policy = data.aws_iam_policy_document.deploy_github.json
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
