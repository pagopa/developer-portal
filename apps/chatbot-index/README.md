# PagoPA Chatbot Index

This repository contains the logic for creating and refreshing the vector index. It handles scraping documentation, parsing content, and updating the Redis vector store.

## Overview

The `chatbot-index` service is responsible for:

- **Scraping**: Using Selenium to crawl the PagoPA Developer Portal and other relevant sources.
- **Parsing**: Converting HTML content to clean text using `html2text`.
- **Indexing**: Creating and updating a vector index in Redis using LlamaIndex.
- **Scheduled Updates**: Running as a lambda to periodically refresh the index with the latest documentation.

## Tech Stack

- **Python**: 3.12
- **LlamaIndex**: For indexing and vector store management.
- **Redis**: As the vector database.
- **Selenium**: For web scraping.
- **html2text**: For parsing HTML to Markdown/text.
- **Boto3**: For interacting with AWS services.

## Environment Variables

Create a `.env.local` file inside this folder and store the necessary environment variables.

```bash
cp .env.example .env.local
```

## Virtual Environment

We use [Poetry](https://python-poetry.org/) for dependency management.

```bash
conda create -n chatbot-index python=3.12 -y
conda activate chatbot-index
poetry install
```

## Creating the Index

To manually trigger the index creation:

```bash
poetry run python src/modules/create_vector_index.py
```

## Docker

This service can be run locally using the Docker Compose setup in the main `chatbot` directory.

To create a new vector index run:

```bash
cd ../chatbot
./docker/docker-compose-run-create-index.sh
```
