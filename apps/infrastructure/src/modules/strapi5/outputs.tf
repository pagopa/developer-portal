output "vpc" {
  value = {
    id                         = data.aws_vpc.cms.id
    cidr_block                 = data.aws_vpc.cms.cidr_block
    public_subnets             = data.aws_subnets.public.ids
    database_subnets           = data.aws_subnets.database.ids
    private_subnets            = data.aws_subnets.private.ids
    elasticache_subnets        = data.aws_subnets.elasticache.ids
    database_subnet_group_name = data.aws_db_subnet_group.cms.name
  }
}

output "security_groups" {
  value = {
    vpc_endpoints = data.aws_security_group.vpc_endpoints.id
    ecs_tasks     = aws_security_group.ecs_tasks.id
  }
}

output "internal_load_balancer" {
  value = {
    dns_name = aws_route53_record.cms_internal.fqdn
    arn      = module.cms_load_balancer_internal.arn
  }
}