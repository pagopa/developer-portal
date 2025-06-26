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

export interface SoapApiJsonMetadata {
  readonly dirName: string;
  readonly contentS3Paths: readonly string[];
}

export async function downloadFileAsText(
  path: string
): Promise<string | undefined> {
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
    return fileContent;
  } catch (error) {
    console.error('Error downloading file:', error);
    return;
  }
}

export async function fetchMetadataFromCDN<T>(
  path: string
): Promise<readonly T[] | null> {
  // eslint-disable-next-line functional/no-try-statements
  try {
    if (!staticContentsUrl) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error(
        'STATIC_CONTENTS_URL is not defined in the environment variables.'
      );
    }
    const response = await fetch(`${staticContentsUrl}/${path}`);
    if (!response.ok) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error(
        `Failed to fetch metadata from ${staticContentsUrl}/${path}: ${response.statusText}`
      );
    }
    const bodyContent = await response.json();
    return bodyContent as readonly T[];
  } catch (error) {
    console.error('Error fetching metadata from CDN:', error);
    return null;
  }
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
let soapApiMetadataCache: readonly SoapApiJsonMetadata[] | null = null;

export const getGuidesMetadata = async () => {
  if (!guidesMetadataCache) {
    guidesMetadataCache = await fetchMetadataFromCDN<JsonMetadata>(
      S3_GUIDES_METADATA_JSON_PATH
    );
  }
  return guidesMetadataCache || [];
};

export const getSolutionsMetadata = async () => {
  if (!solutionsMetadataCache) {
    solutionsMetadataCache = await fetchMetadataFromCDN<JsonMetadata>(
      S3_SOLUTIONS_METADATA_JSON_PATH
    );
  }
  return solutionsMetadataCache || [];
};

export const getReleaseNotesMetadata = async () => {
  if (!releaseNotesMetadataCache) {
    releaseNotesMetadataCache = await fetchMetadataFromCDN<JsonMetadata>(
      S3_RELEASE_NOTES_METADATA_JSON_PATH
    );
  }
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
