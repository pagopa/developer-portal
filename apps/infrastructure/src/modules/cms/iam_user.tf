## IAM User Strapi with Access and Secret Key for CMS Strapi
module "iam_user_cms" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-user?ref=f37809108f86d8fbdf17f735df734bf4abe69315" # v5.34.0

  name                          = "strapi"
  create_iam_user_login_profile = false
  create_iam_access_key         = true
  policy_arns                   = [module.iam_policy_cms.arn]
}
