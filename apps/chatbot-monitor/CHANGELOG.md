# chatbot-monitor

## 3.0.1

### Patch Changes

- f293978: Fix safe yaml load

## 3.0.0

### Major Changes

- a49b695: Move presidio and dynamodb functions from chatbot to chatbot-monitor

### Minor Changes

- a49b695: Refactor chatbot, chatbot-evaluate and chatbot-monitor to compress and decompress payload from/to AWS SQS

### Patch Changes

- a49b695: Update loggers in chatbot, chatbot-monitor, chatbot-evaluate, and chatbot-index
- a49b695: chatbot code refactor to adapt it to chatbot-monitor
- a49b695: Add chatbot version to langfuse as tag
- a49b695: Move Presidio mask library from chatbot to chatbot-monitor
- a49b695: Run dockerfiles as normal user

## 2.0.1

### Patch Changes

- 07d1049: Align settings.py file to chatbot module

## 2.0.0

### Major Changes

- 9cf6fc2: chatbot-monitor creation
