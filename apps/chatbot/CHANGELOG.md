# chatbot

## 5.2.2

### Patch Changes

- 55848bd: Add dignostic logs
- 003845a: Fix bug that load the generated string as a JSON
- 1e90cde: Fix log bug
- 2a9c36f: Remove logs to speed production environment

## 5.2.1

### Patch Changes

- 4bb3a3d: Add monitor.py as refactor of the code

## 5.2.0

### Minor Changes

- e0705a8: Add API documentation to the vector index

### Patch Changes

- 1c942c4: fixed auth JWT decode
- 5483b3d: Fix bug user-feedback on Langfuse
- 4a26f5a: Add a logs format to all the modules scritpts
- 873b4ab: Fix double run of Presidio in Langfuse

## 5.1.0

### Minor Changes

- e7a23d5: Calls the response evaluation function only if the queries of the day are less than CHB_MAX_DAILY_EVALUATIONS env var.
- a76b74f: add reranker in the engine as postprocessor

### Patch Changes

- 4056f09: Save badAnswer field to boolean
- 7409287: Removed similarity postprocessing from the RAG engine
- 1d8988a: add user feedback to PATCH /sessions/{sessionId}/queries/{id} API
- 720f6b5: Sanitize feedback comment with Presidio
- 6061915: insert CHB_AWS_SSM prefix for the env vars whose value is an SSM path
- e7ba94a: Mock AWS SSM in local environment, fix python import errors

## 5.0.0

### Major Changes

- d22015c: Add trace evaluation using ragas framework

### Patch Changes

- 2d35fc4: fix docker scripts and AWS SSM vars put
- b2fcf25: Update chatbot engine including its system prompt
- 290c438: Add jupyter service in the docker compose

## 4.4.0

### Minor Changes

- eca70c0: linting
- 0a549b2: sanitize query input via API, increase login security.

## 4.3.0

### Minor Changes

- 06b5572: use url from env var

## 4.2.0

### Minor Changes

- 1bf3dcf: GET /queries API security fix

## 4.1.0

### Minor Changes

- 2345af9: Implemented llm monitoring with LangFuse

## 4.0.0

### Major Changes

- b594e5f: docker image size
- a80753c: Presidio

### Minor Changes

- cee4135: "Add Presidio to detect and mask PII entities"

## 3.0.0

### Major Changes

- 4569d96: Using Gemini LLM instead one of those provided by AWS

## 2.4.0

### Minor Changes

- d6f0518: Allowing the usage of Google Gemini generation and embedding models

## 2.3.0

### Minor Changes

- a6f52bc: Indexing interpolates the website url of the correct environment

## 2.2.0

### Minor Changes

- afafab3: Moded model to langchain and converted to llama-index, bug fix, use of redis in params

## 2.1.0

### Minor Changes

- b122af5: Updated prompts and parameters.
  Resolved sentence redundancy in the output.
  Corrected at least one reference in the output.
  Enhanced HTML reading functionality, ensuring conversion to Markdown.
  Improved handling of dynamic HTML.
- 8d0d78b: Using Redis as vector store instead of S3

### Patch Changes

- 14684a4: Created safety guardrail on bedrock and hash table for URLs

## 2.0.0

### Major Changes

- a752ae7: Added URLs hash table and update to always return at least one reference link of the documentation

### Patch Changes

- a752ae7: Created safety guardrail on bedrock and hash table for URLs

## 1.1.0

### Minor Changes

- 99eb40d: Updated chatbot prompt with guardrails and vector index saving and loading with S3 bucket

## 1.0.0

### Major Changes

- afd99d2: Add the RAG with evaluation and webapp
