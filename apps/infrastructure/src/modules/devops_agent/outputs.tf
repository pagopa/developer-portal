# Outputs for AWS DevOps Agent Configuration

output "agent_space_id" {
  description = "The ID of the created Agent Space"
  value       = awscc_devopsagent_agent_space.main.id
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
  value       = awscc_devopsagent_association.primary_aws_account.id
}

output "secondary_account_role_arn" {
  description = "ARN of the Secondary Account Role for Agent Space"
  value       = var.agent_space_arn != "" ? aws_iam_role.secondary_account[0].arn : null
}

output "secondary_account_association_id" {
  description = "ID of the secondary AWS account association"
  value       = var.service_account_id != "" ? awscc_devopsagent_association.secondary_aws_account[0].id : null
}

output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}
