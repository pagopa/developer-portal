# active-campaign-client

## 0.4.0

### Minor Changes

- e73c258: Update script adding batch of users and progress logs

### Patch Changes

- 7fabbee: Fix error mangement in sqsQueueHandler

## 0.3.1

### Patch Changes

- 7deef83: Add sync users script

## 0.3.0

### Minor Changes

- 5e861a0: Add resync user handler
- 3f202f7: Refactor resyncUserHandler to align contacts and subscriptions in Active Campaign
- a7e0508: Add SSM client to mange secrets

### Patch Changes

- 4e4933d: Add bulk import of contacts

## 0.2.0

### Minor Changes

- 3239223: Add handler for updating and deleting contact
- 07703f2: Add package setup and the lambda function to add user to Active Campaign
- 3197206: Add handlers for create list and delete list on Active Campaign
- c6a3f41: Refactor active campaign pacakge and create index file

### Patch Changes

- e725bb1: Removed axios, removed .env except than for the test, create new main handler to execute function in aws lambda

## 0.1.1

### Patch Changes

- a899ee5: Create package and add function signatures
