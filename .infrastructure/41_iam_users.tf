module "iam_user_mauro_dandrea" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-user?ref=f37809108f86d8fbdf17f735df734bf4abe69315" # v5.34.0
  count  = var.environment == "dev" ? 1 : 0

  force_destroy                 = true
  password_reset_required       = true
  create_iam_user_login_profile = true
  create_iam_access_key         = false

  policy_arns = ["arn:aws:iam::aws:policy/IAMUserChangePassword"]

  name = "mauro.dandrea@dgsspa.com"
  tags = {
    Company = "DGS"
  }
}

module "iam_group_developers_readonly_access" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-group-with-policies?ref=f37809108f86d8fbdf17f735df734bf4abe69315" # v5.34.0
  count  = var.environment == "dev" ? 1 : 0

  name                     = "developers_read_only"
  create_group             = true
  group_users              = [module.iam_user_mauro_dandrea[0].iam_user_name]
  custom_group_policy_arns = ["arn:aws:iam::aws:policy/ReadOnlyAccess"]
  # Attach IAM policy which allows IAM users to manage their credentials and MFA
  attach_iam_self_management_policy = true
}
