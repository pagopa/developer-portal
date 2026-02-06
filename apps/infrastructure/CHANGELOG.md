# infrastructure

## 8.1.0

### Minor Changes

- cbff12b: Add Langfuse web v3
- cbff12b: Add RDS instance for Langfuse
- fe78f6a: Fix strapi v5 ecs task role iam policy

## 8.0.0

### Major Changes

- eb00a2f: Update aws terraform provider to version 6.x.x

### Minor Changes

- fcd57c1: Fix some warning popped up after AWS provider migration
- 2f5fd3e: PoC to test option 3 and 4 described in RFC: RFC-DEV 048
- a092bb0: Removed unused IAM user DevPortal
- c103445: Add Langfuse worker to the Fargate task
- 3c512ab: Removed terraform warning for derecation or missed and wrong attribute.

### Patch Changes

- eb00a2f: Update terraform provider to the latest available version.

## 7.1.0

### Minor Changes

- a660a7b: Fix terraform code since the apigateway deployment does not support anymore the attribute stage. Stage is a resource itself.
- 320da57: Removed strapi api key env variable in lambda chatbot
- a639266: New S3 trigger for lambda chatbot index: changes on file main-guide-versions-dirNames-to-remove.json
- ecf7bb9: Temporary infra to host strapiv5 for testing
- 5f5dc68: Update lambda env variables with new gemini models.

## 7.0.0

### Major Changes

- 3799b28: Add new custom field 'survey_accepted' to cognito user

## 6.1.1

### Patch Changes

- 6589094: Fix disable_custom_validator env variable default value

## 6.1.0

### Minor Changes

- e4d1be2: Add ElastiCache resource into the Langfuse module
- 36fdb33: Add S3 bucket into the Langfuse module
- 23e5cdb: Lambda ivs change source and file path
- 795a779: Add RDS instance for Langfuse
- 4ba391b: Add NEXT_PUBLIC_WEBSITE_BASE_URL to website environment variables

### Patch Changes

- 11e4d0f: Create a new Langfuse module. Add the Clickhouse service to ECS.

## 6.0.0

### Major Changes

- 4138d59: New lambda function to notify IVS end of streaming.

## 5.3.0

### Minor Changes

- 1447dad: Strapi env variable disable_custom_validator = var.environment == "dev" ? "True" : "Fasle"
- 2bd346d: Rightsize cpu and memory langfuse ecs task

### Patch Changes

- 2536043: Assignt cors policy to the cloudfront distribution for video streaming

## 5.2.0

### Minor Changes

- 055fea6: Update env variable CHB_MODEL_MAXTOKENS
- a2828db: Dead letter queue for the lambda chabot evaluate.

## 5.1.0

### Minor Changes

- 03f36f7: Lambda evaluate update memori size and env variables.
- 76096c3: ECR chatbot repository tags immutable
- cdda8f5: Change IAM policy to allow lambda api to read static contents from S3
- ffd44ff: Lambda chatbot index update timeout

## 5.0.0

### Major Changes

- 070e4a1: Cloudfront distribution for video streaming
- 3cacbdb: New module that creates aws ivs channels

### Minor Changes

- fea763f: Optional custom domain for cloudfront video streaming distribution

### Patch Changes

- 492fa6c: Use the registry release of the opennext terraform module
- 0d6bb25: Changed CHB_MAX_TOKENS env var to 2048

## 4.0.0

### Major Changes

- d4bc174: New lambda function chatbot reindex

## 3.1.0

### Minor Changes

- c9dfb90: Fix lost configuration with gemini models 2.5
- 3010e2b: Update github action Sync gitdocs to allow to invalidate opennext cloudfront cache invalidation
- f0eafcf: Lambda evaluate errors alarm
- c2ff087: Increased the lambda evaluate timeout from 30 sec to 120 sec
- 9aa6e49: Update lambda runtime from 20 to 22 lambda(s) opennext
- a9113ff: Update lambda functions deprecated runtime
- c896c5f: Refactort and renamed website cloudwatch dashboard.
- ad03523: Fix permissions in static content s3 bucket that allows to list content through cloudfront.

### Patch Changes

- dc43c81: add dynamodb TTL

## 3.0.0

### Major Changes

- 8ea97a0: Change the evaluate sqs queue to ordered fifo.

## 2.1.4

### Patch Changes

- a4a3541: Update references to old secret

## 2.1.3

### Patch Changes

- 9098926: Added permissions on static contents and chatbot lambdas to reindexing iam role
- 9b8abaa: Added ALLOW_CRAWLER env variable to opennext server lambda
- 7baeb0c: Add role for chatbot reindexing action

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
