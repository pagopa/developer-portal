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
