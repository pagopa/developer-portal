# PagoPA Chatbot

This folder contains all the details to build a multi agentic system with RAG using the documentation provided in [`PagoPA Developer Portal`](https://developer.pagopa.it/).

This chatbot uses [Google](https://ai.google.dev/) as provider, indeed the LLM and the embedder chosen are part of the [Gemini](https://ai.google.dev/gemini-api/docs/models) family.
Even though the provider is Google, we stored its Gemini API key in the AWS SSM parameter store.

The multi agentic system and the Retrieval-Augmented Generation (RAG) tools are implemented using [llama-index](https://docs.llamaindex.ai/en/stable/). All the environmental variables, parameters, and prompts are listed and loaded in `src/modules/settings.py`.



The monitoring is done using [Langfuse](https://langfuse.com/) deployed on AWS.

## Docker

The Docker Compose is set to emulate the deployed application in AWS using [Motoserver](https://docs.getmoto.org/en/latest/). The infrastructure uses three AWS lambdas:

- [**AWS lambda API**](./README.md): receive the user's question and return the generated answer;
- [**AWS lambda Monitor**](../chatbot-monitor/README.md): receive a payload from the **AWS lambda API** and creates a trace in Langfuse and stores in DynamoDB the chat history.
- [**AWS lambda Evaluate**](../chatbot-evaluate/README.md): receive a payload from the **AWS lambda Monitor**, calculates the answer-relancy, the context precision, and the faithfulness between user's question, the generated answer, and the retrieved context. Successively this lambda send back a payload to the **AWS lambda Monitor** that stores such scores in Langfuse in the relative trace.

![Architecture-flow-diagram](./images/flow-diagram.png)

Moreover, there is a fourth AWS lambda, the [**AWS lambda Refresh Index**](../chatbot-index/README.md), which is triggered when a file in AWS S3 is added, updated, or removed. It refreshes the vector index by scraping the documentation and updating the Redis store.

### Getting started

In order to run the chatbot locally for the first time, you need to:

- install [Docker Compose](https://docs.docker.com/compose/install/),
- create local files and fill it in with your environment variables:

```bash
cp .env.example .env.local
```

Remember to do the same for the other services: `chatbot-monitor`, `chatbot-evaluate`, and `chatbot-index`.

- if you want to use Google as provider, `PROVIDER=google`, you need to create a Google service account (see this [page](https://docs.cloud.google.com/iam/docs/keys-create-delete)), export it into a JSON file, and stored in this folder as `.google_service_account.json`. Otherwise set the provider as `PROVIDER=mock`.

- Build the Docker compose:

```bash
./docker/docker-compose-build-api.sh
```

Now you can start the API running:

```bash
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
./docker/docker-compose-build-tests.sh
```

Sucessively, run:

```bash
./docker/docker-compose-run-tests.sh
```

If you want to run only a subset of tests, enter into the container bash:

```bash
docker compose -f docker/compose.test.yaml run bash
```

Initialize AWS services:

```bash
./scripts/run.test.sh
```

To launch a test, for example:

```bash
pytest src/app/routers/test_sessions.py::test_query_feedback
```

When you're done, shut down all the containers with:

```bash
./docker/docker-compose-down-tests.sh
```
