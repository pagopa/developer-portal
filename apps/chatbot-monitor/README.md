# PagoPA Chatbot Monitor

This repository contains the monitoring logic. It is designed to run as an AWS Lambda function that handles tracing, chat history storage, and PII masking.

## Overview

The `chatbot-monitor` service is responsible for:

- **Tracing**: Creating and updating traces in [Langfuse](https://langfuse.com/).
- **Chat History**: Storing user queries and bot responses in DynamoDB.
- **PII Masking**: Using [Microsoft Presidio](https://microsoft.github.io/presidio/) to identify and mask Personally Identifiable Information (PII) before storing or tracing.
- **Language Detection**: Detecting the language of the user's input.

## Tech Stack

- **Python**: 3.12
- **Langfuse**: For observability and tracing.
- **Boto3**: For interacting with AWS services (DynamoDB, SQS).
- **Presidio**: For PII analysis and anonymization.

## Environment Variables

Create a `.env.local` file inside this folder and store the necessary environment variables.

```bash
cp .env.example .env.local
```

## Virtual Environment

We use [Poetry](https://python-poetry.org/) for dependency management.

```bash
conda create -n chatbot-monitor python=3.12 -y
conda activate chatbot-monitor
poetry install
```

## Testing

To run tests locally:

```bash
poetry run pytest
```

## Docker

To visualize the logs produced by such service, run:

```bash
docker logs -f chatbot-monitor-1
```

If you edit the code, add a metric, etc, you need to rebuild the this service, simply running:

```bash
cd ../chatbot
docker compose -f docker/compose.yaml build chatbot-monitor
```

in this way you you rebuild only this service and not all of them.
