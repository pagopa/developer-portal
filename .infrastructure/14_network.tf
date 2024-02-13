## Network VPC and Security Group for CMS Strapi
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
  public_dedicated_network_acl = true
  enable_nat_gateway           = true
  single_nat_gateway           = true
  enable_dns_hostnames         = true
  enable_dns_support           = true
  create_database_subnet_group = true
}

### AWS Security Group ###
# Traffic to the DB should only come from ECS
# Traffic to the ECS cluster should only come from the ALB

resource "aws_security_group" "cms_lb" {
  name        = "cms-lb"
  description = "Ingress - Load Balancer"
  vpc_id      = module.vpc.vpc_id

  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    protocol    = "tcp"
    from_port   = 443
    to_port     = 443
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # https://registry.terraform.io/providers/hashicorp/aws/5.35.0/docs/resources/security_group#recreating-a-security-group
  lifecycle {
    create_before_destroy = true
  }
}

### AWS ECS Security Group ###
# Traffic to the ECS cluster should only come from the ALB
resource "aws_security_group" "ecs_tasks" {
  name        = "cms-ecs-tasks"
  description = "allow inbound access from the ALB only"
  vpc_id      = module.vpc.vpc_id

  ingress {
    protocol        = "tcp"
    from_port       = var.cms_app_port
    to_port         = var.cms_app_port
    security_groups = [aws_security_group.cms_lb.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  ## https://developer.hashicorp.com/terraform/language/meta-arguments/lifecycle#create_before_destroy
  lifecycle {
    create_before_destroy = true
  }
}

### AWS RDS Security Group ###
# Traffic to the DB should only come from ECS
resource "aws_security_group" "cms_database" {
  name        = "cms-database"
  description = "Ingress - RDS instance"
  vpc_id      = module.vpc.vpc_id

  ingress {
    protocol  = "tcp"
    from_port = 5432
    to_port   = 5432
    security_groups = [
      aws_security_group.ecs_tasks.id
    ]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  ## https://developer.hashicorp.com/terraform/language/meta-arguments/lifecycle#create_before_destroy
  lifecycle {
    create_before_destroy = true
  }
}