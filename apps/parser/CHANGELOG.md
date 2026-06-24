# parser

## 1.2.0

### Minor Changes

- 8e394d9: Add dockerization

### Patch Changes

- 8e394d9: Remove obsolete option to run locally without docker.

## 1.1.0

### Minor Changes

- 9cf7286: Resolve circular dependencies
- 787e240: Fix sitemap-parsing test error
- aeda3ad: Add sitemap parsing functions to parser app

### Patch Changes

- dc13f43: Fix puppeteer setup and update add_knowledge_base workflow
- ddf2929: Resolve redundant page navigation
- 213b564: Add functionality to save parsed JSON files in an S3 bucket, to be specified as environment variable

## 1.0.0

### Major Changes

- fdd5148: Add script to perform parsing to parser app. Store parsed information locally. Sanitize urls in filesystem compatible format to use as file names.

### Minor Changes

- b0e24b9: Fix parser tests

## 0.2.0

### Minor Changes

- 2413ea1: Create parser app
- 24b1e72: Add Puppeteer to parser app
