resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "Main"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/Lambda", "Errors", "FunctionName", module.cognito_post_confirmation_function.lambda_function_name, { "period" : 300, "stat" : "Sum", "region" : var.aws_region }],
            ["...", module.cognito_custom_message_function.lambda_function_name, { "period" : 300, "stat" : "Sum", "region" : var.aws_region }],
            ["...", module.cognito_verify_auth_challenge_function.lambda_function_name, { "period" : 300, "stat" : "Sum", "region" : var.aws_region }],
            ["...", module.cognito_create_auth_challenge_function.lambda_function_name, { "period" : 300, "stat" : "Sum", "region" : var.aws_region }],
            ["...", module.cognito_define_auth_challenge_function.lambda_function_name, { "period" : 300, "stat" : "Sum", "region" : var.aws_region }]
          ],
          legend = {
            position = "right"
          },
          title    = "Lambda Errors: Sum",
          view     = "timeSeries",
          stacked  = false,
          region   = var.aws_region
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6

        properties = {
          sparkline = false,
          metrics = [
            ["AWS/Cognito", "SignInSuccesses", "UserPool", aws_cognito_user_pool.devportal.id, "UserPoolClient", aws_cognito_user_pool_client.devportal_website.id],
            [".", "SignUpSuccesses", ".", ".", ".", "."],
            [".", "TokenRefreshSuccesses", ".", ".", ".", "."]
          ],
          view    = "timeSeries",
          stacked = false,
          region  = var.aws_region,
          stat    = "SampleCount",
          period  = 300,
          title   = "Cognito"
        }
      }
    ]
  })
}
