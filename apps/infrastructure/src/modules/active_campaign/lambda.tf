
resource "aws_iam_policy" "lambda_policy" {
  name        = "lambda_execution_policy"
  description = "Lambda policy for accessing SQS and logging"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action   = ["sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"],
        Effect   = "Allow",
        Resource = [aws_sqs_queue.fifo_queue.arn, aws_sqs_queue.dlq_queue.arn]
      },
      {
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
        Effect   = "Allow",
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attach" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

# Lambda Function for SQS FIFO
resource "aws_lambda_function" "fifo_processor" {
  function_name = "fifo_processor"
  runtime       = "nodejs18.x" # Update with your runtime
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  s3_bucket     = "your-lambda-bucket"
  s3_key        = "path/to/your/code.zip"
  environment {
    variables = {
      ENV_VAR = "value"
    }
  }
}