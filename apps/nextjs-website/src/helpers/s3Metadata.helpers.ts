import { credentials } from '@/config';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: credentials,
});
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'your-bucket-name';

export interface JsonMetadata {
  readonly path: string;
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
    return [];
  }
}
