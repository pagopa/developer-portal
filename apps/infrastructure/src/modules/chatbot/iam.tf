
###############################################################################
#                  IAM Role used by task execution agent                      #
###############################################################################
module "iam_role_ecs_task_execution" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-assumable-role?ref=f37809108f86d8fbdf17f735df734bf4abe69315" # v5.34.0

  create_role = true
  role_name   = "${local.prefix}-ecs-task-execution-role"

  custom_role_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  ]
  number_of_custom_role_policy_arns = 2
  trusted_role_services = [
    "ecs-tasks.amazonaws.com"
  ]
  role_requires_mfa = false
}

###############################################################################
#                         IAM Role used by Redis ECS                          #
###############################################################################
module "ecs_redis_task_iam_role" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-assumable-role?ref=f37809108f86d8fbdf17f735df734bf4abe69315" # v5.34.0

  create_role = true
  role_name   = "${local.prefix}-redis-ecs-task-role"

  custom_role_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role",
    module.iam_policy_ecs_task_role_ssm.arn
  ]
  number_of_custom_role_policy_arns = 2
  trusted_role_services = [
    "ecs-tasks.amazonaws.com"
  ]
  role_requires_mfa = false
}

module "iam_policy_ecs_task_role_ssm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-policy?ref=f37809108f86d8fbdf17f735df734bf4abe69315" # v5.34.0

  name   = "ECSTaskRolePoliciesSSM"
  path   = "/"
  policy = data.aws_iam_policy_document.ecs_task_role_ssm.json
}

###############################################################################
#                        IAM Role used by API Gateway                         #
###############################################################################

resource "aws_iam_role" "cloudwatch" {
  name               = "api_gateway_cloudwatch_global"
  assume_role_policy = data.aws_iam_policy_document.apigateway_assume_role.json
}

resource "aws_iam_role_policy" "cloudwatch" {
  name   = "default"
  role   = aws_iam_role.cloudwatch.id
  policy = data.aws_iam_policy_document.apigateway_cloudwatch.json
}