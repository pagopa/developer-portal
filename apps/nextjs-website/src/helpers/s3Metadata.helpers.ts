/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
import { staticContentsUrl } from '@/config';

export interface JsonMetadata {
  readonly path: string;
  readonly dirName: string;
  readonly contentS3Path: string;
  readonly title: string;
  readonly menuS3Path: string;
  readonly version?: string;
  readonly lastModified?: string;
}

// Cache S3 file downloads to prevent redundant network calls
const s3FileCache = new Map<string, string>();

export async function downloadFileAsText(
  path: string
): Promise<string | undefined> {
  const url = `${staticContentsUrl}/${path}`;

  // Check cache first
  if (s3FileCache.has(url)) {
    const cached = s3FileCache.get(url);
    return cached;
  }

  // eslint-disable-next-line functional/no-try-statements
  try {
    const response = await fetch(url);

      if (!response.ok) {
        // eslint-disable-next-line functional/no-throw-statements
        throw new Error(
          `Failed to download file from ${url}: ${response.statusText}`
        );
      }

    // Read the response body as text
    const fileContent = await response.text();

    // Cache the result
    s3FileCache.set(url, fileContent);

    return fileContent;
  } catch (error) {
    console.error(`[downloadFileAsText] Error downloading ${path}:`, error);
    return;
  }
}

export async function fetchMetadataFromCDN<T>(
  path: string
): Promise<readonly T[] | null> {
  // Check if we already have a request in progress for this path
  const cacheKey = `fetchMetadataFromCDN:${path}`;
  if (requestCache.has(cacheKey)) {
    const result = await requestCache.get(cacheKey);
    return result;
  }

  // Create the request promise and cache it
  const requestPromise = withRetries(
    async () => {
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
      });

      if (!response.ok) {
        // eslint-disable-next-line functional/no-throw-statements
        throw new Error(
          `Failed to fetch metadata from ${url}: ${response.statusText}`
        );
      }

      const bodyContent = await response.json();
      return bodyContent as readonly T[];
    },
    `metadata fetch from ${path}`,
    null
  ).catch((error) => {
    // On failure, remove from cache to allow retries on subsequent calls
    requestCache.delete(cacheKey);
    // eslint-disable-next-line functional/no-throw-statements
    throw error;
  });

  requestCache.set(cacheKey, requestPromise);
  const result = await requestPromise;
  return result;
}

const S3_GUIDES_METADATA_JSON_PATH =
  process.env.S3_GUIDES_METADATA_JSON_PATH || 'guides-metadata.json';
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

// Add timestamp-based cache invalidation
// eslint-disable-next-line functional/no-let
let guidesMetadataCacheTime = 0;

// eslint-disable-next-line functional/no-let
let solutionsMetadataCacheTime = 0;

// eslint-disable-next-line functional/no-let
let releaseNotesMetadataCacheTime = 0;

const METADATA_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const getGuidesMetadata = async () => {
  const now = Date.now();

  if (
    guidesMetadataCache &&
    now - guidesMetadataCacheTime < METADATA_CACHE_TTL
  ) {
    return guidesMetadataCache;
  }

  guidesMetadataCache = await fetchMetadataFromCDN(
    S3_GUIDES_METADATA_JSON_PATH
  );
  guidesMetadataCacheTime = now;

  return guidesMetadataCache || [];
};

export const getSolutionsMetadata = async () => {
  const now = Date.now();

  if (
    solutionsMetadataCache &&
    now - solutionsMetadataCacheTime < METADATA_CACHE_TTL
  ) {
    return solutionsMetadataCache;
  }

  solutionsMetadataCache = await fetchMetadataFromCDN(
    S3_SOLUTIONS_METADATA_JSON_PATH
  );
  solutionsMetadataCacheTime = now;

  return solutionsMetadataCache || [];
};

export const getReleaseNotesMetadata = async () => {
  const now = Date.now();

  if (
    releaseNotesMetadataCache &&
    now - releaseNotesMetadataCacheTime < METADATA_CACHE_TTL
  ) {
    return releaseNotesMetadataCache;
  }

  releaseNotesMetadataCache = await fetchMetadataFromCDN(
    S3_RELEASE_NOTES_METADATA_JSON_PATH
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
