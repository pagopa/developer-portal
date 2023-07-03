
data "aws_caller_identity" "current" {}

###############################################################################
#                       Define Terraform State Resources                      #
###############################################################################

# Define S3 bucket to store the terraform state file ##########################
resource "aws_s3_bucket" "terraform_states" {
  bucket_prefix = "terraform-backend-"

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    name = "S3 Remote Terraform State Store",
    Scope = "tfstate"
  }
}

resource "aws_s3_bucket_ownership_controls" "terraform_states" {
  bucket = aws_s3_bucket.terraform_states.id
  rule {
    object_ownership = "ObjectWriter"
  }
}

resource "aws_s3_bucket_acl" "terraform_states" {
  bucket     = aws_s3_bucket.terraform_states.id
  acl        = "private"
  depends_on = [aws_s3_bucket_ownership_controls.terraform_states]
}

resource "aws_s3_bucket_public_access_block" "terraform_states" {
  bucket                  = aws_s3_bucket.terraform_states.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "terraform_states" {
  bucket = aws_s3_bucket.terraform_states.id
  versioning_configuration {
    status = "Enabled"
  }
}

###############################################################################
#                       Define Terraform Lock Resources                       #
###############################################################################

## Define DynamoDB table where store the lock file ############################
resource "aws_dynamodb_table" "dynamodb-terraform-state-lock" {
  name           = "terraform-lock"
  hash_key       = "LockID"
  billing_mode    = "PAY_PER_REQUEST"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    name = "DynamoDB Terraform State Lock Table",
    Scope = "tflock"
  }

}

###############################################################################
#          Define resources that allow GitHub to apply infra changes          #
###############################################################################

data "aws_iam_policy" "admin_access" {
  name = "AdministratorAccess"
}

# github openid identity provider.
resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = [
    "sts.amazonaws.com",
  ]

  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1c58a3a8518e8759bf075b76b750d4f2df264fcd",
  ]
}

resource "aws_iam_role" "githubiac" {
  name        = "GitHubActionIACRole"
  description = "Role to assume to create the infrastructure."


  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          "Federated" : "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
        },
        Action = "sts:AssumeRoleWithWebIdentity",
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

resource "aws_iam_role_policy_attachment" "githubiac" {
  role       = aws_iam_role.githubiac.name
  policy_arn = data.aws_iam_policy.admin_access.arn
}
