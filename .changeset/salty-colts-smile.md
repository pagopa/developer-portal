---
"infrastructure": minor
---

Update Terraform state locking to use S3-native locking. The existing DynamoDB `terraform-lock` table remains in place for now and will be removed in a follow-up change.
