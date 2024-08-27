data "aws_availability_zones" "available" {
  state = "available"
}

module "vpc" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-vpc.git?ref=7666869d9ca7ff658f5bd10a29dea53bde5dc464" # v5.5.1

  name                         = "cms"
  cidr                         = "10.0.0.0/16"
  azs                          = slice(data.aws_availability_zones.available.names, 0, 3)
  private_subnets              = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnet_names         = ["cms_private_1", "cms_private_2", "cms_private_3"]
  public_subnets               = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  public_subnet_names          = ["cms_public_1", "cms_public_2", "cms_public_3"]
  database_subnets             = ["10.0.201.0/24", "10.0.202.0/24", "10.0.203.0/24"]
  database_subnet_names        = ["cms_database_1", "cms_database_2", "cms_database_3"]
  elasticache_subnets          = ["10.0.211.0/24", "10.0.212.0/24", "10.0.213.0/24"]
  elasticache_subnet_names     = ["cms_elasticache_1", "cms_elasticache_2", "cms_elasticache_3"]
  public_dedicated_network_acl = true
  enable_nat_gateway           = true
  single_nat_gateway           = true
  enable_dns_hostnames         = true
  enable_dns_support           = true
  create_database_subnet_group = true
}

resource "aws_security_group" "vpc_endpoints" {
  name_prefix = "${var.environment}-vpc-endpoints"
  description = "Associated to ECR/s3 VPC Endpoints"
  vpc_id      = module.vpc.vpc_id
}

resource "aws_vpc_endpoint" "ecr_api" {
  vpc_id              = module.vpc.vpc_id
  service_name        = "com.amazonaws.${var.aws_region}.ecr.api"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true

  security_group_ids = [aws_security_group.vpc_endpoints.id]
  subnet_ids         = module.vpc.private_subnets

  tags = {
    "Name" = "${var.environment}-ecr-endpoint"
  }
}