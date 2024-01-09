resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "Main"

  dashboard_body = jsonencode({
    widgets = [
      {
        "height" : 1,
        "width" : 24,
        "y" : 0,
        "x" : 0,
        "type" : "text",
        "properties" : {
          "markdown" : "## FE (CDN) \n"
        }
      },
      {
        "height" : 6,
        "width" : 6,
        "y" : 1,
        "x" : 0,
        "type" : "metric",
        "properties" : {
          "timezone" : "UTC",
          "region" : var.aws_region,
          "view" : "timeSeries",
          "stacked" : false,
          "metrics" : [
            ["AWS/CloudFront", "Requests", "Region", "Global", "DistributionId", aws_cloudfront_distribution.website.id, { "region" : "us-east-1" }],
            [".", "FunctionInvocations", "FunctionName", aws_cloudfront_function.website_viewer_request_handler.id, "Region", "Global", { "region" : "us-east-1" }],
          ],
          "title" : "Requests"
        }
      },
      {
        "height" : 6,
        "width" : 6,
        "y" : 1,
        "x" : 6,
        "type" : "metric",
        "properties" : {
          "timezone" : "UTC",
          "region" : var.aws_region,
          "view" : "timeSeries",
          "stacked" : false,
          "metrics" : [
            ["AWS/CloudFront", "FunctionComputeUtilization", "FunctionName", aws_cloudfront_function.website_viewer_request_handler.id, "Region", "Global", { "region" : "us-east-1" }]
          ],
          "legend" : {
            "position" : "right"
          },
          "title" : "Execution time"
        }
      },
      {
        "height" : 6,
        "width" : 6,
        "y" : 1,
        "x" : 12,
        "type" : "metric",
        "properties" : {
          "timezone" : "UTC",
          "region" : var.aws_region,
          "view" : "timeSeries",
          "stacked" : false,
          "metrics" : [
            ["AWS/CloudFront", "4xxErrorRate", "Region", "Global", "DistributionId", aws_cloudfront_distribution.website.id, { "region" : "us-east-1" }],
            [".", "5xxErrorRate", ".", ".", ".", ".", { "region" : "us-east-1" }]
          ],
          "title" : "4xxErrorRate, 5xxErrorRate"
        }
      },
      {
        "height" : 6,
        "width" : 6,
        "y" : 1,
        "x" : 18,
        "type" : "metric",
        "properties" : {
          "timezone" : "UTC",
          "region" : var.aws_region,
          "view" : "timeSeries",
          "stacked" : false,
          "metrics" : [
            ["AWS/CloudFront", "BytesDownloaded", "Region", "Global", "DistributionId", aws_cloudfront_distribution.website.id, { "region" : "us-east-1" }]
          ],
          "title" : "BytesDownloaded"
        }
      },
      {
        "height" : 1,
        "width" : 24,
        "y" : 2,
        "x" : 0,
        "type" : "text",
        "properties" : {
          "markdown" : "## Cognito \n"
        }
      },
      {
        "type" : "metric"
        "y" : 3
        "x" : 0
        "width" : 12
        "height" : 6

        "properties" : {
          "metrics" : [
            ["AWS/Lambda", "Errors", "FunctionName", module.cognito_post_confirmation_function.lambda_function_name, { "period" : 300, "stat" : "Sum", "region" : var.aws_region }],
            ["...", module.cognito_custom_message_function.lambda_function_name, { "period" : 300, "stat" : "Sum", "region" : var.aws_region }],
            ["...", module.cognito_verify_auth_challenge_function.lambda_function_name, { "period" : 300, "stat" : "Sum", "region" : var.aws_region }],
            ["...", module.cognito_create_auth_challenge_function.lambda_function_name, { "period" : 300, "stat" : "Sum", "region" : var.aws_region }],
            ["...", module.cognito_define_auth_challenge_function.lambda_function_name, { "period" : 300, "stat" : "Sum", "region" : var.aws_region }]
          ],
          "legend" : {
            "position" : "right"
          },
          "title" : "Lambda Errors: Sum",
          "view" : "timeSeries",
          "stacked" : false,
          "region" : var.aws_region
        }
      },
      {
        "type" : "metric"
        "y" : 3
        "x" : 12
        "width" : 12
        "height" : 6

        "properties" : {
          "sparkline" : false,
          "metrics" : [
            ["AWS/Cognito", "SignInSuccesses", "UserPool", aws_cognito_user_pool.devportal.id, "UserPoolClient", aws_cognito_user_pool_client.devportal_website.id],
            [".", "SignUpSuccesses", ".", ".", ".", "."],
            [".", "TokenRefreshSuccesses", ".", ".", ".", "."]
          ],
          "view" : "timeSeries",
          "stacked" : false,
          "region" : var.aws_region,
          "stat" : "SampleCount",
          "period" : 300,
          "title" : "Cognito"
        }
      }
    ]
  })
}
