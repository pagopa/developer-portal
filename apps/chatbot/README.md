# PagoPA Chatbot

This folder contains all the details to build a RAG using the documentation provided in [`PagoPA Developer Portal`](https://developer.pagopa.it/).

This chatbot uses [Google](https://ai.google.dev/) or [AWS Bedrock](https://aws.amazon.com/bedrock/) as provider.
Even though the provider is the Google one, we stored its API key in AWS. So, be sure to have installed [aws-cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and stored your credential in `~/.aws/credentials`.

The Retrieval-Augmented Generation (RAG) was implemented using [llama-index](https://docs.llamaindex.ai/en/stable/). All the parameters and prompts used are stored in `config`.

The monitoring is done using [Langfuse](https://langfuse.com/) deployed on AWS.

## Environment Variables

Create a `.env` file inside this folder and store the environment variables listed in `.env.example`.

cp .env.example .env

Note that the envirables inside `.env` file should be pointing to the AWS infrastructure.s

## Virtual environment

Before creating your virtual environment, install [Miniconda](https://docs.anaconda.com/miniconda/#quick-command-line-install) and [Poetry](https://python-poetry.org/docs/main#installation) on your device.

Once you are ready, create your virtual conda environment:

    conda create -n chatbot python=3.12 -y
    conda activate chatbot

In the end, install the requirements:

    poetry install

## Set python path

The working directory is `/developer-portal/apps/chatbot`. So, to set the `PYTHONPATH` to the such path, simply do:

    export PYTHONPATH=$PWD

In this way, `PYTHONPATH` points to where the Python packages and modules are, not where your checkouts are.

## Knowledge index vector database

In order to create the vector index, do:

    python src/modules/create_vector_index.py --params config/params.yaml

This script:

- gets the URLs that are present in the Developer Portal from the `sitemap.xml`,
- reads the static documents (i.e. guides) from `.md` files stored in AWS S3,
- reads the dynamic documents (i.e. webinars) opening a chrome browser,
- splits the fetched documents into chucks,
- creates the vector index,
- stores the vector index in Redis.

Check out the `params` in order to store your vector index accordingly.

## Test

### Chatbot module

In order to test the chatbot and its APIs, run:

    pytest

### API

The working directory is `apps/chatbot`.

In order to run all API test, just launch

```
./docker/docker-compose-run-tests.sh
```

If you want to run only a subset of tests, enter into the container bash

```
docker compose -f docker/compose.test.yaml -p chatbot-test run bash
```

Initialize dynamodb and redis (these are the first two steps of `./scripts/run.test.sh`):

```
./scripts/dynamodb-init-test.sh
poetry run python src/modules/create_vector_index.py
```

then launch a test, ex

```
poetry run pytest src/app/routers/test_sessions.py::test_query_feedback
```

When you're done, shut down all the containers with

```
./docker/docker-compose-down-tests.sh
```

## Docker

In order to run the chatbot locally for the first time, you need to:

- install [Docker Compose](https://docs.docker.com/compose/install/),
- create local files running:

```
cp .env.example .env.local
cp .google_service_account.json.example .google_service_account.json
```

  and fill it in with your environment variables

- run the following bash scripts:

```
./docker/docker-compose-build-api.sh
./docker/docker-compose-run-create_index.sh
```

In this way, the docker images are built and the vector index is stored in Redis.

Now you can start the API running:

```
./docker/docker-compose-up-api.sh
```

Note that the `docker/compose.yaml` needs `.env.local` file with the correct environment variables.

Every time you update the frontend documents, you should to reindex with

```
./docker/docker-compose-run-create_index.sh
```

In the end, if you need to work with `jupyter-lab` and test yourself the chatbot components, you can run:

```
./docker/docker-compose-run-jupyter.sh
```
