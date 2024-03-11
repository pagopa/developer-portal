# RDS Aurora PostgreSQL Serverless for CMS Strapi
module "cms_rds" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-rds-aurora.git?ref=7bf5933100eb355b13854232e5d63c62ea7cad35" # v9.0.0

  name                        = "cms-database"
  engine                      = "aurora-postgresql"
  engine_mode                 = "provisioned"
  engine_version              = "14.6"
  database_name               = "strapidb"
  master_username             = "postgres"
  master_password             = module.secret_cms_database_password.value
  vpc_id                      = module.vpc.vpc_id
  db_subnet_group_name        = module.vpc.database_subnet_group_name
  vpc_security_group_ids      = [aws_security_group.cms_database.id]
  apply_immediately           = true
  skip_final_snapshot         = true
  manage_master_user_password = false
  backup_retention_period     = 1

  serverlessv2_scaling_configuration = {
    min_capacity = 0.5
    max_capacity = 1
  }

  instance_class = "db.serverless"
  instances = {
    one = {}
  }
}