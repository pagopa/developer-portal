###############################################################################
#                      Define IAM Role to use on deploy                       #
###############################################################################
data "aws_iam_policy" "deploy_access" {
  name = "AmazonS3FullAccess"
}

resource "aws_iam_role" "githubaction_deploy" {
  name        = "GitHubActionDeployRole"
  description = "Role to assume to deploy the website"

  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "s3:ListBucket",
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject"
        ],
        "Resource": [
          "arn:aws:s3:::*",
          "arn:aws:s3:::*/*"
        ],
        Condition = {
          StringLike = {
            "token.actions.githubusercontent.com:sub" : "repo:${var.github_repository}:*"
          },
          "ForAllValues:StringEquals" = {
            "token.actions.githubusercontent.com:iss" : "https://token.actions.githubusercontent.com",
            "token.actions.githubusercontent.com:aud" : "sts.amazonaws.com"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "githubaction_deploy" {
  role       = aws_iam_role.githubaction_deploy.name
  policy_arn = data.aws_iam_policy.deploy_access.arn
}
