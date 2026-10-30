module "synthetics" {
  count  = var.environment == "prod" ? 1 : 0
  source = "./modules/synthetics"

  providers = {
    aws   = aws.eu-south-1
    awscc = awscc
  }

  name                  = "devportal"
  artifact_bucket_name  = "cw-syn-results-195239627635-eu-south-1"
  artifact_prefix       = "canary/eu-south-1/devportal-1f7-d5f03914d4a4"
  execution_role_name   = "CloudWatchSyntheticsRole-devportal-1f7-d5f03914d4a4"
  execution_policy_name = "CloudWatchSyntheticsPolicy-devportal-1f7-d5f03914d4a4"
  log_group_names = {
    chrome  = "/aws/lambda/cwsyn-devportal-7072ea07-5a27-4b2d-940c-f57958f6fbe0"
    firefox = "/aws/lambda/cwsyn-devportal-7072ea07-5a27-4b2d-940c-f57958f-fire"
  }
  urls = [
    "https://developer.pagopa.it",
    "https://developer.pagopa.it/it/webinars",
    "https://developer.pagopa.it/it/solutions",
    "https://developer.pagopa.it/it/firma-con-io/overview",
    "https://developer.pagopa.it/it/pdnd-interoperabilita/overview",
  ]
  tags = var.tags
}

locals {
  synthetics_imports = var.environment == "prod" ? toset(["devportal"]) : toset([])
}

import {
  for_each = local.synthetics_imports
  to       = module.synthetics[0].awscc_synthetics_canary.heartbeat
  id       = each.value
}

import {
  for_each = local.synthetics_imports
  to       = module.synthetics[0].aws_iam_role.heartbeat
  id       = "CloudWatchSyntheticsRole-devportal-1f7-d5f03914d4a4"
}

import {
  for_each = local.synthetics_imports
  to       = module.synthetics[0].aws_iam_policy.heartbeat
  id       = "arn:aws:iam::195239627635:policy/service-role/CloudWatchSyntheticsPolicy-devportal-1f7-d5f03914d4a4"
}

import {
  for_each = local.synthetics_imports
  to       = module.synthetics[0].aws_iam_role_policy_attachment.heartbeat
  id       = "CloudWatchSyntheticsRole-devportal-1f7-d5f03914d4a4/arn:aws:iam::195239627635:policy/service-role/CloudWatchSyntheticsPolicy-devportal-1f7-d5f03914d4a4"
}

import {
  for_each = local.synthetics_imports
  to       = module.synthetics[0].aws_s3_bucket.artifacts
  id       = "cw-syn-results-195239627635-eu-south-1"
}

import {
  for_each = local.synthetics_imports
  to       = module.synthetics[0].aws_s3_bucket_public_access_block.artifacts
  id       = "cw-syn-results-195239627635-eu-south-1"
}

import {
  for_each = local.synthetics_imports
  to       = module.synthetics[0].aws_s3_bucket_server_side_encryption_configuration.artifacts
  id       = "cw-syn-results-195239627635-eu-south-1"
}

import {
  for_each = local.synthetics_imports
  to       = module.synthetics[0].aws_s3_bucket_lifecycle_configuration.artifacts
  id       = "cw-syn-results-195239627635-eu-south-1"
}

import {
  for_each = var.environment == "prod" ? {
    chrome  = "/aws/lambda/cwsyn-devportal-7072ea07-5a27-4b2d-940c-f57958f6fbe0"
    firefox = "/aws/lambda/cwsyn-devportal-7072ea07-5a27-4b2d-940c-f57958f-fire"
  } : {}
  to = module.synthetics[0].aws_cloudwatch_log_group.heartbeat[each.key]
  id = each.value
}
