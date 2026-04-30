FROM python:3.11-slim@sha256:6d85378d88a19cd4d76079817532d62232be95757cb45945a99fec8e8084b9c2

WORKDIR /app

RUN apt-get update && apt-get install -y awscli && rm -rf /var/lib/apt/lists/*
RUN pip install boto3 requests

COPY scripts/sqs_to_lambda.py scripts/sqs_to_lambda.py
COPY scripts/sqs-init.sh scripts/sqs-init.sh
COPY scripts/sqs_listener_entrypoint.sh scripts/sqs_listener_entrypoint.sh

RUN chmod +x scripts/sqs-init.sh scripts/sqs_listener_entrypoint.sh

RUN groupadd -r appuser && useradd -r -g appuser -u 1000 -d /home/appuser -m appuser
RUN chown -R appuser:appuser /app /home/appuser

ENV HOME=/home/appuser
USER appuser

ENTRYPOINT ["scripts/sqs_listener_entrypoint.sh"]
CMD ["python", "scripts/sqs_to_lambda.py"]
