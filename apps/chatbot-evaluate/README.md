# PagoPA Chatbot Evaluate

This repository contains the evaluation logic. It is designed to run as an AWS Lambda function that calculates RAG (Retrieval-Augmented Generation) metrics.

## Overview

The `chatbot-evaluate` service receives a payload containing the user's question, the generated answer, and the retrieved context. It uses [ragas](https://ragas.io/) to calculate:

- **Answer Relevancy**: Measures how relevant the answer is to the question.
- **Context Precision**: Measures the quality of the retrieved context.
- **Faithfulness**: Measures how much the answer is derived from the retrieved context.

These scores are then sent back to the monitor service to be stored in Langfuse.

## Tech Stack

- **Python**: 3.12
- **LlamaIndex**: For LLM and Embedding interactions.
- **Ragas**: For RAG evaluation metrics.
- **Google Generative AI**: Used as the evaluation provider.

## Gemini

If you wish to use Gemini models, you need to:

- create a project in Google Cloud Platform
- create google service accont and store them into the file `.google_service_account.json`
- ensure that you can use [VertexAI](https://cloud.google.com/vertex-ai?hl=en)

## Environment Variables

Create a `.env.local` file inside this folder and store the necessary environment variables.

```bash
cp .env.example .env.local
```

Note: Ensure you have the necessary Google Cloud service account credentials for Vertex AI and AWS credentials configured.

## Virtual Environment

We use [Poetry](https://python-poetry.org/) for dependency management.

```bash
conda create -n chatbot-evaluate python=3.12 -y
conda activate chatbot-evaluate
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
docker logs -f chatbot-evaluate-1
```

If you edit the code, add a metric, etc, you need to rebuild the this service, simply running:

```bash
cd ../chatbot
docker compose -f docker/compose.yaml build chatbot-evaluate
```

in this way you you rebuild only this service and not all of them.
