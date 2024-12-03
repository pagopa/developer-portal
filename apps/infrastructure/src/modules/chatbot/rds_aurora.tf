# RDS Aurora PostgreSQL Serverless for Chatbot Monitoring tool
resource "random_password" "monitoring_database_password" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}


module "rds" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-rds-aurora.git?ref=7bf5933100eb355b13854232e5d63c62ea7cad35" # v9.0.0

  name                        = "${local.prefix}-monitoring-database"
  engine                      = "aurora-postgresql"
  engine_mode                 = "provisioned"
  engine_version              = "14"
  auto_minor_version_upgrade  = true
  database_name               = local.monitoring_database_name
  master_username             = "postgres"
  master_password             = random_password.monitoring_database_password.result
  vpc_id                      = var.vpc.id
  db_subnet_group_name        = var.vpc.database_subnet_group_name
  vpc_security_group_ids      = [aws_security_group.monitoring_database.id]
  apply_immediately           = true
  skip_final_snapshot         = true
  manage_master_user_password = false
  backup_retention_period     = 3

  serverlessv2_scaling_configuration = {
    min_capacity = 0.5
    max_capacity = 1
  }

  instance_class = "db.serverless"
  instances = {
    one = {}
  }
}

### AWS RDS Security Group ###
# Traffic to the DB should only come from ECS
resource "aws_security_group" "monitoring_database" {
  name        = "${local.prefix}-monitoring-database-sg"
  description = "Ingress - RDS instance"
  vpc_id      = var.vpc.id

  ingress {
    protocol  = "tcp"
    from_port = 5432
    to_port   = 5432
    security_groups = [
      aws_security_group.monitoring_ecs.id
    ]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  # https://registry.terraform.io/providers/hashicorp/aws/5.35.0/docs/resources/security_group#recreating-a-security-group
  lifecycle {
    create_before_destroy = true
  }
}

module "postgres_url" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/chatbot/monitoring/postgres_url"
  value                = "postgresql://${module.rds.cluster_master_username}:${module.rds.cluster_master_password}@${module.rds.cluster_endpoint}:${module.rds.cluster_port}/${local.monitoring_database_name}"
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}
