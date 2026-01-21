resource "aws_security_group" "langfuse_db" {
  name        = "${local.prefix}-db-sg"
  description = "Access to Langfuse database"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.langfuse_worker.id]
    # security_groups = [aws_security_group.apprunner_vpc_connector.id, aws_security_group.langfuse_worker.id]
    description = "Allow PostgreSQL access from langfuse web and worker"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all traffic out to the internet"
  }

  tags = {
    Name = "langfuse_database_sg"
  }
}

# resource "aws_security_group" "apprunner_vpc_connector" {
#   name = "apprunner-vpc-connector-sg"
#   tags_all = {
#     Name = "apprunner_vpc_connector_sg"
#   }
#   vpc_id = var.vpc_id
#
#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = -1
#     cidr_blocks = ["0.0.0.0/0"]
#     description = "Allow all traffic out to the internet"
#   }
#
#   tags = {
#     Name = "apprunner_vpc_connector_sg"
#   }
# }

resource "aws_security_group" "langfuse_cache" {
  vpc_id      = var.vpc_id
  name        = "${local.prefix}-cache-sg"
  description = "Langfuse Cache Security Group"
  tags = {
    Name = "langfuse_cache_sg"
  }

  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_security_group.langfuse_db.id, aws_security_group.langfuse_worker.id]
    # security_groups = [aws_security_group.apprunner_vpc_connector.id, aws_security_group.langfuse_db.id, aws_security_group.langfuse_worker.id]
    description = "Ingress Allow all traffic from app and flower security groups"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Egress Allow all traffic"
  }
}

resource "aws_security_group" "langfuse_worker" {
  name   = "langfuse-worker-sg"
  vpc_id = var.vpc_id
  tags = {
    Name = "langfuse_worker_sg"
  }

  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = []
    # security_groups = [aws_security_group.apprunner_vpc_connector.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "clickhouse" {
  name   = "${local.prefix}-clickhouse-sg"
  vpc_id = var.vpc_id
  tags = {
    Name = "langfuse_clickhouse_sg"
  }

  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_security_group.langfuse_worker.id]
    # security_groups = [aws_security_group.apprunner_vpc_connector.id, aws_security_group.langfuse_worker.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "efs" {
  name        = "${local.prefix}-efs-clickhouse"
  description = "Allow EFS access from ECS tasks"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 2049
    to_port         = 2049
    protocol        = "tcp"
    security_groups = [aws_security_group.clickhouse.id]
  }
}
