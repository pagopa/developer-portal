module "api_gateway" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-apigateway-v2.git?ref=881eacdacff52b691eff2c80b6bf2998cc8f5f5e" # v5.1.3
  cors_configuration = {
    allow_headers = ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token", "x-amz-user-agent"]
    allow_methods = ["*"]
    allow_origins = ["*"]
  }

  description      = "Chatbot API Gateway"
  fail_on_warnings = false
  name             = "${local.prefix}-api-gateway"

  # Authorizer(s)
  authorizers = {
    cognito = {
      authorizer_type  = "JWT"
      identity_sources = ["$request.header.Authorization"]
      name             = "cognito"
      jwt_configuration = {
        audience = [var.cognito_user_pool.client_id]
        issuer   = "https://${var.cognito_user_pool.endpoint}"
      }
    }
  }

  # Domain Name
  domain_name                 = "*.${var.dns_chatbot_hosted_zone.name}"
  subdomains                  = ["api"]
  create_domain_records       = false
  create_certificate          = false
  domain_name_certificate_arn = module.ssl_certificate.acm_certificate_arn


  # Routes & Integration(s)
  routes = {
    "GET /{proxy+}" = {
      authorization_type = "JWT"
      authorizer_key     = "cognito"

      integration = {
        uri                    = module.lambda_function.lambda_function_arn
        payload_format_version = "2.0"
        timeout_milliseconds   = 30000
      }
    }

    "POST /{proxy+}" = {
      authorization_type = "JWT"
      authorizer_key     = "cognito"

      integration = {
        uri                    = module.lambda_function.lambda_function_arn
        payload_format_version = "2.0"
        timeout_milliseconds   = 30000
      }
    }

    "PUT /{proxy+}" = {
      authorization_type = "JWT"
      authorizer_key     = "cognito"

      integration = {
        uri                    = module.lambda_function.lambda_function_arn
        payload_format_version = "2.0"
        timeout_milliseconds   = 30000
      }
    }

    "PATCH /{proxy+}" = {
      authorization_type = "JWT"
      authorizer_key     = "cognito"

      integration = {
        uri                    = module.lambda_function.lambda_function_arn
        payload_format_version = "2.0"
        timeout_milliseconds   = 30000
      }
    }
  }

  # Stage
  stage_access_log_settings = {
    create_log_group            = true
    log_group_retention_in_days = 7
    format = jsonencode({
      context = {
        domainName              = "$context.domainName"
        integrationErrorMessage = "$context.integrationErrorMessage"
        protocol                = "$context.protocol"
        requestId               = "$context.requestId"
        requestTime             = "$context.requestTime"
        responseLength          = "$context.responseLength"
        routeKey                = "$context.routeKey"
        stage                   = "$context.stage"
        status                  = "$context.status"
        error = {
          message      = "$context.error.message"
          responseType = "$context.error.responseType"
        }
        identity = {
          sourceIP = "$context.identity.sourceIp"
        }
        integration = {
          error             = "$context.integration.error"
          integrationStatus = "$context.integration.integrationStatus"
        }
      }
    })
  }

  stage_default_route_settings = {
    detailed_metrics_enabled = true
    throttling_burst_limit   = 100
    throttling_rate_limit    = 100
  }

  tags = var.tags
}
