# AWS Backup

The root configuration creates this module in `eu-south-1` and `eu-central-1`
using `count = var.enable_backup ? 1 : 0`. Configure `enable_backup` in
`env/<environment>/terraform.tfvars`: it is enabled in dev for testing and in
prod, disabled in UAT, and defaults to `false` for new environments.

When enabled, each regional instance creates the vault, KMS key, daily backup
plan, tag-based selection, service role and policies, Vault Lock configuration,
and SNS notifications. Backups run daily at 03:00 UTC and are retained for 35
days. Only resources tagged `Backup=True` are selected; this module does not tag
resources itself. Subscribe an operational consumer to the notifications topic
to receive failed and expired job alerts. Service-native backups are unaffected.

From `apps/infrastructure/src`, review the plan before applying:

```sh
./terraform.sh init dev
./terraform.sh plan dev
./terraform.sh apply dev
./terraform.sh output dev backup
```

Use `prod` instead of `dev` for production. The `backup` output contains both
regions when enabled and is `null` when disabled. Moved blocks preserve existing
module state addresses when adding `count`.

Setting the flag to `false` after deployment plans destruction of the managed
backup resources; it does not merely pause scheduled jobs. Review the plan and
vault retention constraints before applying.

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
| <a name="output_backup_plan_arn"></a> [backup\_plan\_arn](#output\_backup\_plan\_arn) | ARN of the backup plan. |
| <a name="output_backup_role_arn"></a> [backup\_role\_arn](#output\_backup\_role\_arn) | ARN of the AWS Backup service role. |
| <a name="output_backup_vault_arn"></a> [backup\_vault\_arn](#output\_backup\_vault\_arn) | ARN of the encrypted backup vault. |
| <a name="output_backup_vault_name"></a> [backup\_vault\_name](#output\_backup\_vault\_name) | Name of the backup vault. |
| <a name="output_notifications_topic_arn"></a> [notifications\_topic\_arn](#output\_notifications\_topic\_arn) | SNS topic ARN for failed and expired backup jobs; consumers must subscribe separately. |
<!-- END_TF_DOCS -->
