export const getSyncedGuidesResponseJsonPath = () =>
  process.env.SYNCED_GUIDES_RESPONSE_JSON_PATH || 'synced-guides-response.json';

export const getSyncedSolutionsResponseJsonPath = () =>
  'synced-solutions-response.json';

export const getSyncedReleaseNotesResponseJsonPath = () =>
  'synced-release-notes-response.json';

export const getSyncedProductsResponseJsonPath = () =>
  process.env.S3_PRODUCTS_METADATA_JSON_PATH || 'synced-products-response.json';

export const getSyncedApisDataResponseJsonPath = () =>
  process.env.S3_APIS_DATA_METADATA_JSON_PATH ||
  'synced-apis-data-response.json';
