resource "aws_db_subnet_group" "postgres_subnet_grp" {
  name        = "${local.prefix}-postgres_subnet_grp"
  description = "Langfuse Database Subnet Group"
  subnet_ids  = var.private_subnet_ids
  tags = {
    Name = "postgres_subnet_grp"
  }
}

resource "aws_rds_cluster" "langfuse_aurora_cluster" {
  cluster_identifier = "${local.prefix}-postgres"
  engine             = "aurora-postgresql"
  engine_version     = "15.6"
  engine_mode        = "provisioned"
  # availability_zones  = var.availability_zones
  database_name       = "langfuse"
  master_username     = var.database_user
  master_password     = aws_secretsmanager_secret_version.langfuse_db_password.secret_string
  storage_encrypted   = true
  kms_key_id          = aws_kms_key.postgres.arn
  deletion_protection = !var.force_delete

  backup_retention_period         = 5
  preferred_backup_window         = "07:00-09:00"
  vpc_security_group_ids          = [aws_security_group.langfuse_db.id]
  db_subnet_group_name            = aws_db_subnet_group.postgres_subnet_grp.name
  enabled_cloudwatch_logs_exports = ["postgresql"]
  skip_final_snapshot             = true
  enable_http_endpoint            = true
  tags = {
    Name = "langfuse_postgres_cluster"
  }

  serverlessv2_scaling_configuration {
    max_capacity = var.database_max_capacity
    min_capacity = var.database_min_capacity
  }
}

resource "aws_rds_cluster_instance" "serverless_v2_instance" {
  tags = {
    Name = "serverless_v2_instance"
  }
  cluster_identifier           = aws_rds_cluster.langfuse_aurora_cluster.id
  identifier                   = "serverless-v2-instance"
  instance_class               = "db.serverless"
  engine                       = aws_rds_cluster.langfuse_aurora_cluster.engine
  engine_version               = aws_rds_cluster.langfuse_aurora_cluster.engine_version
  performance_insights_enabled = true

  performance_insights_retention_period = 7

  performance_insights_kms_key_id = aws_kms_key.postgres.arn
}
