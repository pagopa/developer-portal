# chatbot

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
