module "opensearch" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-opensearch.git?ref=48b1b42c58f60f34f4fcd5533e4504812b6e7bf7" #v1.4.0

  domain_name = "${local.prefix}-opensearch"
  # Domain
  # advanced_options = {
  #   "rest.action.multi.allow_explicit_index" = "true"
  # }

  advanced_security_options = {
    enabled                        = false
    anonymous_auth_enabled         = true
    internal_user_database_enabled = true

    master_user_options = {
      master_user_name     = "master"
      master_user_password = random_password.opensearch_master.result
    }
  }

  cluster_config = {
    instance_count           = var.opensearch.instance_count
    dedicated_master_enabled = var.opensearch.dedicated_master_instance_type != null ? true : false
    dedicated_master_type    = var.opensearch.dedicated_master_instance_type
    instance_type            = var.opensearch.node_instance_type

    zone_awareness_config = {
      availability_zone_count = length(var.vpc.database_subnets)
    }

    zone_awareness_enabled = var.opensearch.instance_count >= length(var.vpc.database_subnets)
  }

  domain_endpoint_options = {
    enforce_https       = true
    tls_security_policy = "Policy-Min-TLS-1-2-2019-07"
  }

  ebs_options = var.opensearch.ebs_options

  encrypt_at_rest = {
    enabled = true
  }

  auto_tune_options = {
    desired_state = "DISABLED"
  }


  engine_version = var.opensearch.engine_version

  log_publishing_options = [
    { log_type = "INDEX_SLOW_LOGS" },
    { log_type = "SEARCH_SLOW_LOGS" },
  ]

  node_to_node_encryption = {
    enabled = true
  }

  software_update_options = {
    auto_software_update_enabled = true
  }

  vpc_options = {
    subnet_ids = slice(var.vpc.database_subnets, 0, var.opensearch.instance_count)
    security_group_ids = [
      aws_security_group.opensearch.id
    ]
  }

  create_security_group = false


  # VPC endpoint
  # vpc_endpoints = {
  #   one = {
  #     subnet_ids = ["subnet-abcde012", "subnet-bcde012a", "subnet-fghi345a"]
  #   }
  # }

  # Access policy
  access_policy_statements = [
    {
      effect = "Allow"

      principals = [{
        type        = "*"
        identifiers = ["*"]
      }]

      actions = ["es:*"]

      condition = [{
        test     = "IpAddress"
        variable = "aws:SourceIp"
        values   = [var.vpc.cidr_block]
      }]
    }
  ]
}

resource "random_password" "opensearch_master" {
  length           = 16
  special          = true
  override_special = "_%@"
}

resource "aws_ssm_parameter" "opensearch_master" {
  name  = "/opensearch/${local.prefix}/users/master"
  type  = "SecureString"
  value = jsonencode(
    {
      username = "master"
      password = random_password.opensearch_master.result
    }
  )
}

resource "aws_security_group" "opensearch" {
  name        = "${local.prefix}-opensearch"
  description = "opensearch"
  vpc_id      = var.vpc.id

  # https://registry.terraform.io/providers/hashicorp/aws/5.35.0/docs/resources/security_group#recreating-a-security-group
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group_rule" "opensearch_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.opensearch.id
}

resource "aws_security_group_rule" "lambda_opensearch_ingress" {
  type                     = "ingress"
  from_port                = 443
  to_port                  = 443
  protocol                 = "tcp"
  security_group_id        = aws_security_group.opensearch.id
  source_security_group_id = aws_security_group.lambda.id
}

resource "aws_security_group_rule" "ecs_opensearch_ingress" {
  type                     = "ingress"
  from_port                = 443
  to_port                  = 443
  protocol                 = "tcp"
  security_group_id        = aws_security_group.opensearch.id
  source_security_group_id = var.security_groups.ecs_tasks
}