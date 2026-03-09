###############################################################################
#          Define IAM Role to deploy the IVS video processing Lambda         #
###############################################################################
resource "aws_iam_role" "deploy_lambda" {
  name               = "GitHubActionDeployIvsVideoProcessingLambda"
  description        = "Role assumed by GitHub Actions to deploy the IVS video processing Lambda"
  assume_role_policy = data.aws_iam_policy_document.deploy_github.json
}

resource "aws_iam_role_policy_attachment" "deploy_lambda" {
  role       = aws_iam_role.deploy_lambda.name
  policy_arn = aws_iam_policy.deploy_lambda.arn
}



resource "aws_iam_role" "webinar_metrics" {
  name                  = "${var.project_name}-webinar-metrics-role"
  force_detach_policies = true
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}