# chatbot

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
