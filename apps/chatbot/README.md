# PagoPA Chatbot

This folder contains all the details to run a RAG using the documentation provided in [`PagoPA Developer Portal`](https://developer.pagopa.it/).

This chatbot uses [`AWS Bedrock`](https://aws.amazon.com/bedrock/) as provider, so be sure to have installed [`aws-cli`](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and stored your credential in `~/.aws/credentials`.

The documentation is made by ~750 HTML files and each file is loaded and read by [`BeautifulSoup`](https://pypi.org/project/beautifulsoup4/). Check out `src/modules/vector_database.py`.

The retriver chosen is the `Auto Merging Retriver` one and it was implemented using [`llama-index`](https://docs.llamaindex.ai/en/stable/). Check out `src/modules/retriever.py`.

All the parameters used to build the Retrieval-Augmented Generation (RAG) arem stored in `params.yaml`.

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

## Create the knowledge vector database

    python src/modules/create_vector_index.py --params params.yaml

This script reads the documentation, split it into chucks with gerarchical organization and stores it in the folder `index`. Have a look at the parameters in `params.yaml` for more details.

## Web App

    python src/app/app.py

This scripts uses [Gradio](https://www.gradio.app/) framework to lunch a web application at the [default link](http://127.0.0.1:7860) where the user can interact with the created chatbot.

Both [`user icon`](https://www.flaticon.com/free-icon/user_1077012) and [`chatbot icon`](https://www.flaticon.com/free-icon/chatbot_8943377) are made by [Freepick](https://www.freepik.com/) and they were downloaded from [Flaticon](https://www.flaticon.com/).
