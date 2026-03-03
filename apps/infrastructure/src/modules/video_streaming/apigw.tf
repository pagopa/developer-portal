## API Gateway for webinar metrics ##

resource "aws_api_gateway_rest_api" "webinar_metrics" {
  name        = "${var.project_name}-webinar-metrics-api"
  description = "REST API for webinar metrics"
}

resource "aws_api_gateway_resource" "metrics" {
  rest_api_id = aws_api_gateway_rest_api.webinar_metrics.id
  parent_id   = aws_api_gateway_rest_api.webinar_metrics.root_resource_id
  path_part   = "metrics"
}

resource "aws_api_gateway_method" "metrics_post" {
  rest_api_id      = aws_api_gateway_rest_api.webinar_metrics.id
  resource_id      = aws_api_gateway_resource.metrics.id
  http_method      = "POST"
  authorization    = "NONE"
  api_key_required = true
}

resource "aws_api_gateway_integration" "metrics_lambda" {
  rest_api_id             = aws_api_gateway_rest_api.webinar_metrics.id
  resource_id             = aws_api_gateway_resource.metrics.id
  http_method             = aws_api_gateway_method.metrics_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.webinar_metrics.invoke_arn
}

resource "aws_api_gateway_deployment" "webinar_metrics" {
  rest_api_id = aws_api_gateway_rest_api.webinar_metrics.id

  depends_on = [aws_api_gateway_integration.metrics_lambda]

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.metrics.id,
      aws_api_gateway_method.metrics_post.id,
      aws_api_gateway_integration.metrics_lambda.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "webinar_metrics" {
  deployment_id = aws_api_gateway_deployment.webinar_metrics.id
  rest_api_id   = aws_api_gateway_rest_api.webinar_metrics.id
  stage_name    = var.webinar_metrics_stage_name
}

resource "aws_api_gateway_api_key" "webinar_metrics" {
  name    = "${var.project_name}-webinar-metrics-key"
  enabled = true
}

resource "aws_api_gateway_usage_plan" "webinar_metrics" {
  name = "${var.project_name}-webinar-metrics-plan"

  api_stages {
    api_id = aws_api_gateway_rest_api.webinar_metrics.id
    stage  = aws_api_gateway_stage.webinar_metrics.stage_name
  }

  throttle_settings {
    rate_limit  = 2
    burst_limit = 2
  }

  quota_settings {
    limit  = 100
    period = "DAY"
  }
}

resource "aws_api_gateway_usage_plan_key" "webinar_metrics" {
  key_id        = aws_api_gateway_api_key.webinar_metrics.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.webinar_metrics.id
}

resource "aws_lambda_permission" "apigw_webinar_metrics" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.webinar_metrics.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.webinar_metrics.execution_arn}/*/*"
}