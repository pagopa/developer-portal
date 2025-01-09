resource "aws_iam_role" "pipes_role" {
  name = "${local.prefix}-webinar-subscriptions-pipe-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "pipes.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "pipes" {
  name        = "${local.prefix}-webinar-subscriptions-pipe-policy"
  description = "Policy to allow webinar subscriptions pipe to deploy website"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:DescribeStream",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:ListStreams"
        ]
        Effect = "Allow"
        Resource = [
          var.webinar_subscriptions_ddb_stream_arn
        ]
      },
      {
        Action = [
          "sqs:SendMessage"
        ]
        Effect = "Allow"
        Resource = [
          aws_sqs_queue.fifo_queue.arn
        ]
      },
      {
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
        Effect   = "Allow",
        Resource = aws_cloudwatch_log_group.pipe.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "pipes" {
  role       = aws_iam_role.pipes_role.name
  policy_arn = aws_iam_policy.pipes.arn
}

# Lambda function
resource "aws_iam_policy" "lambda_policy" {
  name        = "${local.prefix}-sync-lambda-policy"
  description = "Lambda policy for accessing SQS and logging"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action   = ["sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"],
        Effect   = "Allow",
        Resource = [aws_sqs_queue.fifo_queue.arn, aws_sqs_queue.fifo_dlq_queue.arn, aws_sqs_queue.fifo_resync_dlq_queue.arn]
      },
      {
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
        Effect   = "Allow",
        Resource = "arn:aws:logs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:log-group:*${local.prefix}*"
      },
      {
        Action   = ["ssm:GetParameter", "ssm:GetParameters"]
        Effect   = "Allow"
        Resource = ["arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/ac/*"]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attach" {
  role       = module.lambda_sync.lambda_role_name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_cognito_policy_attach" {
  role       = module.lambda_sync.lambda_role_name
  policy_arn = "arn:aws:iam::aws:policy/AmazonCognitoReadOnly"
}

resource "aws_iam_role_policy_attachment" "lambda_resync_policy_attach" {
  role       = module.lambda_resync.lambda_role_name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_resync_cognito_policy_attach" {
  role       = module.lambda_resync.lambda_role_name
  policy_arn = "arn:aws:iam::aws:policy/AmazonCognitoReadOnly"
}