resource "aws_efs_file_system" "this" {
  creation_token = "${local.prefix}-efs"

  performance_mode = "generalPurpose"
  throughput_mode  = "bursting"
}

resource "aws_efs_access_point" "this" {
  file_system_id = aws_efs_file_system.this.id

  posix_user {
    uid = 33 #www-data
    gid = 33 #www-data
  }

  root_directory {
    creation_info {
      owner_uid   = 33 #www-data
      owner_gid   = 33 #www-data
      permissions = 755
    }
    path = "/data"
  }
}

resource "aws_security_group" "efs" {
  name        = "${local.prefix}-efs"
  description = "Security group for EFS container"
  vpc_id      = var.vpc.id

  # https://registry.terraform.io/providers/hashicorp/aws/5.35.0/docs/resources/security_group#recreating-a-security-group
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group_rule" "efs_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.efs.id
}

resource "aws_security_group_rule" "efs_redis_ingress" {
  type                     = "ingress"
  from_port                = 2049
  to_port                  = 2049
  protocol                 = "-1"
  security_group_id        = aws_security_group.efs.id
  source_security_group_id = aws_security_group.redis.id
}

resource "aws_efs_mount_target" "this" {
  count           = length(var.vpc.private_subnets)
  file_system_id  = aws_efs_file_system.this.id
  subnet_id       = tolist(var.vpc.private_subnets)[count.index]
  security_groups = [aws_security_group.efs.id]
}