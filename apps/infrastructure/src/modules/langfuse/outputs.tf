output "service_discovery_endpoint" {
  description = "The private address of the service discovery of langfuse-web"
  value       = "http://${aws_service_discovery_service.langfuse-web.name}.${aws_service_discovery_private_dns_namespace.langfuse.name}:3000"
}


output "load_balancer" {
  description = "The load balancer details"
  value = {
    dns_name = module.langfuse_load_balancer.dns_name,
    zone_id  = module.langfuse_load_balancer.zone_id
  }

}