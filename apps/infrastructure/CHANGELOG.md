# infrastructure

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
