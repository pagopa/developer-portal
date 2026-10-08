# Outputs for AWS DevOps Agent Configuration

output "agent_space_id" {
  description = "The ID of the created Agent Space"
  value       = awscc_devopsagent_agent_space.main.agent_space_id
}

output "agent_space_arn" {
  description = "The ARN of the created Agent Space"
  value       = awscc_devopsagent_agent_space.main.arn
}

output "agent_space_name" {
  description = "The name of the created Agent Space"
  value       = awscc_devopsagent_agent_space.main.name
}

output "devops_agentspace_role_arn" {
  description = "ARN of the DevOps Agent Space IAM role"
  value       = aws_iam_role.devops_agentspace.arn
}

output "devops_operator_role_arn" {
  description = "ARN of the DevOps Operator App IAM role"
  value       = aws_iam_role.devops_operator.arn
}

output "primary_account_id" {
  description = "Primary (monitoring) account ID"
  value       = data.aws_caller_identity.current.account_id
}

output "primary_account_association_id" {
  description = "ID of the primary AWS account association"
  value       = awscc_devopsagent_association.primary_aws_account.association_id
}

output "aws_region" {
  description = "AWS region"
  value       = data.aws_region.current.region
}
