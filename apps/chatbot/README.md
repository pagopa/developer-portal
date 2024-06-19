# PagoPA Chatbot

This folder contains all the details to run a RAG using the documentation provided in [PagoPA DevPortal](https://developer.pagopa.it/).

This chatbot uses [AWS Bedrock](https://aws.amazon.com/bedrock/) as provider, so be sure to have installed [aws-cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and stored your credential in `~/.aws/credentials`.

All the parameters used to build the Retrieval-Augmented Generation (RAG) arem stored in `params.yaml`.

## Virtual environment

Create your virtual environment as:

    conda create -n chatbot python=3.12 -y
    conda activate chatbot

and install [Poetry](https://python-poetry.org/docs/main#installation) on it. Sucessively, install the requirements simply doing:

    poetry install

## Set python path

    export PYTHONPATH=$PWD

## Create the knowledge vector database

    python src/modules/create_vector_index.py --params params.yaml

This script reads the documentation, spit it in chucks with gerarchical organization and stores it. Have a look at the parameters in `params.yaml`.

## Web App

    python src/app/app.py

This scripts uses [Gradio](https://www.gradio.app/) framework to lunch a web application at the [default link](http://127.0.0.1:7860) where the user can interact with the created RAG.
