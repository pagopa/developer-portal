# Production backups

Implements DEV-4564 using PagoPA's `terraform-aws-backup` module, pinned to
v1.3.4. The root configuration instantiates this module only for `prod`, once
per region (`eu-south-1` and `eu-central-1`), because AWS Backup vaults, plans
and selections are regional. It creates no AWS Backup resources in `dev` or
`uat` and does not change existing service-native backups.

Resource names use `devportal-<environment>-<region>` and the service role uses
`devportal-<environment>-backup-<region>`, so regional instances do not collide
(IAM roles are global). The upstream module appends resource-specific
suffixes to the vault, plan, and selection names. Resource tags are inherited
from the AWS provider's `default_tags`; recovery points explicitly receive the
same default tags. No separate tags input is required.

## Approved policy

- Daily snapshots at 03:00 UTC, with a 60-minute start window and a 180-minute
  completion window.
- Recovery points expire after 35 days in warm storage. There is no cold-tier
  transition, continuous backup, or cross-region copy.
- The vault uses the upstream module's customer-managed KMS key with automatic
  key rotation and governance-mode Vault Lock.
- Resource selection matches the case-sensitive tag `Backup=True` in the
  region of the instance. This module does not tag or enroll resources itself;
  resource enrollment is handled by the related resource-specific Jira cards.
  The production video recordings bucket (`devportal-p-recordings-*`,
  `eu-central-1`) is tagged `Backup=True` and versioned in the
  `video_streaming` module.
- Failed and expired jobs publish to the upstream module's SNS topic. Subscribe
  an operational consumer to `notifications_topic_arn` separately; creation of
  the topic alone does not deliver alerts to people.

These durations are the project-approved policy, not a universal AWS
recommendation. AWS recommends choosing retention and backup frequency from
recovery objectives, data classification, and regulatory requirements:
[backup strategy guidance](https://docs.aws.amazon.com/prescriptive-guidance/latest/security-best-practices/strategy.html).
Warm storage avoids resource-specific cold-tier restrictions and the
[minimum 90-day cold-storage residence](https://docs.aws.amazon.com/aws-backup/latest/APIReference/API_Lifecycle.html).

Governance mode can be removed by authorized administrators; it is not
irreversible compliance-mode immutability. The upstream module does not set
minimum or maximum retention bounds on the lock.

## Deployment and verification

From `apps/infrastructure/src`, initialize and review the production plan before
applying:

```sh
./terraform.sh init prod
./terraform.sh plan prod
./terraform.sh apply prod
./terraform.sh output prod backup
```

After applying, verify that the vault and plan are visible in AWS Backup in
`eu-south-1` and `eu-central-1`, inspect the `Backup=True` selection and service
role, and confirm successful scheduled jobs after resource enrollment. A plan
with no matching tagged resources does not protect any data.

The service role has `AWSBackupServiceRolePolicyForBackup` and
`AWSBackupServiceRolePolicyForS3Backup`, not restore permissions. Restores
require a separately authorized role (for S3, `AWSBackupServiceRolePolicyForS3Restore`).
S3 buckets must have versioning enabled, and S3 recovery points cannot
transition to cold storage (the warm-only policy is compatible). Resources in
other regions require an additional regional instance. The policy does not
provide cross-region disaster recovery.

The upstream release requires its SNS topic to be enabled because its output
unconditionally references the topic. It names that topic `backup-vault-events`
in each region; check for an existing independently managed topic with that
name before apply.

<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.7 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 6.67.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 6.67.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_backup"></a> [backup](#module\_backup) | git::https://github.com/pagopa/terraform-aws-backup.git | c818dbe3e237ab6ddbd87e02419f3bf7a54a7896 |

## Resources

| Name | Type |
|------|------|
| [aws_iam_role.backup](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.backup](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.backup_s3](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_default_tags.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/default_tags) | data source |
| [aws_iam_policy_document.backup_assume_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_partition.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/partition) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_environment"></a> [environment](#input\_environment) | Deployment environment used to name backup resources. | `string` | n/a | yes |
| <a name="input_region"></a> [region](#input\_region) | AWS region of the provider passed to this module; used to keep names unique across regional instances. | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_backup_plan_arn"></a> [backup\_plan\_arn](#output\_backup\_plan\_arn) | ARN of the production backup plan. |
| <a name="output_backup_role_arn"></a> [backup\_role\_arn](#output\_backup\_role\_arn) | ARN of the AWS Backup service role. |
| <a name="output_backup_vault_arn"></a> [backup\_vault\_arn](#output\_backup\_vault\_arn) | ARN of the encrypted production backup vault. |
| <a name="output_backup_vault_name"></a> [backup\_vault\_name](#output\_backup\_vault\_name) | Name of the production backup vault. |
| <a name="output_notifications_topic_arn"></a> [notifications\_topic\_arn](#output\_notifications\_topic\_arn) | SNS topic ARN for failed and expired backup jobs; consumers must subscribe separately. |
<!-- END_TF_DOCS -->