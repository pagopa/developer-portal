locals {
  import_devops_agent = var.environment == "prod" && var.create_devops_agent ? toset(["production"]) : toset([])
}

import {
  for_each = local.import_devops_agent
  to       = module.devops_agent[0].awscc_devopsagent_agent_space.main
  id       = "836efc07-3442-4698-a069-14aa021abb4b"
}

import {
  for_each = local.import_devops_agent
  to       = module.devops_agent[0].awscc_devopsagent_association.primary_aws_account
  id       = "836efc07-3442-4698-a069-14aa021abb4b|bd2b0d87-6590-4445-95d2-20b108bfc757"
}

import {
  for_each = local.import_devops_agent
  to       = module.devops_agent[0].aws_iam_role.devops_agentspace
  id       = "DevOpsAgentRole-AgentSpace-1efc2e23"
}

import {
  for_each = local.import_devops_agent
  to       = module.devops_agent[0].aws_iam_role.devops_operator
  id       = "DevOpsAgentRole-WebappAdmin-1efc2e23"
}

import {
  for_each = local.import_devops_agent
  to       = module.devops_agent[0].aws_iam_role_policy_attachment.devops_agentspace_access
  id       = "DevOpsAgentRole-AgentSpace-1efc2e23/arn:aws:iam::aws:policy/AIDevOpsAgentAccessPolicy"
}

import {
  for_each = local.import_devops_agent
  to       = module.devops_agent[0].aws_iam_role_policy_attachment.devops_operator_access
  id       = "DevOpsAgentRole-WebappAdmin-1efc2e23/arn:aws:iam::aws:policy/AIDevOpsOperatorAppAccessPolicy"
}

import {
  for_each = local.import_devops_agent
  to       = module.devops_agent[0].aws_iam_role_policy.devops_agentspace_inline
  id       = "DevOpsAgentRole-AgentSpace-1efc2e23:AllowCreateServiceLinkedRoles"
}

import {
  for_each = local.import_devops_agent
  to       = module.devops_agent[0].aws_iam_role_policy.devops_agentspace_pricing
  id       = "DevOpsAgentRole-AgentSpace-1efc2e23:AllowPricingReadOnly"
}
