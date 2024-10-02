resource "aws_codebuild_project" "github_runner" {
  name         = "${var.environment}-github-runner"
  description  = "CodeBuild project for self-hosted GitHub runner"
  service_role = aws_iam_role.codebuild_role.arn

  artifacts {
    type = "NO_ARTIFACTS"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_MEDIUM"
    image                       = "aws/codebuild/amazonlinux2-x86_64-standard:5.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
    privileged_mode             = true

    # Add environment variables for EFS mount
    environment_variable {
      name  = "EFS_ID"
      value = aws_efs_file_system.this.id
    }
    environment_variable {
      name  = "EFS_MOUNT_POINT"
      value = "/mnt/efs"
    }
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

  # Add EFS file system configuration
  file_system_locations {
    identifier    = "efs_mount"
    location      = "${aws_efs_file_system.this.dns_name}:/data"
    type          = "EFS"
    mount_point   = "/mnt/efs"
    mount_options = "nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2"
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
}