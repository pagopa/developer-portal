resource "aws_iam_group" "developers_read_only" {
  name = "developers_read_only"
}

# IAM Group Membership - DGS
resource "aws_iam_group_membership" "dgs" {
  count = var.environment == "dev" ? 1 : 0
  name  = "DGS"

  users = [
    aws_iam_user.mauro_dandrea.name
  ]

  group = aws_iam_group.developers_read_only.name
}

resource "aws_iam_group_policy_attachment" "read_only" {
  group = aws_iam_group.developers_read_only.name
  # The AWS ReadOnly Access Policy
  policy_arn = "arn:aws:iam::aws:policy/ReadOnlyAccess"
}
