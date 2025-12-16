resource "aws_efs_file_system" "clickhouse_data" {
  creation_token = "${local.prefix}-clickhouse-data"

  tags = {
    Name = "clickhouse-data"
  }
}

resource "aws_efs_mount_target" "clickhouse_data" {
  count = length(var.private_subnet_ids)

  file_system_id  = aws_efs_file_system.clickhouse_data.id
  subnet_id       = var.private_subnet_ids[count.index]
  security_groups = [aws_security_group.efs.id]
}
