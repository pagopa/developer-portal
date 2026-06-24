# chatbot-evaluate

## 1.1.3

### Patch Changes

- 8faf184: Refactor Vertex AI credential handling to use centralized settings and improve error logging for missing credentials

## 1.1.2

### Patch Changes

- 6a1a271: Migrated the Gemini models initialization from the standard Google AI Studio API to Vertex AI.

## 1.1.1

### Patch Changes

- ca30fea: Update ragas version to make asynchronous evaluations

## 1.1.0

### Minor Changes

- a49b695: Refactor chatbot, chatbot-evaluate and chatbot-monitor to compress and decompress payload from/to AWS SQS

### Patch Changes

- a49b695: Update loggers in chatbot, chatbot-monitor, chatbot-evaluate, and chatbot-index
- a49b695: Refactor of chatbot-evaluate to send the score writing to chatbot-monitor
- f46442d: Remove script folder from Dockerfile
- a49b695: Move presidio and dynamodb functions from chatbot to chatbot-monitor
- a49b695: Run dockerfiles as normal user

## 1.0.5

### Patch Changes

- cb13a14: Fix bug in chatbot evaluate: importing the logger

## 1.0.4

### Patch Changes

- 07d1049: Align settings.py file to chatbot module

## 1.0.3

### Patch Changes

- 612d7d7: align settings file

## 1.0.2

### Patch Changes

- 0d6bb25: Update settings

## 1.0.1

### Patch Changes

- ae75933: Add package.json to the chatbot-evaluate app to allow versioning
