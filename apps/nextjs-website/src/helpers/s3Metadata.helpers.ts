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
  readonly manuS3Path?: string; // check if this is optional
  readonly lastModified?: string;
}

export async function fetchMetadataJsonFromS3(
  key: string
): Promise<readonly JsonMetadata[]> {
  // eslint-disable-next-line functional/no-try-statements
  try {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
      })
    );
    // Convert stream to string
    const bodyContents = await response.Body?.transformToString();
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

export const getGuidesMetadata = async () =>
  await fetchMetadataJsonFromS3(S3_GUIDES_METADATA_JSON_PATH);
export const getSolutionsMetadata = async () =>
  await fetchMetadataJsonFromS3(S3_SOLUTIONS_METADATA_JSON_PATH);
export const getReleaseNotesMetadata = async () =>
  await fetchMetadataJsonFromS3(S3_RELEASE_NOTES_METADATA_JSON_PATH);
