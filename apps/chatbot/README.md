# PagoPA Chatbot

This folder contains all the details to run a RAG using the documentation provided in [`PagoPA Developer Portal`](https://developer.pagopa.it/).

This chatbot uses [`AWS Bedrock`](https://aws.amazon.com/bedrock/) as provider, so be sure to have installed [`aws-cli`](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and stored your credential in `~/.aws/credentials`.

The documentation is read from ~750 HTML files by [`BeautifulSoup`](https://pypi.org/project/beautifulsoup4/). The retriver chosen is the `Auto Merging Retriver` implemented with [`llama-index`](https://docs.llamaindex.ai/en/stable/).

All the parameters used to build the Retrieval-Augmented Generation (RAG) arem stored in `params.yaml`.

## Virtual environment

Before creating your virtual environment, install [Miniconda](https://docs.anaconda.com/miniconda/#quick-command-line-install) and [Poetry](https://python-poetry.org/docs/main#installation) on your device.

Successively, create your virtual conda environment as:

    conda create -n chatbot python=3.12 -y
    conda activate chatbot

In the end, install the requirements doing:

    poetry install

## Set python path

The working directory is `/developer-portal/apps/chatbot`. So, to set the `PYTHONPATH` to the workdirectory, simply do:

    export PYTHONPATH=$PWD

In this way, `PYTHONPATH` points to where the Python packages and modules are, not where your checkouts are. 

## Create the knowledge vector database

    python src/modules/create_vector_index.py --params params.yaml

This script reads the documentation, split it into chucks with gerarchical organization and stores it in the folder `index`. Have a look at the parameters in `params.yaml` for more details.

## Web App

    python src/app/app.py

This scripts uses [Gradio](https://www.gradio.app/) framework to lunch a web application at the [default link](http://127.0.0.1:7860) where the user can interact with the created RAG. 

Here you can interact with the implemented chatbot.
