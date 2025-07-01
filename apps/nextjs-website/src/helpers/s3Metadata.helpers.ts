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

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Retry configuration - configurable via environment variables
const RETRY_ATTEMPTS = parseInt(process.env.CDN_RETRY_ATTEMPTS || '3', 10);
const INITIAL_RETRY_DELAY_MS = parseInt(
  process.env.CDN_RETRY_DELAY_MS || '5000',
  10
);

export async function downloadFileAsText(
  path: string
): Promise<string | undefined> {
  // eslint-disable-next-line functional/no-let
  let lastError: Error | null = null;

  // eslint-disable-next-line functional/no-loop-statements
  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    // eslint-disable-next-line functional/no-try-statements
    try {
      const url = `${staticContentsUrl}/${path}`;
      const response = await fetch(url);

      if (!response.ok) {
        // eslint-disable-next-line functional/no-throw-statements
        throw new Error(
          `Failed to download file from ${url}: ${response.statusText}`
        );
      }

      // Read the response body as text
      const fileContent = await response.text();

      // Log successful retry if this wasn't the first attempt
      if (attempt > 1) {
        console.log(
          `Successfully downloaded file ${url} on attempt ${attempt}`
        );
      }

      return fileContent;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(
        `Error downloading file (attempt ${attempt}/${RETRY_ATTEMPTS}):`,
        error
      );

      // If this isn't the last attempt, wait before retrying
      if (attempt < RETRY_ATTEMPTS) {
        const delayMs = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`Retrying in ${delayMs}ms...`);
        await delay(delayMs);
      }
    }
  }

  console.error(
    `Failed to download file after ${RETRY_ATTEMPTS} attempts:`,
    lastError
  );
  return;
}

export async function fetchMetadataFromCDN(
  path: string
): Promise<readonly JsonMetadata[] | null> {
  // eslint-disable-next-line functional/no-let
  let lastError: Error | null = null;

  // eslint-disable-next-line functional/no-loop-statements
  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    // eslint-disable-next-line functional/no-try-statements
    try {
      if (!staticContentsUrl) {
        // eslint-disable-next-line functional/no-throw-statements
        throw new Error(
          'STATIC_CONTENTS_URL is not defined in the environment variables.'
        );
      }

      const url = `${staticContentsUrl}/${path}`;
      const response = await fetch(url);

      if (!response.ok) {
        // eslint-disable-next-line functional/no-throw-statements
        throw new Error(
          `Failed to fetch metadata from ${url}: ${response.statusText}`
        );
      }

      const bodyContent = await response.json();

      // Log successful retry if this wasn't the first attempt
      if (attempt > 1) {
        console.log(
          `Successfully fetched metadata from ${url} on attempt ${attempt}`
        );
      }

      return bodyContent as readonly JsonMetadata[];
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(
        `Error fetching metadata from CDN (attempt ${attempt}/${RETRY_ATTEMPTS}):`,
        error
      );

      // If this isn't the last attempt, wait before retrying
      if (attempt < RETRY_ATTEMPTS) {
        const delayMs = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`Retrying in ${delayMs}ms...`);
        await delay(delayMs);
      }
    }
  }

  console.error(
    `Failed to fetch metadata from CDN after ${RETRY_ATTEMPTS} attempts:`,
    lastError
  );
  return null;
}

const S3_GUIDES_METADATA_JSON_PATH =
  process.env.S3_GUIDES_METADATA_JSON_PATH || 'guides-metadata.json';
const S3_SOLUTIONS_METADATA_JSON_PATH =
  process.env.S3_SOLUTIONS_METADATA_JSON_PATH || 'solutions-metadata.json';
const S3_RELEASE_NOTES_METADATA_JSON_PATH =
  process.env.S3_RELEASE_NOTES_METADATA_JSON_PATH ||
  'release-notes-metadata.json';

let guidesMetadataCache: readonly JsonMetadata[] | null = null;
let solutionsMetadataCache: readonly JsonMetadata[] | null = null;
let releaseNotesMetadataCache: readonly JsonMetadata[] | null = null;

export const getGuidesMetadata = async () => {
  if (!guidesMetadataCache) {
    guidesMetadataCache = await fetchMetadataFromCDN(
      S3_GUIDES_METADATA_JSON_PATH
    );
  }
  return guidesMetadataCache || [];
};

export const getSolutionsMetadata = async () => {
  if (!solutionsMetadataCache) {
    solutionsMetadataCache = await fetchMetadataFromCDN(
      S3_SOLUTIONS_METADATA_JSON_PATH
    );
  }
  return solutionsMetadataCache || [];
};

export const getReleaseNotesMetadata = async () => {
  if (!releaseNotesMetadataCache) {
    releaseNotesMetadataCache = await fetchMetadataFromCDN(
      S3_RELEASE_NOTES_METADATA_JSON_PATH
    );
  }
  return releaseNotesMetadataCache || [];
};
