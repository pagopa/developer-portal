# PagoPA Chatbot

This folder contains all the details to build a RAG using the documentation provided in [`PagoPA Developer Portal`](https://developer.pagopa.it/).

This chatbot uses [Google](https://ai.google.dev/) or [AWS Bedrock](https://aws.amazon.com/bedrock/) as provider.
Even though the provider is the Google one, we stored its API key in AWS. So, be sure to have installed [aws-cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and stored your credential in `~/.aws/credentials`.

The Retrieval-Augmented Generation (RAG) was implemented using [llama-index](https://docs.llamaindex.ai/en/stable/). All the parameters and prompts used are stored in `config`.

The monitoring is done using [Langfuse](https://langfuse.com/) deployed on AWS.

## Environment Variables

Create a `.env` file inside this folder and store the environment variables listed in `.env.example`.

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

To reach the remote redis instance, it is necessary to open a tunnel:

```
    ./scripts/redis-tunnel.sh
```

Verify that the HTML files that compose the Developer Portal documentation exist in a directory. Otherwise create the documentation. Once you have the documentation directory ready, put its path in `params` and, in the end, create the vector index doing:

```
    python src/modules/create_vector_index.py --params config/params.yaml
```

This script reads the documentation, split it into chucks with gerarchical organization, and stores it on Redis.

Check out the params in order to store your vector index accordingly.

## test

```
pytest
```

## Docker

In order to run the chatbot locally for the first time, you need to:

- install [Docker Compose](https://docs.docker.com/compose/install/)
- create `.env.local` file running:
    cp .env.example .env.local
- run the following bash scripts:

    ./docker/docker-compose-build-local.sh
    ./docker/docker-compose-run-create_index.sh

In this way, the docker images are built and the vector index is stored in Redis. Now you can start the API running:

    ./docker/docker-compose-up-api.sh

Notice that the `docker/compose.yaml` needs `.env.local` file with the correct environment variables.
