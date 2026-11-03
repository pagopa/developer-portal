data "aws_default_tags" "current" {}

module "backup" {
  source = "git::https://github.com/pagopa/terraform-aws-backup.git?ref=c818dbe3e237ab6ddbd87e02419f3bf7a54a7896" # v1.3.4

  name                         = "devportal-${var.environment}-${var.region}"
  iam_role_arn                 = aws_iam_role.backup.arn
  enable_vault_lock_governance = true

  selection_tag = {
    key   = "Backup"
    value = "True"
  }

  backup_rule = [
    {
      rule_name                = "daily"
      schedule                 = "cron(0 3 * * ? *)"
      start_window             = 60
      completion_window        = 180
      enable_continuous_backup = false
      lifecycle = {
        delete_after = 35
      }
      recovery_point_tags = data.aws_default_tags.current.tags
    }
  ]

  # v1.3.4 unconditionally indexes the SNS topic in its outputs.
  create_sns_topic = true
  backup_vault_events = [
    "BACKUP_JOB_FAILED",
    "BACKUP_JOB_EXPIRED",
  ]

  depends_on = [
    aws_iam_role_policy_attachment.backup,
    aws_iam_role_policy_attachment.backup_s3,
  ]
}
