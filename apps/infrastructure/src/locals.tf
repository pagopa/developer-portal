locals {
  env_short = {
    dev  = "d"
    uat  = "u"
    prod = "p"
  }
}

data "aws_caller_identity" "current" {}