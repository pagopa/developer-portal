# PagoPA Chatbot

This folder contains all the details to build a RAG using the documentation provided in [`PagoPA Developer Portal`](https://developer.pagopa.it/).

This chatbot uses [Google](https://ai.google.dev/) as provider, indeed the LLM and the embedder chosen are part of the [Gemini](https://ai.google.dev/gemini-api/docs/models) family.
Even though the provider is Google, we stored its Gemini API key in the AWS SSM parameter store. So, be sure to have installed [aws-cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and stored your credential in `~/.aws/credentials`.

The multi agentic system and the Retrieval-Augmented Generation (RAG) tools are implemented using [llama-index](https://docs.llamaindex.ai/en/stable/). All the environmental variables, parameters, and prompts are listed and loaded in `src/modules/settings.py`.

The monitoring is done using [Langfuse](https://langfuse.com/) deployed on AWS.

## Environment Variables

Create a `.env` file inside this folder and store the environment variables listed in `.env.example`.

cp .env.example .env

Note that the variables inside `.env` file should be pointing to the AWS infrastructure.

## Virtual environment

Before creating your virtual environment, install [Miniconda](https://docs.anaconda.com/miniconda/#quick-command-line-install) and [Poetry](https://python-poetry.org/docs/main#installation) on your device.

Once you are ready, create your virtual conda environment:

    conda create -n chatbot python=3.12 -y
    conda activate chatbot

In the end, install the requirements:

    poetry install

## Docker

The Docker Compose is set to emulate the deployed application in AWS. The infrastructure uses three AWS lambdas:

- **AWS lambda API**: receive the user's question and return the generated answer;
- [**AWS lambda Monitor**](../chatbot-monitor/README.md): receive a payload from the **AWS lambda API** and creates a trace in Langfuse and stores in DynamoDB the chat history.
- [**AWS lambda Evaluate**](../chatbot-evaluate/README.md): receive a payload from the **AWS lambda Monitor**, calculates the answer-relancy, the context precision, and the faithfulness between user's question, the generated answer, and the retrieved context. Successively this lambda send back a payload to the **AWS lambda Monitor** that stores such scores in Langfuse in the relative trace.

![Architecture-flow-diagram](./images/flow-diagram.png)

Moreover, there is a fourth AWS lambda, the [**AWS lambda Refresh Index**](../chatbot-index/README.md), which is triggered when a file in AWS S3 is added, updated, opr removed. It refreshes the vector index by scraping the documentation and updating the Redis store.

### Getting started

In order to run the chatbot locally for the first time, you need to:

- install [Docker Compose](https://docs.docker.com/compose/install/),
- create local files and fill it in with your environment variables:

```
cp .env.example .env.local
```

- if you want to use Google as provider, `PROVIDER=google`, you need to create a Google service account (see this [page](https://docs.cloud.google.com/iam/docs/keys-create-delete)), export it into a JSON file, and stored in this folder as `.google_service_account.json`. Otherwise set the provider as `PROVIDER=mock`.

- Build the Docker compose:

```bash
./docker/docker-compose-build-api.sh
```

Now you can start the API running:

```
./docker/docker-compose-up-api.sh
```

Note that there is the docker compose service `redis-seed` that load in Redis a small vector-index stored in `./docker/files/redis-data/redis-dump.rdb`. If you want to create a vector index of yours, check out the docker compose service `create-index`, store your files accordingly and run:

```bash
./docker/docker-compose-run-create_index.sh
```

In the end, if you need to work with `jupyter-lab` and test yourself the chatbot components, you can run:

```bash
./docker/docker-compose-run-jupyter.sh
```

When you're done, shut down all the containers with:

```bash
./docker/docker-compose-down-api.sh
```

### Test

Build the Docker Compose for the tests with:

```bash
docker compose -f docker/compose.test.yaml -p chatbot-test build
```

Sucessively, run:

```bash
./docker/docker-compose-run-tests.sh
```

If you want to run only a subset of tests, enter into the container bash

```bash
docker compose -f docker/compose.test.yaml -p chatbot-test run bash
```

Initialize dynamodb and redis (these are the first two steps of `./scripts/run.test.sh`):

```bash
./scripts/dynamodb-init-test.sh
poetry run python src/modules/create_vector_index.py
```

then launch a test, ex

```bash
poetry run pytest src/app/routers/test_sessions.py::test_query_feedback
```

When you're done, shut down all the containers with:

```bash
./docker/docker-compose-down-tests.sh
```
