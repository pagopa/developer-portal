---
"infrastructure": minor
---

Add regional AWS Backup plans and vaults in `eu-south-1` and `eu-central-1`, with daily snapshots, 35-day retention, governance-mode Vault Lock, and SNS notifications for failed or expired jobs. Select resources tagged `Backup=True` and grant the backup role S3 backup permissions. Enable versioning and the backup-selection tag for the production video recordings bucket, and expose backup plan, vault, role, and notification topic details in Terraform outputs.
