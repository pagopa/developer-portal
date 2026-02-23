# chatbot

## 8.0.0

### Major Changes

- ca49e7f: The Chatbot replies using the same language as the user's question

### Patch Changes

- 2bc17a7: Add language code for product list retrieve from S3 to chatbot settings

## 7.1.5

### Patch Changes

- fe24c9a: Replacing the hardcoded product list with a the function in order to consider only products that have the isVisible field equal to True

## 7.1.4

### Patch Changes

- eacd5eb: Hot fix product list

## 7.1.3

### Patch Changes

- dfc4d9f: Remove strapi_api_key from chatbot and chatbot-index
- e8c4687: Update of the ReAct prompt engineering to always reply in italian keeping a professional tone

## 7.1.2

### Patch Changes

- 5c4d9b6: Set default postgresql password for test

## 7.1.1

### Patch Changes

- 39ab9cf: Let local tests work with Langfuse V3

## 7.1.0

### Minor Changes

- 736a638: Replace Langfuse v2 with Langufuse v3.112.0 in the local environment

### Patch Changes

- 8681c49: fix settings

## 7.0.4

### Patch Changes

- bc6b23c: Remove unused libraries, organize pyproject dependencies in groups
- 612d7d7: test and settings refactor

## 7.0.3

### Patch Changes

- 0d6bb25: Code refactor new chatbot-index lambda
- 60f3fe7: Update docker in .gitingore file

## 7.0.2

### Patch Changes

- df454f2: Fix repetitive score bug in the Langfuse GUI.
- 667674e: populate expiresAt field for sessions and salts tables
- bd27ff2: fix feedback.
- dc43c81: add dynamodb TTL

## 7.0.1

### Patch Changes

- 9b757ab: Remove AWS Bedrock support
- 9b757ab: Code refactor with new gemini models
- 9b757ab: Manage settings in a centralized way

## 7.0.0

### Major Changes

- 8ea97a0: Change the evaluate sqs queue to ordered fifo.

### Patch Changes

- c8dd06f: Bug fix repetitive links and unwanted triple apix

## 6.1.0

### Minor Changes

- 84272d6: Static documentation read from AWS S3, dynamic documentation from sitemap.xml

### Patch Changes

- 7b46882: Extract evaluate feature into a new lambda function

## 6.0.1

### Patch Changes

- 77ebb18: Fix bug in get_final_response() function
- a0a3fa7: Fix Bug key error in react system head str
- eb1d228: Fix bug to make the chatbot to reply always in Italian

## 6.0.0

### Major Changes

- 29518ce: Add ReAct agent

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
