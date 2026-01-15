# Use official Python image
FROM python:3.11-slim

WORKDIR /app

RUN pip install boto3 requests

COPY scripts/sqs_to_lambda.py scripts/sqs_to_lambda.py

CMD ["python", "scripts/sqs_to_lambda.py"]
