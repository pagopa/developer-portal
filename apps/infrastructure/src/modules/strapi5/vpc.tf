data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_vpc" "cms" {
  tags = {
    Name = "cms"
  }
}

data "aws_subnets" "private" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.cms.id]
  }
  tags = {
    Name = "cms_private_*"
  }
}

data "aws_subnets" "public" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.cms.id]
  }
  tags = {
    Name = "cms_public_*"
  }
}

data "aws_subnets" "database" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.cms.id]
  }
  tags = {
    Name = "cms_database_*"
  }
}

data "aws_subnets" "elasticache" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.cms.id]
  }
  tags = {
    Name = "cms_elasticache_*"
  }
}

data "aws_db_subnet_group" "cms" {
  name = "cms"
}

/*
data "aws_vpc_endpoint" "ecr_api" {
  vpc_id       = data.aws_vpc.cms.id
  service_name = "com.amazonaws.${var.aws_region}.ecr.api"
}

data "aws_vpc_endpoint" "ssmmessages" {
  vpc_id       = data.aws_vpc.cms.id
  service_name = "com.amazonaws.${var.aws_region}.ssmmessages"
}

data "aws_vpc_endpoint" "s3" {
  vpc_id       = data.aws_vpc.cms.id
  service_name = "com.amazonaws.${var.aws_region}.s3"
}

*/

data "aws_security_group" "vpc_endpoints" {
  vpc_id = data.aws_vpc.cms.id
  name   = "dev-vpc-endpoints20240827102529812000000001"
}
