# Data source to get current AWS account ID
data "aws_caller_identity" "current" {}

################################################
# IAM Roles and Policies for AWS DevOps Agent. #
################################################

# Random suffix to ensure unique role names
resource "random_id" "suffix" {
  byte_length = 4
}

# Trust policy for DevOps Agent Space Role
data "aws_iam_policy_document" "devops_agentspace_trust" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["aidevops.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]

    condition {
      test     = "StringEquals"
      variable = "aws:SourceAccount"
      values   = [data.aws_caller_identity.current.account_id]
    }

    condition {
      test     = "ArnLike"
      variable = "aws:SourceArn"
      values   = ["arn:aws:aidevops:${var.aws_region}:${data.aws_caller_identity.current.account_id}:agentspace/*"]
    }
  }
}

# DevOps Agent Space Role
resource "aws_iam_role" "devops_agentspace" {
  name               = "DevOpsAgentRole-AgentSpace-${var.name_postfix != "" ? var.name_postfix : random_id.suffix.hex}"
  assume_role_policy = data.aws_iam_policy_document.devops_agentspace_trust.json

  tags = var.tags
}

# Attach AIDevOpsAgentAccessPolicy managed policy to Agent Space role
resource "aws_iam_role_policy_attachment" "devops_agentspace_access" {
  role       = aws_iam_role.devops_agentspace.name
  policy_arn = "arn:aws:iam::aws:policy/AIDevOpsAgentAccessPolicy"
}

# Inline policy for creating Resource Explorer service-linked role
data "aws_iam_policy_document" "devops_agentspace_inline" {
  statement {
    sid    = "AllowCreateServiceLinkedRoles"
    effect = "Allow"

    actions = [
      "iam:CreateServiceLinkedRole"
    ]

    resources = [
      "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/aws-service-role/resource-explorer-2.amazonaws.com/AWSServiceRoleForResourceExplorer"
    ]
  }
}

resource "aws_iam_role_policy" "devops_agentspace_inline" {
  name   = "AllowCreateServiceLinkedRoles"
  role   = aws_iam_role.devops_agentspace.id
  policy = data.aws_iam_policy_document.devops_agentspace_inline.json
}

# Trust policy for Operator App Role
data "aws_iam_policy_document" "devops_operator_trust" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["aidevops.amazonaws.com"]
    }

    actions = ["sts:AssumeRole", "sts:TagSession"]

    condition {
      test     = "StringEquals"
      variable = "aws:SourceAccount"
      values   = [data.aws_caller_identity.current.account_id]
    }

    condition {
      test     = "ArnLike"
      variable = "aws:SourceArn"
      values   = ["arn:aws:aidevops:${var.aws_region}:${data.aws_caller_identity.current.account_id}:agentspace/*"]
    }
  }
}

# DevOps Operator App Role
resource "aws_iam_role" "devops_operator" {
  name               = "DevOpsAgentRole-WebappAdmin-${var.name_postfix != "" ? var.name_postfix : random_id.suffix.hex}"
  assume_role_policy = data.aws_iam_policy_document.devops_operator_trust.json

  tags = var.tags
}

# Attach AIDevOpsOperatorAppAccessPolicy managed policy to Operator App role
resource "aws_iam_role_policy_attachment" "devops_operator_access" {
  role       = aws_iam_role.devops_operator.name
  policy_arn = "arn:aws:iam::aws:policy/AIDevOpsOperatorAppAccessPolicy"
}

#######################################################################################
# Service Account Resources (mirrors CDK ServiceStack)
# Deploys into the secondary (service) account for cross-account monitoring.
# Only created when agent_space_arn is set (after initial deployment).
########################################################################################

# Secondary account role — trusted by the Agent Space in the monitoring account
resource "aws_iam_role" "secondary_account" {
  count    = var.agent_space_arn != "" ? 1 : 0
  provider = aws.service

  name               = "DevOpsAgentRole-SecondaryAccount-TF"
  assume_role_policy = data.aws_iam_policy_document.secondary_account_trust[0].json
  description        = "Secondary account role for DevOps Agent Space cross-account access"

  tags = var.tags
}

data "aws_iam_policy_document" "secondary_account_trust" {
  count = var.agent_space_arn != "" ? 1 : 0

  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["aidevops.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]

    condition {
      test     = "StringEquals"
      variable = "aws:SourceAccount"
      values   = [data.aws_caller_identity.current.account_id]
    }

    condition {
      test     = "StringEquals"
      variable = "aws:SourceArn"
      values   = [var.agent_space_arn]
    }
  }
}

# Attach AIDevOpsAgentAccessPolicy managed policy
resource "aws_iam_role_policy_attachment" "secondary_account_access" {
  count    = var.agent_space_arn != "" ? 1 : 0
  provider = aws.service

  role       = aws_iam_role.secondary_account[0].name
  policy_arn = "arn:aws:iam::aws:policy/AIDevOpsAgentAccessPolicy"
}

# Inline policy for creating Resource Explorer service-linked role
data "aws_iam_policy_document" "secondary_account_inline" {
  count = var.agent_space_arn != "" ? 1 : 0

  statement {
    sid    = "AllowCreateServiceLinkedRoles"
    effect = "Allow"

    actions = [
      "iam:CreateServiceLinkedRole"
    ]

    resources = [
      "arn:aws:iam::${var.service_account_id}:role/aws-service-role/resource-explorer-2.amazonaws.com/AWSServiceRoleForResourceExplorer"
    ]
  }
}

resource "aws_iam_role_policy" "secondary_account_inline" {
  count    = var.agent_space_arn != "" ? 1 : 0
  provider = aws.service

  name   = "AllowCreateServiceLinkedRoles"
  role   = aws_iam_role.secondary_account[0].id
  policy = data.aws_iam_policy_document.secondary_account_inline[0].json
}

# Echo Lambda function — simple example service (matches CDK ServiceStack)
resource "aws_lambda_function" "echo_service" {
  count    = var.agent_space_arn != "" ? 1 : 0
  provider = aws.service

  function_name = "echo-service-tf"
  description   = "Simple echo service that returns the input event"
  runtime       = "nodejs20.x"
  handler       = "index.handler"
  timeout       = 30
  memory_size   = 128

  filename         = data.archive_file.echo_lambda[0].output_path
  source_code_hash = data.archive_file.echo_lambda[0].output_base64sha256

  role = aws_iam_role.echo_service_role[0].arn

  tags = var.tags
}

data "archive_file" "echo_lambda" {
  count       = var.agent_space_arn != "" ? 1 : 0
  type        = "zip"
  output_path = "${path.module}/echo-service.zip"

  source {
    content  = <<-JS
exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Echo service response',
      echo: event,
      timestamp: new Date().toISOString()
    })
  };
};
JS
    filename = "index.js"
  }
}

# Lambda execution role
resource "aws_iam_role" "echo_service_role" {
  count    = var.agent_space_arn != "" ? 1 : 0
  provider = aws.service

  name               = "echo-service-tf-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_trust[0].json

  tags = var.tags
}

data "aws_iam_policy_document" "lambda_trust" {
  count = var.agent_space_arn != "" ? 1 : 0

  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role_policy_attachment" "echo_service_basic" {
  count    = var.agent_space_arn != "" ? 1 : 0
  provider = aws.service

  role       = aws_iam_role.echo_service_role[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}


################################
# AWS DevOps Agent Resources
################################

# Wait for IAM roles to propagate before creating the Agent Space
resource "time_sleep" "wait_for_iam_propagation" {
  depends_on = [
    aws_iam_role.devops_agentspace,
    aws_iam_role_policy_attachment.devops_agentspace_access,
    aws_iam_role_policy.devops_agentspace_inline,
    aws_iam_role.devops_operator,
    aws_iam_role_policy_attachment.devops_operator_access
  ]

  create_duration = "30s"
}

# Create the Agent Space with Operator App (matches CDK DevOpsAgentStack)
resource "awscc_devopsagent_agent_space" "main" {
  name        = var.agent_space_name
  description = var.agent_space_description

  operator_app = {
    iam = {
      operator_app_role_arn = aws_iam_role.devops_operator.arn
    }
  }

  depends_on = [
    time_sleep.wait_for_iam_propagation
  ]
}

# Associate the primary AWS account for monitoring
resource "awscc_devopsagent_association" "primary_aws_account" {
  agent_space_id = awscc_devopsagent_agent_space.main.id
  service_id     = "aws"

  configuration = {
    aws = {
      assumable_role_arn = aws_iam_role.devops_agentspace.arn
      account_id         = data.aws_caller_identity.current.account_id
      account_type       = "monitor"
      resources          = []
    }
  }

  depends_on = [
    awscc_devopsagent_agent_space.main
  ]
}

# Associate the service account for cross-account monitoring (optional)
resource "awscc_devopsagent_association" "secondary_aws_account" {
  count = var.service_account_id != "" && var.agent_space_arn != "" ? 1 : 0

  agent_space_id = awscc_devopsagent_agent_space.main.id
  service_id     = "aws"

  configuration = {
    source_aws = {
      assumable_role_arn = aws_iam_role.secondary_account[0].arn
      account_id         = var.service_account_id
      account_type       = "source"
    }
  }

  depends_on = [
    awscc_devopsagent_association.primary_aws_account
  ]
}






################################################################################
# Association: GitHub source (pipeline)
################################################################################
/*
resource "awscc_devopsagent_association" "github_source" {
  provider = awscc.eu-central-1

  agent_space_id = awscc_devopsagent_agent_space.this.agent_space_id
  service_id     = "github"

  configuration = {
    git_hub = {
      owner      = var.github_source.owner
      owner_type = var.github_source.owner_type
      repo_name  = var.github_source.repo_name
      repo_id    = var.github_source.repo_id
    }
  }
}
*/