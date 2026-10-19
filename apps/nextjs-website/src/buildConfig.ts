import * as E from 'fp-ts/lib/Either';
import type { StrapiConfig } from './lib/strapi/strapiConfig';

export const buildSettings = (env: Record<string, string | undefined>) => {
  const process = { env };
  const STRAPI_ENDPOINT = env.STRAPI_ENDPOINT;
  const STRAPI_API_TOKEN = env.STRAPI_API_TOKEN;
  const docsPath = process.env.PATH_TO_GITBOOK_DOCS;
  const secrets = process.env.secrets ? JSON.parse(process.env.secrets) : {};
  const s3DocsPath =
    secrets.S3_PATH_TO_GITBOOK_DOCS || process.env.S3_PATH_TO_GITBOOK_DOCS;
  const credentials =
    (secrets.S3_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID) &&
    (secrets.S3_SECRET_ACCESS_KEY || process.env.S3_SECRET_ACCESS_KEY)
      ? {
          accessKeyId: secrets.S3_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID,
          secretAccessKey:
            secrets.S3_SECRET_ACCESS_KEY || process.env.S3_SECRET_ACCESS_KEY,
          sessionToken:
            secrets.S3_SESSION_TOKEN || process.env.S3_SESSION_TOKEN,
        }
      : undefined;
  const bucketName = process.env.S3_BUCKET_NAME || secrets.S3_BUCKET_NAME;
  const environment = process.env.ENVIRONMENT;
  const staticContentsUrl = process.env.STATIC_CONTENTS_URL;
  const baseUrl =
    env.NEXT_PUBLIC_WEBSITE_BASE_URL || 'https://developer.pagopa.it';
  const SITEMAP_URL = env.SITEMAP_URL || `${baseUrl}/sitemap.xml`;
  const S3_SITEMAP_PATH = env.S3_SITEMAP_PATH || 'sitemap.xml';
  const S3_PRODUCTS_METADATA_JSON_PATH =
    env.S3_PRODUCTS_METADATA_JSON_PATH || 'synced-products-response.json';
  const S3_APIS_DATA_METADATA_JSON_PATH =
    env.S3_APIS_DATA_METADATA_JSON_PATH || 'synced-apis-data-response.json';
  const LOCALE = env.LOCALE || 'it';
  const OPTIONAL_LOCALE = env.LOCALE;
  const CDN_RETRY_ATTEMPTS = parseInt(env.CDN_RETRY_ATTEMPTS || '3', 10);
  const CDN_RETRY_DELAY_MS = parseInt(env.CDN_RETRY_DELAY_MS || '1000', 10);
  const TIMEOUT_LIMIT = parseInt(env.TIMEOUT_LIMIT || '30000');
  const S3_METADATA_JSON_PATH = env.S3_METADATA_JSON_PATH || 'metadata.json';
  const S3_SOAP_API_METADATA_JSON_PATH =
    env.S3_SOAP_API_METADATA_JSON_PATH || 'soap-api/soap-api-metadata.json';
  const S3_PATH_TO_GITBOOK_DOCS =
    env.S3_PATH_TO_GITBOOK_DOCS || 'devportal-docs/docs';
  const DOCUMENTATION_PATH =
    env.DOCUMENTATION_PATH || '../../devportal-docs/docs';
  const URL_PARSING_METADATA_JSON_PATH =
    env.URL_PARSING_METADATA_JSON_PATH || '../../url-parsing-metadata.json';
  const S3_DIRNAMES_JSON_PATH = env.S3_DIRNAMES_JSON_PATH || 'dirNames.json';
  const METADATA_TYPE = (env.METADATA_TYPE || 'all').toLowerCase();
  const GENERATE_URL_METADATA = env.GENERATE_URL_METADATA !== 'false';
  const GENERATE_METADATA = env.GENERATE_METADATA !== 'false';
  const SAVE_STRAPI_RESPONSES = env.SAVE_STRAPI_RESPONSES !== 'false';
  const DIR_NAMES_FILTER = env.DIR_NAMES_FILTER
    ? env.DIR_NAMES_FILTER.split(',').map((name) => name.trim())
    : undefined;
  const S3_MAIN_GUIDE_VERSIONS_DIRNAMES_JSON_PATH =
    env.S3_MAIN_GUIDE_VERSIONS_DIRNAMES_JSON_PATH ||
    'main-guide-versions-dirNames.json';
  const S3_MAIN_GUIDE_VERSIONS_DIRNAMES_TO_REMOVE_JSON_PATH =
    env.S3_MAIN_GUIDE_VERSIONS_DIRNAMES_TO_REMOVE_JSON_PATH ||
    'main-guide-versions-dirNames-to-remove.json';
  const S3_DIRNAME_METADATA_JSON_PATH =
    env.S3_DIRNAME_METADATA_JSON_PATH || 'metadata.json';
  const S3_SOLUTIONS_DIRNAMES_JSON_PATH =
    env.S3_SOLUTIONS_DIRNAMES_JSON_PATH || 'solutions-dirNames.json';
  const S3_RELEASE_NOTES_DIRNAMES_JSON_PATH =
    env.S3_RELEASE_NOTES_DIRNAMES_JSON_PATH || 'release-notes-dirNames.json';
  const S3_REGION = env.NEXT_PUBLIC_COGNITO_REGION;
  const allowCrawler = process.env.ALLOW_CRAWLER === 'true';
  const REVALIDATE_LONG_INTERVAL = 3600; // 1 hour
  const REVALIDATE_SHORT_INTERVAL = 300; // 5 minutes
  return {
    STRAPI_ENDPOINT,
    STRAPI_API_TOKEN,
    docsPath,
    s3DocsPath,
    credentials,
    bucketName,
    environment,
    staticContentsUrl,
    baseUrl,
    SITEMAP_URL,
    S3_SITEMAP_PATH,
    S3_PRODUCTS_METADATA_JSON_PATH,
    S3_APIS_DATA_METADATA_JSON_PATH,
    LOCALE,
    OPTIONAL_LOCALE,
    CDN_RETRY_ATTEMPTS,
    CDN_RETRY_DELAY_MS,
    TIMEOUT_LIMIT,
    S3_METADATA_JSON_PATH,
    S3_SOAP_API_METADATA_JSON_PATH,
    S3_PATH_TO_GITBOOK_DOCS,
    DOCUMENTATION_PATH,
    URL_PARSING_METADATA_JSON_PATH,
    S3_DIRNAMES_JSON_PATH,
    METADATA_TYPE,
    GENERATE_URL_METADATA,
    GENERATE_METADATA,
    SAVE_STRAPI_RESPONSES,
    DIR_NAMES_FILTER,
    S3_MAIN_GUIDE_VERSIONS_DIRNAMES_JSON_PATH,
    S3_MAIN_GUIDE_VERSIONS_DIRNAMES_TO_REMOVE_JSON_PATH,
    S3_DIRNAME_METADATA_JSON_PATH,
    S3_SOLUTIONS_DIRNAMES_JSON_PATH,
    S3_RELEASE_NOTES_DIRNAMES_JSON_PATH,
    S3_REGION,
    allowCrawler,
    REVALIDATE_LONG_INTERVAL,
    REVALIDATE_SHORT_INTERVAL,
  };
};

export type BuildConfig = ReturnType<typeof buildSettings> & {
  readonly FETCH_FROM_STRAPI: boolean;
} & StrapiConfig;

export const makeBuildConfig = (
  env: Record<string, undefined | string>
): E.Either<string, BuildConfig> =>
  (env.FETCH_FROM_STRAPI &&
    env.STRAPI_ENDPOINT &&
    env.STRAPI_API_TOKEN &&
    E.right({
      ...buildSettings(env),
      FETCH_FROM_STRAPI: env.FETCH_FROM_STRAPI === 'true',
      STRAPI_ENDPOINT: env.STRAPI_ENDPOINT,
      STRAPI_API_TOKEN: env.STRAPI_API_TOKEN,
    })) ||
  E.left('Missing environment variables');
