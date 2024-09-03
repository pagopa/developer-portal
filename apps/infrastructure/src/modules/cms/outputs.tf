output "vpc" {
  value = {
    id                  = module.vpc.vpc_id
    cidr_block          = module.vpc.vpc_cidr_block
    public_subnets      = module.vpc.public_subnets
    database_subnets    = module.vpc.database_subnets
    private_subnets     = module.vpc.private_subnets
    elasticache_subnets = module.vpc.elasticache_subnets
  }
}

output "security_groups" {
  value = {
    vpc_endpoints = aws_security_group.vpc_endpoints.id
    ecs_tasks     = aws_security_group.ecs_tasks.id
  }
}