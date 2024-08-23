data "aws_availability_zones" "available" {
  state = "available"
}

module "vpc" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-vpc.git?ref=7666869d9ca7ff658f5bd10a29dea53bde5dc464" # v5.5.1

  name                         = "${local.prefix}-vpc"
  cidr                         = "10.1.0.0/16"
  azs                          = slice(data.aws_availability_zones.available.names, 0, 3)
  private_subnets              = ["10.1.1.0/24", "10.1.2.0/24", "10.1.3.0/24"]
  private_subnet_names         = ["${local.prefix}-${var.module}-private-1", "${local.prefix}-${var.module}-private-2", "${local.prefix}-${var.module}-private-3"]
  public_subnets               = ["10.1.101.0/24", "10.1.102.0/24", "10.1.103.0/24"]
  public_subnet_names          = ["${local.prefix}-${var.module}-public-1", "${local.prefix}-${var.module}-public-2", "${local.prefix}-${var.module}-public-3"]
  database_subnets             = ["10.1.201.0/24", "10.1.202.0/24", "10.1.203.0/24"]
  database_subnet_names        = ["${local.prefix}-${var.module}-database-1", "${local.prefix}-${var.module}-database-2", "${local.prefix}-${var.module}-database-3"]
  public_dedicated_network_acl = true
  enable_nat_gateway           = true
  single_nat_gateway           = true
  enable_dns_hostnames         = true
  enable_dns_support           = true
  create_database_subnet_group = true
}
