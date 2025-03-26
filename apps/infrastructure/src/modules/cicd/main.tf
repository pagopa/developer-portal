module "codebuild" {
  source = "github.com/pagopa/dx//infra/modules/github_selfhosted_runner_on_codebuild?ref=self-hosted-runner-on-aws-module" # to substitute with registry path when released

  environment = var.environment_information
  repository = {
    organization = split("/", var.github_repository)[0]
    name         = split("/", var.github_repository)[1]
  }

  vpc = {
    id              = var.vpc.id
    private_subnets = var.vpc.private_subnets
  }

  codeconnection_arn = "arn:aws:codeconnections:eu-south-1:195239627635:connection/1606e639-3a11-479d-ad75-b8a1921f0346"

  env_variables = var.chatbot_env_vars

  tags = var.tags
}