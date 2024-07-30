# PagoPA Chatbot

This folder contains all the details to build a RAG using the documentation provided in [`PagoPA Developer Portal`](https://developer.pagopa.it/). The retriver chosen is the `Auto Merging Retriver` one and it was implemented using [`llama-index`](https://docs.llamaindex.ai/en/stable/). Check out `src/modules/retriever.py`.

This chatbot uses [`AWS Bedrock`](https://aws.amazon.com/bedrock/) as provider, so be sure to have installed [`aws-cli`](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and stored your credential in `~/.aws/credentials`.

All the parameters and prompts used to build the Retrieval-Augmented Generation (RAG) are available in `config`.

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

## File for Environment Variables

Create a `.env` file inside the folder and write to the file the following environment variables:

    AWS_ACCESS_KEY_ID=...
    AWS_SECRET_ACCESS_KEY=...
    AWS_DEFAULT_REGION=...
    AWS_S3_BUCKET=...
    AWS_GUARDRAIL_ID=...
    AWS_GUARDRAIL_VERSION=...

## Knowledge vector database

First of all, verify that the HTML files that compose the Developer Portal documentation exist in `apps/nextjs-website/out`. If this folder exists, then create the vector index doing:

    python src/modules/create_vector_index.py --params config/params.yaml

This script reads the documentation, split it into chucks with gerarchical organization and stores it in the folder `index` or load it to a S3 bucket.

## Web App

    python src/webapp/app.py

This scripts uses [Gradio](https://www.gradio.app/) framework to lunch a web application at the [default link](http://127.0.0.1:7860) where the user can interact with the chatbot.

Both [`user icon`](https://www.flaticon.com/free-icon/user_1077012) and [`chatbot icon`](https://www.flaticon.com/free-icon/chatbot_8943377) are made by [Freepick](https://www.freepik.com/) and they were downloaded from [Flaticon](https://www.flaticon.com/).
