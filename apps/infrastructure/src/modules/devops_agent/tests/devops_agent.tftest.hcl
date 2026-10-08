provider "aws" {
  region                      = "eu-central-1"
  access_key                  = "testing"
  secret_key                  = "testing"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
}

mock_provider "awscc" {}

override_data {
  target = data.aws_caller_identity.current
  values = {
    account_id = "123456789012"
  }
}

override_data {
  target = data.aws_partition.current
  values = {
    partition = "aws"
  }
}

override_data {
  target = data.aws_region.current
  values = {
    region = "eu-central-1"
  }
}

variables {
  agent_space_description = "Space for DevOps agent of Developer Portal"
  agent_space_name        = "DevPortalAgentSpace"
  name_postfix            = "1efc2e23"
  tags = {
    Environment = "prod"
    CostCenter  = "test"
    Owner       = "Devportal"
    Source      = "test"
  }
}

run "preserve_existing_configuration" {
  command = plan

  assert {
    condition = (
      aws_iam_role.devops_agentspace.name == "DevOpsAgentRole-AgentSpace-1efc2e23" &&
      aws_iam_role.devops_operator.name == "DevOpsAgentRole-WebappAdmin-1efc2e23"
    )
    error_message = "Importing must preserve the existing IAM role names."
  }

  assert {
    condition = (
      jsondecode(data.aws_iam_policy_document.devops_agentspace_trust.json).Statement[0].Condition.ArnLike["aws:SourceArn"] ==
      "arn:aws:aidevops:eu-central-1:123456789012:agentspace/*" &&
      jsondecode(data.aws_iam_policy_document.devops_operator_trust.json).Statement[0].Condition.StringEquals["aws:SourceAccount"] ==
      "123456789012"
    )
    error_message = "Trust must be scoped to the current account and the agent provider region."
  }

  assert {
    condition = toset(jsondecode(data.aws_iam_policy_document.devops_operator_trust.json).Statement[0].Action) == toset([
      "sts:AssumeRole", "sts:TagSession",
    ])
    error_message = "The operator role must preserve session tagging."
  }

  assert {
    condition = toset(jsondecode(aws_iam_role_policy.devops_agentspace_pricing.policy).Statement[0].Action) == toset([
      "pricing:GetProducts", "pricing:DescribeServices", "pricing:GetAttributeValues",
    ])
    error_message = "The existing pricing-read policy must be managed without extra permissions."
  }

  assert {
    condition = (
      awscc_devopsagent_association.primary_aws_account.service_id == "aws" &&
      awscc_devopsagent_association.primary_aws_account.configuration.aws.account_type == "monitor" &&
      awscc_devopsagent_association.primary_aws_account.configuration.aws.account_id == "123456789012"
    )
    error_message = "The association must retain account-wide AWS monitoring."
  }

  assert {
    condition     = tomap({ for tag in awscc_devopsagent_agent_space.main.tags : tag.key => tag.value }) == var.tags
    error_message = "The agent space must receive all cost-allocation tags."
  }
}

run "reject_empty_role_suffix" {
  command = plan
  variables {
    name_postfix = ""
  }
  expect_failures = [var.name_postfix]
}

run "reject_invalid_role_suffix" {
  command = plan
  variables {
    name_postfix = "invalid/suffix"
  }
  expect_failures = [var.name_postfix]
}
