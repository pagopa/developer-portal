# gitbook-docs

## 1.8.0

### Minor Changes

- 8324e09: Manage locale as optional param

### Patch Changes

- d9c5d62: Fix parsing of content-ref tag opening and closing in the same line

## 1.7.4

### Patch Changes

- a50ce75: Fix issue with root file generation using dirnames filter

## 1.7.3

### Patch Changes

- fffee8c: Fix check on url to parse
- 5d8e960: Move sitemap generation after the s3 sync

## 1.7.2

### Patch Changes

- 89d22fa: Add validation to skip S3 uploads for empty metadata arrays
- 711e8eb: Fix linting error
- 309541d: Add extraction and S3 upload of solutions and release notes directory names.
- c26b1d7: Fix issue with script parsing www urls

## 1.7.1

### Patch Changes

- 1496d24: Fix replaceEscapedTokensWithBackticks script name

## 1.7.0

### Minor Changes

- aca24cc: Add script to replace escaped tokens with backticks to fix code blocks not parsed correctly

### Patch Changes

- 99974e3: Fix sitemap creation in S3 in optimized sync
- 9adc296: Remove generateSoapApiRepositoriesList script from package

## 1.6.0

### Minor Changes

- c07937e: Add script and workflow to delete old directories from S3 bucket

### Patch Changes

- aa491f6: Remove replaceAll('\\')
- 0cc1935: Add generation of file containing all main versions dirNames

## 1.5.0

### Minor Changes

- 656bd0b: Fix url generation for path with only filename of similar paths

### Patch Changes

- 5885dd7: Add script and action to generate multiple metadata files during sync
- 5885dd7: Sync only provided folders if workflow variable DIR_NAMES_FILTER is set

## 1.4.0

### Minor Changes

- 0237257: Remove unused synced response file

## 1.3.2

### Patch Changes

- cc00738: Rename writeMetadataJson to putS3File, fix sitePathFromLocalPath function by removing docs/dirName from path

## 1.3.1

### Patch Changes

- af1d820: Optimize GitBook sync workflow to reduce API calls and improve performance

## 1.3.0

### Minor Changes

- 5e89e42: Add visibility for h3 heading level

## 1.2.0

### Minor Changes

- 6d0f79a: Add script for strapi response files generation
- f1895e6: Add rendering for new markdown part
- ff133a4: Add populate product use_case_list_page to query for guides and e release notes
- c8c68af: Fix chat message parsing and update markdown parsing
- 9184d73: Add rendering for GitBook Stepper and Step

### Patch Changes

- 9bcaab6: Hotfix for sitemap.xml generation

## 1.1.0

### Minor Changes

- 8e23e7f: Update generate metadata script to add synced response in S3 for solutions and release note

### Patch Changes

- 36db54a: Update storybook version, fix issues with update
- 808b26b: Fix synced response urls with correct populate
- 7058218: Fix UrlParsingItem type

## 1.0.2

### Patch Changes

- d1f3b42: Update parsing to include release notes and solutions
- c3014ee: Fix content ref parsing

## 1.0.1

### Patch Changes

- 1b91366: Update parsing to include release notes and solutions
- 7e7d8ab: Add href tag to parsing, fix wrong parsing if content ref is present, fix parsing for localhost urls

## 1.0.0

### Major Changes

- 6ecfd99: Add script for documentation parsing and update href parsing

### Minor Changes

- 3d233b7: Refactor url parsing on front-end

### Patch Changes

- 6938692: Fix parsing error, Update tests
- b8cc7a8: Fix url parsing to include path with #
- 719c746: Fix parsing for link referencing other guides

## 0.5.2

### Patch Changes

- 1ccab24: Add filters to filter out files from .gitbook/includes
- 2fdcc36: Add check for .gitbook/include files and process exit with code 1 if an error is caught
- 9656cda: Fix generate metadata scripts

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
