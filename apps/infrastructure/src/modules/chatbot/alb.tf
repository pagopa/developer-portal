# module "load_balancer" {
#   source = "git::https://github.com/terraform-aws-modules/terraform-aws-alb.git?ref=3e9c6cbaf4c1d858c3bbee6f086f0c8ef17522ab" # v9.6.0
#   providers = {
#     aws = aws.eu-south-1
#   }

#   name                  = "${local.prefix}-load-balancer"
#   vpc_id                = var.vpc.id
#   subnets               = var.vpc.public_subnets
#   security_groups       = [aws_security_group.lb.id]
#   internal              = false
#   create_security_group = false
#   load_balancer_type    = "application"

#   listeners = {
#     front_end_http = {
#       port     = 80
#       protocol = "HTTP"
#       redirect = {
#         port        = "443"
#         protocol    = "HTTPS"
#         status_code = "HTTP_301"
#       }
#     }
#     front_end_https = {
#       port            = 443
#       protocol        = "HTTPS"
#       certificate_arn = module.alb_ssl_certificate.acm_certificate_arn
#       fixed_response = {
#         content_type = "text/plain"
#         message_body = "Invalid hostname"
#         status_code  = "401"
#       }

#       rules = {
#         authenticated = {
#           actions = [
#             {
#               type                       = "authenticate-cognito"
#               on_unauthenticated_request = "deny"
#               user_pool_arn              = var.cognito_user_pool.arn
#               user_pool_client_id        = var.cognito_user_pool.client_id
#               user_pool_domain           = var.cognito_user_pool.domain
#             },
#             {
#               type             = "forward"
#               target_group_key = "chatbot-lambda"
#             }
#           ]

#           conditions = [{
#             host_header = {
#               values = ["api.${var.dns_chatbot_hosted_zone.name}"]
#             }
#           }]
#         }
#       }
#     }
#   }

#   target_groups = {
#     chatbot-lambda = {
#       name_prefix              = "chbot-"
#       target_type              = "lambda"
#       target_id                = module.lambda_function.lambda_function_arn
#       attach_lambda_permission = true
#     }
#   }
# }

# resource "aws_security_group" "lb" {
#   provider    = aws.eu-south-1
#   name        = "${local.prefix}-${var.module}-load-balancer"
#   description = "Ingress - Load Balancer"
#   vpc_id      = var.vpc.id

#   ingress {
#     protocol    = "tcp"
#     from_port   = 80
#     to_port     = 80
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   ingress {
#     protocol    = "tcp"
#     from_port   = 443
#     to_port     = 443
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   # https://registry.terraform.io/providers/hashicorp/aws/5.35.0/docs/resources/security_group#recreating-a-security-group
#   lifecycle {
#     create_before_destroy = true
#   }
# }
