# chatbot-index

## 2.2.0

### Minor Changes

- 62cbfdf: Lambda refreshes only the modifications in the buckets without considering API and dynamic documents

## 2.1.2

### Patch Changes

- fe24c9a: Replacing the hardcoded product list with a the function in order to consider only products that have the isVisible field equal to True
- eacb45a: Remove documents from the vector index when directories are marked for removal in the main-guide-versions-dirNames-to-remove.json file
- 2e158b8: Update the reading of the metadata files stored in the S3 bucket

## 2.1.1

### Patch Changes

- dfc4d9f: Remove strapi_api_key from chatbot and chatbot-index

## 2.1.0

### Minor Changes

- b6291ed: Add Docker compose for test

## 2.0.2

### Patch Changes

- 07d1049: Align settings.py file to chatbot module

## 2.0.1

### Patch Changes

- 612d7d7: Fix chrome install

## 2.0.0

### Major Changes

- 0d6bb25: Creation new AWS lambda that can add, update, and/or remove documents and the relative nodes from the vector index.

### Patch Changes

- 0d6bb25: Add package.json to the chatbot-index app to allow versioning
- d704bb9: Update document.py to read the synced apis and products in s3
