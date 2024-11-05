
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


###############################################################################
#                 IAM Role used by Bedrock Logging Config                     #
###############################################################################
module "iam_policy_bedrock_logging" {
  count  = var.environment == "dev" ? 1 : 0
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-policy?ref=f37809108f86d8fbdf17f735df734bf4abe69315" # v5.34.0

  name   = "BedrockLoggingPermissions"
  path   = "/"
  policy = data.aws_iam_policy_document.bedrock_logging[0].json
}

module "iam_role_bedrock_logging" {
  count  = var.environment == "dev" ? 1 : 0
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-assumable-role?ref=f37809108f86d8fbdf17f735df734bf4abe69315" # v5.34.0

  create_role = true
  role_name   = "${local.prefix}-bedrock-logging-role"

  custom_role_policy_arns = [
    module.iam_policy_bedrock_logging[0].arn
  ]
  number_of_custom_role_policy_arns = 1
  trusted_role_services = [
    "bedrock.amazonaws.com"
  ]
  role_requires_mfa = false
}

###############################################################################
#                Define IAM Role to use on chatbot deploy                     #
###############################################################################
resource "aws_iam_role" "deploy_chatbot" {
  name               = "GitHubActionDeployChatbot"
  description        = "Role to assume to deploy the chatbot"
  assume_role_policy = data.aws_iam_policy_document.deploy_github.json
}

resource "aws_iam_role_policy_attachment" "deploy_chatbot" {
  role       = aws_iam_role.deploy_chatbot.name
  policy_arn = aws_iam_policy.deploy_chatbot.arn
}
