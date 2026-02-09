FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y awscli && rm -rf /var/lib/apt/lists/*
RUN pip install boto3 requests

COPY scripts/sqs_to_lambda.py scripts/sqs_to_lambda.py
COPY scripts/sqs-init.sh scripts/sqs-init.sh
COPY scripts/sqs_listener_entrypoint.sh scripts/sqs_listener_entrypoint.sh

RUN chmod +x scripts/sqs-init.sh scripts/sqs_listener_entrypoint.sh

RUN groupadd -r appuser && useradd -r -g appuser -u 1000 appuser
RUN chown -R appuser:appuser /app

USER appuser

ENTRYPOINT ["scripts/sqs_listener_entrypoint.sh"]
CMD ["python", "scripts/sqs_to_lambda.py"]
