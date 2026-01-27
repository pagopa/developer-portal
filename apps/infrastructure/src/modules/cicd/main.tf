module "codebuild" {
  source  = "pagopa-dx/github-selfhosted-runner-on-codebuild/aws"
  version = "~> 1.1.0"
  name    = "${var.environment}-github-runner"
  # The full environment name (dev, uat, prod) instead of the short one (d, u, p)
  # allows to use the self-hosted runner for the current environment according to
  # the standard "environment" input variable
  #environment = merge(var.environment_information, { env_short = var.environment })

  environment = {
    prefix          = "devportal"
    env_short       = var.environment
    region          = "eu-south-1"
    app_name        = "developer-portal"
    instance_number = "01"
  }
  tier = "l"

  repository = {
    organization = split("/", var.github_repository)[0]
    name         = split("/", var.github_repository)[1]
  }

  vpc = {
    id              = var.vpc.id
    private_subnets = var.vpc.private_subnets
  }

  # Shared CodeConnection
  codeconnection_arn = "arn:aws:codeconnections:eu-south-1:195239627635:connection/1606e639-3a11-479d-ad75-b8a1921f0346"

  env_variables = var.chatbot_env_vars

  tags = var.tags
}