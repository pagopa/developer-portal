# strapi-cms

## 3.2.0

### Minor Changes

- 38fc70b: Fix webinar validateSlug on update
- 82b7d4b: Add Active Campaign integration to create and delete lists when creating and deleting webinars

### Patch Changes

- fbd9da8: Refactor move ACTIVE_CAMPAIGN_INTEGRATION_ENABLED env var in getter function
- fb6d962: Fix env variable in lifecycle

## 3.1.1

### Patch Changes

- 63a2efc: Update .env.default files for strapi and nextjs, update README.md

## 3.1.0

### Minor Changes

- fd2e2c5: Remove subtitle attribute from bannerLink component

### Patch Changes

- 2f93d2d: Add environment variable to disable custom validators during Strapi's data transfer

## 3.0.1

### Patch Changes

- 8292b5b: Fix Strapi defaultLimit and maxLimit configurations

## 3.0.0

### Major Changes

- f63974f: Refactor product field and relations

### Minor Changes

- 76a8c58: Add bannerLinks attribute to QuickStartGuide, ApiData, Guide and GuideListPage schemas
- d4386b4: Add product to ApiData
- d5d1038: Add UrlReplaceMap as a single type
- 2465867: Add validation for entities having product, product is required for overview, quick start, api, tutorial, guide

### Patch Changes

- 422b067: Require all entries with a slug field to have it unique
- 4a44693: Remove unique validator from api rest detail component because of strapi bug https://github.com/strapi/strapi/issues/12541

## 2.6.1

### Patch Changes

- bae5f53: Set default value to metaViewport field in Strapi's SEO component

## 2.6.0

### Minor Changes

- e5eba2e: Add Seo component to every entity having a corresponding page

### Patch Changes

- 64292d4: Fix SEO for guide in strapi

## 2.5.0

### Minor Changes

- 9ab42ab: Add CKEditor to Tutorials' parts
- 8ecf996: Add statsSource attribute to Solution's schema in Strapi CMS

## 2.4.0

### Minor Changes

- 6547ed1: Add TutorialListPage collection
- 7378c15: Add bannerLinks attribute to overview schema in Strapi

### Patch Changes

- 13897f4: Fix the maximum number of items in Strapi's features component

## 2.3.0

### Minor Changes

- 883f999: Add guides and guide list page on Strapi
- 157dca5: Fix guide in Strapi
- e5c93b9: Add overview schema to Strapi CMS

### Patch Changes

- cd924b0: Add Product relation and fix relatedLinks attribute type in Overview schema, fix image allowedTypes in Tutorial schema and linkHref type in CardProps schema
- 5ff6c58: Remove unused product relation in guide

## 2.2.0

### Minor Changes

- f910297: Add caseHistories to Solution schema in Strapi

## 2.1.0

### Minor Changes

- d6eff42: Quotes removed from tutorials model, fix issue with tutorial storybook
- fda7539: Add RelatedResources component and add relatedResources attribute to Strapi's Webinar entity
- 280feb7: Add QuestionAndAnswer component and add questionsAndAnswers field to Webinar schema

### Patch Changes

- 6023f15: Set title and text attributes as optional in Alert schema

## 2.0.0

### Major Changes

- c24410c: Add parts on tutorial on CMS
- fc67e9c: Remove incorrect plural from SolutionsListPage on CMS

## 1.1.0

### Minor Changes

- ca97805: Update ApiData model
- 3578c57: Add shortName to Product schema

### Patch Changes

- 9eaa93f: Fix the type of the relations between solutions-products and solutions-webinars
- bc120e3: Add minimum and maximum values on solution's steps

## 1.0.0

### Major Changes

- 2c05ca2: Refactor homepage schema

### Patch Changes

- 49bc1aa: Add introductionToSteps field to Solution's schema

## 0.12.0

### Minor Changes

- 5202a75: Create ApiListPage model
- d21b4d9: Add ApiData to Strapi

### Patch Changes

- 00dfd43: Add features field on SolutionsListPage
- 9b1c6b8: Rename ApiListPage to ApiDataListPage

## 0.11.0

### Minor Changes

- b4b7c2b: Add bannerLinks to solution entity in Strapi

### Patch Changes

- efabae1: Remove bannerLinks and fix CaseHistory type in SolutionsListPage schema

## 0.10.0

### Minor Changes

- 75c2a06: Update solution steps attribute
- 004b483: Add tutorials Strapi side

## 0.9.1

### Patch Changes

- 9892f6b: Fix Strapi relations naming

## 0.9.0

### Minor Changes

- 658e9e3: Add solution to Strapi
- b00f56f: Add support for quickstart guide to Strapi
- 293f5cc: Add solutions list Page

### Patch Changes

- af00272: Add case history to Strapi

## 0.8.0

### Minor Changes

- 9376540: Add Strapi SEO Plugin

### Patch Changes

- b62267e: Add specific eslint config for strapi
- 1871794: Add custom validator for slug uniqueness
- 8bb93da: Update Strapi to version 4.24.2

## 0.7.0

### Minor Changes

- 3bfcac4: Use absolute urls for media saved on Strapi

### Patch Changes

- Updated dependencies [3bfcac4]
  - strapi-provider-upload-custom@0.2.0

## 0.6.0

### Minor Changes

- 04c921f: Rename webinar's field from textContent to bodyContent

### Patch Changes

- d5e8946: Add custom validator on webinar dates
- 813dc35: Add Strapi custom CSP rules

## 0.5.1

### Patch Changes

- d8c8e9e: Add GOOGLE_OAUTH_REDIRECT_URI env

## 0.5.0

### Minor Changes

- c0c2a65: Add subhead to hero slide
- 2ba6415: Enable login to Strapi with Google accounts
- 4bb1086: Add webinars to homepage in Strapi

## 0.4.0

### Minor Changes

- 1ed75ad: Add support for webinars

## 0.3.0

### Minor Changes

- b9e82d4: Add news-item entity and news-showcase component to Strapi CMS
- c981c40: Add Strapi configuration to accept PostgreSQL connections
- ce00c1e: Add Update Static Content plugin to Strapi to trigger static site deployment
- e435919: Add heroSlider to the homepage schema, CallToAction component and HeroSlide component to Strapi

## 0.2.0

### Minor Changes

- 1e4b96e: Set logo as required in product schema
- 68ac9bc: Add Product schema and productsShowcase component to homepage in Strapi CMS

## 0.1.0

### Minor Changes

- b0c18a7: Add Homepage content to strapi and RelatedLinks and Link components
