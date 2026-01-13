resource "aws_api_gateway_rest_api" "api" {
  name        = "${local.prefix}-rest-api-gateway"
  description = "Chatbot API Gateway"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_deployment" "stage" {
  rest_api_id = aws_api_gateway_rest_api.api.id

  depends_on = [
    aws_api_gateway_integration.chatbot
  ]
}

resource "aws_api_gateway_stage" "api_stage" {
  deployment_id = aws_api_gateway_deployment.stage.id
  rest_api_id   = aws_api_gateway_rest_api.api.id
  stage_name    = var.environment
}

resource "aws_api_gateway_base_path_mapping" "path_mapping" {
  api_id      = aws_api_gateway_rest_api.api.id
  domain_name = aws_api_gateway_domain_name.domain_name.domain_name
  stage_name  = aws_api_gateway_stage.api_stage.stage_name
}

resource "aws_api_gateway_domain_name" "domain_name" {
  domain_name              = "api.${var.dns_chatbot_hosted_zone.name}"
  regional_certificate_arn = module.ssl_certificate.acm_certificate_arn

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_authorizer" "authorizer" {
  name          = "${local.prefix}-cognito-authorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.api.id
  provider_arns = [var.cognito_user_pool.arn]
}

resource "aws_api_gateway_resource" "chatbot" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "chatbot" {
  for_each             = toset(["GET", "POST", "PUT", "PATCH", "DELETE"])
  rest_api_id          = aws_api_gateway_rest_api.api.id
  resource_id          = aws_api_gateway_resource.chatbot.id
  http_method          = each.value
  authorization        = "COGNITO_USER_POOLS"
  authorizer_id        = aws_api_gateway_authorizer.authorizer.id
  authorization_scopes = []

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_method" "chatbot_cors" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.chatbot.id
  http_method   = "OPTIONS"
  authorization = "NONE"
  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_method_settings" "chatbot" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  stage_name  = aws_api_gateway_stage.api_stage.stage_name
  method_path = "*/*"

  settings {
    logging_level      = "INFO"
    data_trace_enabled = true
    metrics_enabled    = true

    throttling_burst_limit = 80
    throttling_rate_limit  = 50
  }
}

resource "aws_api_gateway_integration" "chatbot" {
  for_each                = aws_api_gateway_method.chatbot
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.chatbot.id
  http_method             = aws_api_gateway_method.chatbot[each.key].http_method
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function.chatbot_lambda.arn}/invocations"
  integration_http_method = "POST"
  timeout_milliseconds    = var.api_gateway.integration_timeout_sec * 1000
  request_parameters = {
    "integration.request.path.proxy" = "method.request.path.proxy"
  }
}

resource "aws_api_gateway_integration" "chatbot_cors" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.chatbot.id
  http_method             = aws_api_gateway_method.chatbot_cors.http_method
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function.chatbot_lambda.arn}/invocations"
  integration_http_method = "POST"
  timeout_milliseconds    = var.api_gateway.integration_timeout_sec * 1000
  request_parameters = {
    "integration.request.path.proxy" = "method.request.path.proxy"
  }
}
############
### CORS ###
############
# resource "aws_api_gateway_method" "cors" {
#   rest_api_id   = aws_api_gateway_rest_api.api.id
#   resource_id   = aws_api_gateway_resource.chatbot.id
#   http_method   = "OPTIONS"
#   authorization = "NONE"
# }

# resource "aws_api_gateway_integration" "cors" {
#   rest_api_id      = aws_api_gateway_rest_api.api.id
#   resource_id      = aws_api_gateway_resource.chatbot.id
#   http_method      = aws_api_gateway_method.cors.http_method
#   content_handling = "CONVERT_TO_TEXT"

#   type = "MOCK"

#   request_templates = {
#     "application/json" = "{ \"statusCode\": 200 }"
#   }
# }

# resource "aws_api_gateway_method_response" "cors" {
#   rest_api_id = aws_api_gateway_rest_api.api.id
#   resource_id = aws_api_gateway_resource.chatbot.id
#   http_method = aws_api_gateway_method.cors.http_method
#   status_code = 200

#   response_parameters = {
#     "method.response.header.Access-Control-Allow-Headers" = true,
#     "method.response.header.Access-Control-Allow-Methods" = true,
#     "method.response.header.Access-Control-Allow-Origin"  = true
#   }

#   response_models = {
#     "application/json" = "Empty"
#   }

#   depends_on = [
#     aws_api_gateway_method.cors,
#   ]
# }

# resource "aws_api_gateway_integration_response" "cors" {
#   rest_api_id = aws_api_gateway_rest_api.api.id
#   resource_id = aws_api_gateway_resource.chatbot.id
#   http_method = aws_api_gateway_method.cors.http_method
#   status_code = 200

#   response_parameters = {
#     "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
#     "method.response.header.Access-Control-Allow-Methods" = "'*'",
#     "method.response.header.Access-Control-Allow-Origin"  = "'*'"
#   }

#   depends_on = [
#     aws_api_gateway_integration.cors,
#     aws_api_gateway_method_response.cors,
#   ]
# }

resource "aws_api_gateway_account" "chatbot" {
  cloudwatch_role_arn = aws_iam_role.cloudwatch.arn
}
