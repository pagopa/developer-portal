resource "aws_iam_group" "developers_read_only" {
  name = "developers_read_only"
}

resource "aws_iam_group_policy_attachment" "read_only" {
  group = aws_iam_group.developers_read_only.name
  # The AWS ReadOnly Access Policy
  policy_arn = "arn:aws:iam::aws:policy/ReadOnlyAccess"
}
