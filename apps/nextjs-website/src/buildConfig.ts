import * as E from 'fp-ts/lib/Either';
import type { StrapiConfig } from './lib/strapi/strapiConfig';

export const buildSettings = (env: Record<string, string | undefined>) => {
  const s3DocsPath = env.S3_PATH_TO_GITBOOK_DOCS;
  const credentials =
    env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY
      ? {
          accessKeyId: env.S3_ACCESS_KEY_ID,
          secretAccessKey: env.S3_SECRET_ACCESS_KEY,
          sessionToken: env.S3_SESSION_TOKEN,
        }
      : undefined;
  const bucketName = env.S3_BUCKET_NAME || '';
  const staticContentsUrl = env.STATIC_CONTENTS_URL;
  const baseUrl =
    env.NEXT_PUBLIC_WEBSITE_BASE_URL || 'https://developer.pagopa.it';
  const CDN_RETRY_ATTEMPTS = parseInt(env.CDN_RETRY_ATTEMPTS || '3', 10);
  const CDN_RETRY_DELAY_MS = parseInt(env.CDN_RETRY_DELAY_MS || '1000', 10);
  const TIMEOUT_LIMIT = parseInt(env.TIMEOUT_LIMIT || '30000');
  const S3_METADATA_JSON_PATH = env.S3_METADATA_JSON_PATH || 'metadata.json';
  const S3_SOAP_API_METADATA_JSON_PATH =
    env.S3_SOAP_API_METADATA_JSON_PATH || 'soap-api/soap-api-metadata.json';
  const S3_PATH_TO_GITBOOK_DOCS =
    env.S3_PATH_TO_GITBOOK_DOCS || 'devportal-docs/docs';
  const S3_REGION = env.NEXT_PUBLIC_COGNITO_REGION || '';
  const allowCrawler = env.ALLOW_CRAWLER === 'true';
  return {
    s3DocsPath,
    credentials,
    bucketName,
    staticContentsUrl,
    baseUrl,
    CDN_RETRY_ATTEMPTS,
    CDN_RETRY_DELAY_MS,
    TIMEOUT_LIMIT,
    S3_METADATA_JSON_PATH,
    S3_SOAP_API_METADATA_JSON_PATH,
    S3_PATH_TO_GITBOOK_DOCS,
    S3_REGION,
    allowCrawler,
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
