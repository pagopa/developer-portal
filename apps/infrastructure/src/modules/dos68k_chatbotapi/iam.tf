data "aws_caller_identity" "current" {}

###############################################################################
#                  IAM Role used by task execution agent                      #
###############################################################################
module "iam_role_ecs_task_execution" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-assumable-role?ref=f37809108f86d8fbdf17f735df734bf4abe69315" # v5.34.0

  create_role = true
  role_name   = "${local.prefix}-chatbotapi-ecs-task-execution-role"

  custom_role_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
    module.iam_policy_ecs_task_execution_ssm.arn
  ]
  number_of_custom_role_policy_arns = 3
  trusted_role_services = [
    "ecs-tasks.amazonaws.com"
  ]
  role_requires_mfa = false
}

module "iam_policy_ecs_task_execution_ssm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-policy?ref=f37809108f86d8fbdf17f735df734bf4abe69315" # v5.34.0

  name   = "${local.prefix}-chatbotapi-ecs-exec-ssm"
  path   = "/"
  policy = data.aws_iam_policy_document.ecs_task_execution_ssm.json
}

data "aws_iam_policy_document" "ecs_task_execution_ssm" {
  statement {
    effect = "Allow"
    actions = [
      "ssm:GetParameters",
      "ssm:GetParameter"
    ]
    resources = [
      "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/dos68k-chatbotapi/*"
    ]
  }
}

###############################################################################
#                  IAM Role used by the ECS task                              #
###############################################################################
module "iam_role_ecs_task" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-assumable-role?ref=f37809108f86d8fbdf17f735df734bf4abe69315" # v5.34.0

  create_role = true
  role_name   = "${local.prefix}-chatbotapi-ecs-task-role"

  custom_role_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role",
    module.iam_policy_ecs_task_ssm.arn,
    module.iam_policy_ecs_task_dynamodb.arn
  ]
  number_of_custom_role_policy_arns = 3
  trusted_role_services = [
    "ecs-tasks.amazonaws.com"
  ]
  role_requires_mfa = false
}

module "iam_policy_ecs_task_ssm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-policy?ref=f37809108f86d8fbdf17f735df734bf4abe69315" # v5.34.0

  name   = "${local.prefix}-chatbotapi-ecs-task-ssm"
  path   = "/"
  policy = data.aws_iam_policy_document.ecs_task_ssm.json
}

data "aws_iam_policy_document" "ecs_task_ssm" {
  statement {
    effect = "Allow"
    actions = [
      "ssmmessages:CreateControlChannel",
      "ssmmessages:CreateDataChannel",
      "ssmmessages:OpenControlChannel",
      "ssmmessages:OpenDataChannel"
    ]
    resources = ["*"]
  }
}

module "iam_policy_ecs_task_dynamodb" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-policy?ref=f37809108f86d8fbdf17f735df734bf4abe69315" # v5.34.0

  name   = "${local.prefix}-chatbotapi-ecs-task-dynamodb"
  path   = "/"
  policy = data.aws_iam_policy_document.ecs_task_dynamodb.json
}

data "aws_iam_policy_document" "ecs_task_dynamodb" {
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:Query",
    ]
    resources = [
      aws_dynamodb_table.sessions.arn,
      aws_dynamodb_table.queries.arn
    ]
  }
}

###############################################################################
#                        IAM Role used by API Gateway                         #
###############################################################################
data "aws_iam_policy_document" "apigateway_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["apigateway.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "apigateway_cloudwatch" {
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:DescribeLogGroups",
      "logs:DescribeLogStreams",
      "logs:PutLogEvents",
      "logs:GetLogEvents",
      "logs:FilterLogEvents"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role" "apigateway_cloudwatch" {
  name               = "${local.prefix}-chatbotapi-apigw-cw-role"
  assume_role_policy = data.aws_iam_policy_document.apigateway_assume_role.json
}

resource "aws_iam_role_policy" "apigateway_cloudwatch" {
  name   = "default"
  role   = aws_iam_role.apigateway_cloudwatch.id
  policy = data.aws_iam_policy_document.apigateway_cloudwatch.json
}
