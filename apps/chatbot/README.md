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

## Environment Variables

Create a `.env` file inside this folder and store the environment variables listed in `.env.example`.

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

## Web App

    python src/webapp/app.py

This scripts uses [Gradio](https://www.gradio.app/) framework to lunch a web application at the [default link](http://127.0.0.1:7860) where the user can interact with the chatbot.

Both [`user icon`](https://www.flaticon.com/free-icon/user_1077012) and [`chatbot icon`](https://www.flaticon.com/free-icon/chatbot_8943377) are made by [Freepick](https://www.freepik.com/) and they were downloaded from [Flaticon](https://www.flaticon.com/).
