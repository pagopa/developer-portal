output "backup_plan_arn" {
  description = "ARN of the production backup plan."
  value       = module.backup.backup_plan_arn
}

output "backup_role_arn" {
  description = "ARN of the AWS Backup service role."
  value       = aws_iam_role.backup.arn
}

output "backup_vault_arn" {
  description = "ARN of the encrypted production backup vault."
  value       = module.backup.backup_vault_arn
}

output "backup_vault_name" {
  description = "Name of the production backup vault."
  value       = module.backup.backup_vault_id
}

output "notifications_topic_arn" {
  description = "SNS topic ARN for failed and expired backup jobs; consumers must subscribe separately."
  value       = module.backup.sns_topic_vault_notifications_arn
}
