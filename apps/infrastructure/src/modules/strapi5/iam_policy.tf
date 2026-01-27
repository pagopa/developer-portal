data "aws_caller_identity" "current" {}

data "aws_iam_policy_document" "deploy_github" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_repository}:*"]
    }

    condition {
      test     = "ForAllValues:StringEquals"
      variable = "token.actions.githubusercontent.com:iss"
      values   = ["https://token.actions.githubusercontent.com"]
    }

    condition {
      test     = "ForAllValues:StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
  }
}

resource "aws_iam_policy" "deploy_cms" {
  name        = "DeployCmsV5"
  description = "Policy to allow to deploy the cms"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ecs:DescribeTaskDefinition",
          "ecs:RegisterTaskDefinition",
          "ecs:DescribeServices",
          "ecs:UpdateService",
          "ecr:GetAuthorizationToken",
          "ecr:CompleteLayerUpload",
          "ecr:GetAuthorizationToken",
          "ecr:UploadLayerPart",
          "ecr:InitiateLayerUpload",
          "ecr:BatchCheckLayerAvailability",
          "ecr:PutImage",
          "ecr:BatchGetImage"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action = [
          "iam:PassRole"
        ]
        Effect = "Allow"
        Resource = [
          module.iam_role_ecs_task_execution.iam_role_arn,
          module.iam_role_task_role.iam_role_arn
        ]
      }
    ]
  })
}

data "aws_iam_policy_document" "ecs_task_execution" {
  statement {
    effect = "Allow"
    actions = [
      "ssm:DescribeParameters"
    ]
    resources = ["*"]
  }

  statement {
    effect = "Allow"
    actions = [
      "ssm:GetParameters"
    ]
    resources = concat([
      module.secret_cms_database_password.ssm_parameter_arn,
      module.secret_cms_admin_jwt_secret.ssm_parameter_arn,
      module.secret_cms_app_keys.ssm_parameter_arn,
      module.secret_cms_api_token_salt.ssm_parameter_arn,
      module.secret_cms_transfer_token_salt.ssm_parameter_arn,
      module.secret_cms_jwt_secret.ssm_parameter_arn,
      data.aws_ssm_parameter.secret_cms_access_key_id.arn,
      data.aws_ssm_parameter.secret_cms_access_key_secret.arn,
      data.aws_ssm_parameter.secret_cms_github_pat.arn,
      data.aws_ssm_parameter.secret_cms_google_gsuite_hd.arn,
      data.aws_ssm_parameter.secret_cms_google_oauth_client_id.arn,
      data.aws_ssm_parameter.secret_cms_google_oauth_client_secret.arn,
      ],
      (var.ac_integration_is_enabled ? [var.ac_base_url_param, var.ac_api_key_param] : [])
    )
  }

  statement {
    effect = "Allow"
    actions = [
      "s3:GetBucketLocation"
    ]
    resources = [
      module.s3_bucket_cms.s3_bucket_arn
    ]
  }
}

module "iam_policy_ecs_task_execution" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-policy?ref=f37809108f86d8fbdf17f735df734bf4abe69315" # v5.34.0

  name   = "CMSTaskExecutionPoliciesV5"
  path   = "/"
  policy = data.aws_iam_policy_document.ecs_task_execution.json
}

data "aws_iam_policy_document" "ecs_task_role_s3" {
  statement {
    effect = "Allow"
    actions = [
      "s3:DeleteObject",
      "s3:GetObject",
      "s3:GetObjectAttributes",
      "s3:ListBucket",
      "s3:PutObject",
      "s3:PutObjectAcl"
    ]
    resources = [
      module.s3_bucket_cms.s3_bucket_arn,
      "${module.s3_bucket_cms.s3_bucket_arn}/*"
    ]
  }
}

data "aws_iam_policy_document" "ecs_task_role_ssm" {
  statement {
    effect = "Allow"
    actions = [
      "ssmmessages:CreateControlChannel",
      "ssmmessages:CreateDataChannel",
      "ssmmessages:OpenControlChannel",
      "ssmmessages:OpenDataChannel"
    ]
    resources = [
      "*"
    ]
  }
}

module "iam_policy_ecs_task_role_s3" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-policy?ref=f37809108f86d8fbdf17f735df734bf4abe69315" # v5.34.0

  name   = "CMSTaskRolePoliciesS3V5"
  path   = "/"
  policy = data.aws_iam_policy_document.ecs_task_role_s3.json
}

module "iam_policy_ecs_task_role_ssm" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-policy?ref=f37809108f86d8fbdf17f735df734bf4abe69315" # v5.34.0

  name   = "CMSTaskRolePoliciesSSMV5"
  path   = "/"
  policy = data.aws_iam_policy_document.ecs_task_role_ssm.json
}

module "iam_policy_cms" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-iam.git//modules/iam-policy?ref=f37809108f86d8fbdf17f735df734bf4abe69315" # v5.34.0

  name        = "S3UploadImagesV5"
  path        = "/"
  description = "Policy to allow to manage files in S3 bucket"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:DeleteObject",
          "s3:GetObject",
          "s3:GetObjectAttributes",
          "s3:ListBucket",
          "s3:PutObject"
        ]
        Effect   = "Allow"
        Resource = format("%s/*", module.s3_bucket_cms.s3_bucket_arn)
      },
    ]
  })
}


data "aws_iam_policy_document" "s3_iam_policy_cms" {
  statement {
    actions = ["s3:GetObject"]
    resources = [
      "${module.s3_bucket_cms.s3_bucket_arn}/*"
    ]

    principals {
      type        = "AWS"
      identifiers = module.cloudfront_cms.cloudfront_origin_access_identity_iam_arns
    }
  }
}