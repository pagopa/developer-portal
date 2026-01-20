/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
import { staticContentsUrl } from '@/config';
import * as path from 'node:path';

export interface JsonMetadata {
  readonly path: string;
  readonly dirName: string;
  readonly contentS3Path: string;
  readonly title: string;
  readonly menuS3Path: string;
  readonly version?: string;
  readonly lastModified?: string;
}

export interface SoapApiJsonMetadata {
  readonly dirName: string;
  readonly contentS3Paths: readonly string[];
}

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Retry configuration - configurable via environment variables
const RETRY_ATTEMPTS = parseInt(process.env.CDN_RETRY_ATTEMPTS || '3', 10);
const INITIAL_RETRY_DELAY_MS = parseInt(
  process.env.CDN_RETRY_DELAY_MS || '1000',
  10
);
const TIMEOUT_LIMIT = parseInt(process.env.TIMEOUT_LIMIT || '30000');

async function withRetries<T>(
  operation: () => Promise<T>,
  operationName: string,
  fallbackValue: T
): Promise<T> {
  // eslint-disable-next-line functional/no-let
  let lastError: Error | null = null;

  // eslint-disable-next-line functional/no-loop-statements
  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    // eslint-disable-next-line functional/no-try-statements
    try {
      const result = await operation();

      // Log successful retry if this wasn't the first attempt
      if (attempt > 1) {
        // eslint-disable-next-line no-console
        console.log(
          `Successfully completed ${operationName} on attempt ${attempt}`
        );
      }

      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      // eslint-disable-next-line no-console
      console.error(
        `Error during ${operationName} (attempt ${attempt}/${RETRY_ATTEMPTS}):`,
        error
      );

      // If this isn't the last attempt, wait before retrying
      if (attempt < RETRY_ATTEMPTS) {
        const delayMs = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt - 1); // Exponential backoff
        // eslint-disable-next-line no-console
        console.log(`Retrying in ${delayMs}ms...`);
        await delay(delayMs);
      }
    }
  }

  // eslint-disable-next-line no-console
  console.error(
    `Failed to complete ${operationName} after ${RETRY_ATTEMPTS} attempts:`,
    lastError
  );
  return fallbackValue;
}

export async function downloadFileAsText(
  path: string,
  config?: RequestInit
): Promise<string | undefined> {
  // Create the request promise
  const requestPromise = withRetries(
    async () => {
      const url = `${staticContentsUrl}/${path}`;
      const response = await fetch(url, {
        // Add timeout and other fetch options to prevent hanging
        signal: AbortSignal.timeout(TIMEOUT_LIMIT), // 30 second timeout
        ...config,
      });

      if (!response.ok) {
        // eslint-disable-next-line functional/no-throw-statements
        throw new Error(
          `Failed to download file from ${url}: ${response.statusText}`
        );
      }

      // Read the response body as text
      return await response.text();
    },
    `file download from ${path}`,
    undefined
  ).catch((error) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw error;
  });

  return await requestPromise;
}

async function fetchFromCDN(path: string, config?: RequestInit) {
  if (!staticContentsUrl) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error(
      'STATIC_CONTENTS_URL is not defined in the environment variables.'
    );
  }

  const url = `${staticContentsUrl}/${path}`;
  const response = await fetch(url, {
    // Add timeout and other fetch options to prevent hanging
    signal: AbortSignal.timeout(TIMEOUT_LIMIT), // 30 second timeout
    ...config,
  });

  if (!response || !response.ok) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Response is null');
  }

  return response.json();
}

export async function fetchResponseFromCDN(path: string) {
  // Create the request promise and cache it
  const requestPromise = withRetries(
    async () => {
      return await fetchFromCDN(path, { cache: 'no-store' });
    },
    `response fetch from ${path}`,
    undefined
  ).catch((error) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw error;
  });

  return await requestPromise;
}

export async function fetchMetadataFromCDN<T>(
  path: string
): Promise<readonly T[] | null> {
  // Create the request promise and cache it
  const requestPromise = withRetries(
    async () => {
      const bodyContent = await fetchFromCDN(path, { cache: 'no-store' });
      return bodyContent as readonly T[];
    },
    `metadata fetch from ${path}`,
    null
  ).catch((error) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw error;
  });

  return await requestPromise;
}

const S3_PATH_TO_GITBOOK_DOCS =
  process.env.S3_PATH_TO_GITBOOK_DOCS || 'devportal-docs/docs';
const S3_GUIDES_METADATA_JSON_PATH =
  process.env.S3_GUIDES_METADATA_JSON_PATH || 'guides-metadata.json';
const S3_METADATA_JSON_PATH =
  process.env.S3_METADATA_JSON_PATH || 'metadata.json';
const S3_SOLUTIONS_METADATA_JSON_PATH =
  process.env.S3_SOLUTIONS_METADATA_JSON_PATH || 'solutions-metadata.json';
const S3_RELEASE_NOTES_METADATA_JSON_PATH =
  process.env.S3_RELEASE_NOTES_METADATA_JSON_PATH ||
  'release-notes-metadata.json';
const S3_SOAP_API_METADATA_JSON_PATH =
  process.env.S3_SOAP_API_METADATA_JSON_PATH ||
  'soap-api/soap-api-metadata.json';

let guidesMetadataCache: readonly JsonMetadata[] | null = null;
let solutionsMetadataCache: readonly JsonMetadata[] | null = null;
let releaseNotesMetadataCache: readonly JsonMetadata[] | null = null;
let soapApiMetadataCache: readonly SoapApiJsonMetadata[] | null = null;

// Add timestamp-based cache invalidation
// eslint-disable-next-line functional/no-let
let guidesMetadataCacheTime = 0;

// eslint-disable-next-line functional/no-let
let solutionsMetadataCacheTime = 0;

// eslint-disable-next-line functional/no-let
let releaseNotesMetadataCacheTime = 0;

const METADATA_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const getGuidesMetadata = async (dirName?: string) => {
  const now = Date.now();

  if (
    guidesMetadataCache &&
    now - guidesMetadataCacheTime < METADATA_CACHE_TTL &&
    (!dirName || guidesMetadataCache.some((m) => m.dirName === dirName))
  ) {
    return guidesMetadataCache;
  }

  guidesMetadataCache = await fetchMetadataFromCDN<JsonMetadata>(
    dirName
      ? path.join(S3_PATH_TO_GITBOOK_DOCS, dirName, S3_METADATA_JSON_PATH)
      : S3_GUIDES_METADATA_JSON_PATH
  );
  guidesMetadataCacheTime = now;

  return guidesMetadataCache || [];
};

export const getSolutionsMetadata = async (dirName?: string) => {
  const now = Date.now();

  if (
    solutionsMetadataCache &&
    now - solutionsMetadataCacheTime < METADATA_CACHE_TTL
  ) {
    return solutionsMetadataCache;
  }

  solutionsMetadataCache = await fetchMetadataFromCDN<JsonMetadata>(
    dirName
      ? path.join(S3_PATH_TO_GITBOOK_DOCS, dirName, S3_METADATA_JSON_PATH)
      : S3_SOLUTIONS_METADATA_JSON_PATH
  );
  solutionsMetadataCacheTime = now;

  return solutionsMetadataCache || [];
};

export const getReleaseNotesMetadata = async (dirName?: string) => {
  const now = Date.now();

  if (
    releaseNotesMetadataCache &&
    now - releaseNotesMetadataCacheTime < METADATA_CACHE_TTL
  ) {
    return releaseNotesMetadataCache;
  }

  releaseNotesMetadataCache = await fetchMetadataFromCDN<JsonMetadata>(
    dirName
      ? path.join(S3_PATH_TO_GITBOOK_DOCS, dirName, S3_METADATA_JSON_PATH)
      : S3_RELEASE_NOTES_METADATA_JSON_PATH
  );
  releaseNotesMetadataCacheTime = now;

  return releaseNotesMetadataCache || [];
};

export const getSoapApiMetadata = async () => {
  if (!soapApiMetadataCache) {
    soapApiMetadataCache = await fetchMetadataFromCDN<SoapApiJsonMetadata>(
      S3_SOAP_API_METADATA_JSON_PATH
    );
  }
  return soapApiMetadataCache || [];
};
