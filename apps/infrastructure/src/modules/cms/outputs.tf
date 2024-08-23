output "vpc" {
  value = {
    id               = module.vpc.vpc_id
    public_subnets   = module.vpc.public_subnets
    database_subnets = module.vpc.database_subnets
    private_subnets  = module.vpc.private_subnets
  }
}