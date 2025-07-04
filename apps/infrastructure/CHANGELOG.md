# infrastructure

## 2.1.2

### Patch Changes

- 0a87d37: Fixed codebuild cicd lambda permissions

## 2.1.1

### Patch Changes

- 13a91da: Change rewriter function code path

## 2.1.0

### Minor Changes

- 10064fe: Scale out ECS cms service in production in order to always have at least 2 tasks running with the possibility to go up till 10.

## 2.0.0

### Major Changes

- 46efed7: Introduce the standalone deployment of the website

### Minor Changes

- e7a23d5: Calls the response evaluation function only if the queries of the day are less than CHB_MAX_DAILY_EVALUATIONS env var.
- 5cc13f4: Extracted chatbot lambda resources from module

### Patch Changes

- 0e8011b: Fix website bucket policy resources
- 1d8988a: add user feedback to PATCH /sessions/{sessionId}/queries/{id} API
- 6061915: insert CHB_AWS_SSM prefix for the env vars whose value is an SSM path
- 7c36bf5: Disable ECS autoscaling in dev

## 1.7.2

### Patch Changes

- d212a8f: Set minimum tls version of cloudfront distributions to TLS 1.2

## 1.7.1

### Patch Changes

- 79e8e16: Add local variable and new script for Matomo tag manager

## 1.7.0

### Minor Changes

- 187a6e5: Removed docs-redirect submodule and getting the cloudfront function code from github
- 7dd971c: Added docs redirect infrastructure

### Patch Changes

- ba335c4: Fixed codebuild cicd lambda permissions
- a2b334d: Added GCP project id ssm parameter

## 1.6.1

### Patch Changes

- 9410de4: Added chatbot env vars to codebuild project

## 1.6.0

### Minor Changes

- 1333a4b: Active campaign resync lambda implemented

### Patch Changes

- cd06c06: Enabled active campaign syncer on prod

## 1.5.0

### Minor Changes

- 2345af9: Implemented llm monitoring with LangFuse

### Patch Changes

- 22aea81: Change ac sync lambda handler to index.sqsQueue
- 8664295: Use the ddb stream event id as message group id in sqs
- 8f7d007: Added environment variables that allow strapi to integrate with active campaign

## 1.4.0

### Minor Changes

- e1f67d6: Implemented active campaign syncer infrastructure
- e623940: Langfuse infrastructure implemented

### Patch Changes

- bbe33fc: Fix img_src CSP directive to see also in Dev the images inserted using production's CMS
- 94ca22c: Added permissions to deploy the ac sync lambdas via GH actions

## 1.3.0

### Minor Changes

- e5e9647: Production deployment enabled

### Patch Changes

- 30fbfe5: Chatbot lambda is now kept warm by invoking it every 3 minutes
- b63169d: Added chatbot cloudwatch dashboards and alarms
- a80753c: Presidio

## 1.2.0

### Minor Changes

- 064366d: Using codebuild for actions demanding high disk usage and private AWS networking

## 1.1.0

### Minor Changes

- d6f0518: Allowing the usage of Google Gemini generation and embedding models

## 1.0.0

### Major Changes

- 506f225: Use the rest api gateway and complete the chatbot backend infrastructure scaffolding

## 0.12.0

### Minor Changes

- 1ef5143: Disabled user sign-up in development environment

## 0.11.0

### Minor Changes

- 61e4f75: Avoid list of medialibrary objects to be served on medialibrary root url

## 0.10.0

### Minor Changes

- afd99d2: create AWS S3 bucket for LLamaIndex

## 0.9.0

### Minor Changes

- b542b9a: Fix otp duration issue

### Patch Changes

- 49afb3f: Changed cognito-functions deployment parameters

## 0.8.0

### Minor Changes

- 4028890: Removed DGS developers IAM users
- 4f58966: Set the validity duration of the MFA code

## 0.7.0

### Minor Changes

- 2411a44: Added GH actions to redeploy latest tag when deploying from CMS

## 0.6.0

### Minor Changes

- 0d7a50b: Fix hosts iam role to allow subscription to webinars (dynamodb permissions)

## 0.5.8

### Patch Changes

- dde3033: [DEV-1616] Created dynamodb table containing webinar subscriptions
- f45acd8: Update devportal_authenticated_user IAM role

## 0.5.7

### Patch Changes

- abb1bd6: Add player.vimeo.com domain to CSP

## 0.5.6

### Patch Changes

- d8c8e9e: Add GOOGLE_OAUTH_REDIRECT_URI env

## 0.5.5

### Patch Changes

- 54224ae: [DEV-1464] Ignore changes on task definition

## 0.5.4

### Patch Changes

- a7f9bc5: [DEV-1574] Increase `desired_count` of cms-ecs in production

## 0.5.3

### Patch Changes

- aa4766a: [DEV-1562] Fix cms task definition template secret values about login with google on the cms

## 0.5.2

### Patch Changes

- 93deedc: [DEV-1562] Move parameters to secrets section to fix issue about login with google on strapi

## 0.5.1

### Patch Changes

- df5ee9e: [DEV-1562] Add cms*google*\* parameters to ecs_task_execution role

## 0.5.0

### Minor Changes

- 2ba6415: Add OAuth parameters to allow login using Google accounts
- d966a41: Link metric alarms to a SNS topic

## 0.4.0

### Minor Changes

- 726ff18: Create SNS topic and subscription for cloudwatch metric alarms

## 0.3.2

### Patch Changes

- 0ba22dd: Allow fetching images from DevPortal subdomains

## 0.3.1

### Patch Changes

- ecf2fc4: Update CDN url using the new DNS in task definition
- 6be6508: Configure a CDN alias and add a DNS A record to ensure the DNS is accessible

## 0.3.0

### Minor Changes

- b4f0221: Create DNS for CMS Media Library and link it to the CDN

## 0.2.0

### Minor Changes

- 60e0be7: [DEV-1489] - Add Active Campaign records

## 0.1.2

### Patch Changes

- fd08262: [DEV-1525] Enable auto_minor_version_upgrade to cms database

## 0.1.1

### Patch Changes

- 4742742: Fix deploy_infra workflow, moving working_directory to single step

## 0.1.0

### Minor Changes

- f250a26: Move the infrastructure within the monorepo (`apps/infrastructure`)

### Patch Changes

- e1c3796: [DEV-1503] Add googleusercontent to trusted domains in img-src within CSP
