resource "aws_codebuild_project" "github_runner" {
  name          = "${var.environment}-github-runner"
  description   = "CodeBuild project for self-hosted GitHub runner"
  service_role  = aws_iam_role.codebuild_role.arn
  build_timeout = var.build_timeout
  artifacts {
    type = "NO_ARTIFACTS"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_MEDIUM"
    image                       = "aws/codebuild/amazonlinux2-x86_64-standard:5.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
    privileged_mode             = true
  }

  source {
    type            = "GITHUB"
    location        = "https://github.com/${var.github_repository}.git"
    git_clone_depth = 1
  }

  vpc_config {
    vpc_id             = var.vpc.id
    subnets            = var.vpc.private_subnets
    security_group_ids = [aws_security_group.codebuild.id]
  }

  logs_config {
    cloudwatch_logs {
      group_name  = "/aws/codebuild/${var.environment}-github-runner"
      stream_name = "log-stream"
    }
  }

  tags = var.tags
}

resource "aws_codebuild_webhook" "github_webhook" {
  project_name = aws_codebuild_project.github_runner.name

  filter_group {
    filter {
      type    = "EVENT"
      pattern = "WORKFLOW_JOB_QUEUED"
    }
  }

  depends_on = [aws_iam_role_policy_attachment.github_connection]
}
