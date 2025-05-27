/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
import { credentials, region } from '@/config';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client =
  !!region && !!credentials
    ? new S3Client({ region, credentials })
    : new S3Client();
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || '';

export interface JsonMetadata {
  readonly path: string;
  readonly dirName: string;
  readonly contentS3Path: string;
  readonly title: string;
  readonly menuS3Path: string;
  readonly version?: string;
  readonly lastModified?: string;
}

export async function fetchFileFromS3(
  key: string
): Promise<string | undefined> {
  // eslint-disable-next-line functional/no-try-statements
  try {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
      })
    );
    return await response.Body?.transformToString();
  } catch (error) {
    // eslint-disable-next-line functional/no-expression-statements
    console.error('Error fetching File from S3:', error);
    return;
  }
}

export async function fetchMetadataJsonFromS3(
  key: string
): Promise<readonly JsonMetadata[]> {
  // eslint-disable-next-line functional/no-try-statements
  try {
    const bodyContents = await fetchFileFromS3(key);
    if (!bodyContents) {
      return [];
    }

    return JSON.parse(bodyContents) as readonly JsonMetadata[];
  } catch (error) {
    // eslint-disable-next-line functional/no-expression-statements
    console.error('Error fetching metadata from S3:', error);
    return [];
  }
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
    guidesMetadataCache = await fetchMetadataJsonFromS3(
      S3_GUIDES_METADATA_JSON_PATH
    );
  }
  return guidesMetadataCache;
};

export const getSolutionsMetadata = async () => {
  if (!solutionsMetadataCache) {
    solutionsMetadataCache = await fetchMetadataJsonFromS3(
      S3_SOLUTIONS_METADATA_JSON_PATH
    );
  }
  return solutionsMetadataCache;
};

export const getReleaseNotesMetadata = async () => {
  if (!releaseNotesMetadataCache) {
    releaseNotesMetadataCache = await fetchMetadataJsonFromS3(
      S3_RELEASE_NOTES_METADATA_JSON_PATH
    );
  }
  return releaseNotesMetadataCache;
};
