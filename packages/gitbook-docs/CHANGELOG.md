# gitbook-docs

## 0.5.1

### Patch Changes

- 8164b76: Add openapi tag parsing

## 0.5.0

### Minor Changes

- 0a87d37: Update sitemap and add metadata generate functions for release-notes and solutions
- 0a87d37: Update render of guide from gitbook
- 0a87d37: Fix json metadata generation skipping SUMMARY files

### Patch Changes

- 0a87d37: Fix absolute url path transform
- 0a87d37: Refactor sitemap generation to use new environment variable for guide metadata path and add script for generating guide metadata from S3 and Strapi.

## 0.4.2

### Patch Changes

- 5b72c01: Add script to add included text in .md files. Update documentation parsing

## 0.4.1

### Patch Changes

- 85736d0: Fix tag file parsing

## 0.4.0

### Minor Changes

- e685237: Add paragraph parsing

## 0.3.1

### Patch Changes

- b3e21b9: Fix heading level to variant
- 04c6ae4: Update doc parsing to show images in tables

## 0.3.0

### Minor Changes

- ea14e69: Fix emoji in guide

## 0.2.1

### Patch Changes

- e6b7263: Remove warnings from build output

## 0.2.0

### Minor Changes

- c84b885: Fix links to Selfcare backoffice
- d16d58b: Add app.gitbook.com domain to regular expression during GitBook docs parsing

## 0.1.0

### Minor Changes

- 5739492: Add SwaggerParameter, SwaggerResponse and SwaggerDescription components

## 0.0.3

### Patch Changes

- 3bd5661: Handle data-size image attribute to support inline image rendering

## 0.0.2

### Patch Changes

- f564577: Fix anchor links parsing
- b2dedb0: Fix br parsing

## 0.0.1

### Patch Changes

- b2f50b8: [DEV-1040] Rendering component OpenAPI Gitbook
- e976969: Update the logic that is used to replace the titles of links from GitBook
- 558d23c: [DEV-863]: Replace URLs host if specified in config
- 7a6ee42: Remove a workaround causing paragraphs to have %p inside tables
