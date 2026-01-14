# Use official Python image
FROM python:3.11-slim

WORKDIR /app

RUN pip install boto3

COPY scripts/sqs_lambda_monitor_runner.py scripts/sqs_lambda_monitor_runner.py

CMD ["python", "scripts/sqs_lambda_monitor_runner.py"]
