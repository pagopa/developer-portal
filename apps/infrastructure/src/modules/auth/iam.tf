data "aws_iam_policy_document" "authenticated_users_policy" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = ["cognito-identity.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "cognito-identity.amazonaws.com:aud"
      values   = [aws_cognito_identity_pool.devportal.id]
    }

    condition {
      test     = "ForAnyValue:StringLike"
      variable = "cognito-identity.amazonaws.com:amr"
      values   = ["authenticated"]
    }
  }
}

resource "aws_iam_role" "devportal_authenticated_user" {
  name               = "DevPortalAuthenticatedUser"
  description        = "The role assumed by the authenticated devportal users"
  assume_role_policy = data.aws_iam_policy_document.authenticated_users_policy.json
}

resource "aws_iam_role" "devportal_authenticated_host_user" {
  name               = "DevPortalAuthenticatedHostUser"
  description        = "The role assumed by the authenticated host devportal users"
  assume_role_policy = data.aws_iam_policy_document.authenticated_users_policy.json
}
