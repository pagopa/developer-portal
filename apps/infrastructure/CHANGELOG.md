# infrastructure

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
