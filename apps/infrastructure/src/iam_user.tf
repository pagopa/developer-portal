resource "aws_iam_user" "mauro_dandrea" {
  # This force the deletion of the user and its login profile
  # because we manually give access to the console
  force_destroy = true

  name = "mauro.dandrea@dgsspa.com"

  tags = {
    Company = "DGS"
  }
}

# Allow IAM User to change the password
# Attach IAM User policy because with IAM Group policy we have the following error
# Error: deleting IAM User  DeleteConflict: Cannot delete entity, must delete login profile first.
resource "aws_iam_user_policy_attachment" "change_password" {
  user       = aws_iam_user.mauro_dandrea.name
  policy_arn = "arn:aws:iam::aws:policy/IAMUserChangePassword"
}

## IAM User Strapi with Access and Secret Key for CMS Strapi
module "iam_user_cms" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-user?ref=f37809108f86d8fbdf17f735df734bf4abe69315" # v5.34.0

  name                          = "strapi"
  create_iam_user_login_profile = false
  create_iam_access_key         = true
  policy_arns                   = [module.iam_policy_cms.arn]
}
