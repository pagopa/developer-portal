/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { SitemapItem } from '../sitemapItem';
import dotenv from 'dotenv';

// Load environment variables from .env file
export function loadEnvConfig(): { result: 'success' | 'not_found' } {
  try {
    dotenv.config({ path: '.env' });
    return { result: 'success' };
  } catch (error) {
    return { result: 'not_found' };
  }
}

// Function to validate S3 environment variables
export function validateS3Environment(customRequiredVars: string[] = []): {
  missingVars: string[];
  s3BucketName: string;
} {
  // Support both variable names for S3 bucket
  const s3BucketName =
    process.env.S3_BUCKET_NAME || process.env.S3_DOC_EXTRACTION_BUCKET_NAME;

  const missingEnvVars = [...customRequiredVars].filter(
    (varName) => !process.env[varName]
  );

  // Add bucket check separately since we look for either of two names
  if (!s3BucketName) {
    missingEnvVars.push('S3_BUCKET_NAME or S3_DOC_EXTRACTION_BUCKET_NAME');
  }

  if (missingEnvVars.length > 0) {
    console.warn(
      `Warning: Missing S3 environment variables: ${missingEnvVars.join(', ')}`
    );
    console.log('Continuing with available environment variables...');
  }

  return { missingVars: missingEnvVars, s3BucketName: s3BucketName || '' };
}

export function makeS3Client(): S3Client {
  const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
  const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
  const AWS_REGION = process.env.NEXT_PUBLIC_COGNITO_REGION || 'eu-south-1';

  // Create client with credentials if available, otherwise use default credentials
  return !!S3_ACCESS_KEY_ID && !!S3_SECRET_ACCESS_KEY
    ? new S3Client({
        region: AWS_REGION,
        credentials: {
          accessKeyId: S3_ACCESS_KEY_ID,
          secretAccessKey: S3_SECRET_ACCESS_KEY,
        },
      })
    : new S3Client({ region: AWS_REGION });
}

// Function to list all objects in the S3 bucket with a specific prefix
export async function listS3Files(
  prefix: string,
  bucketName: string,
  client: S3Client
): Promise<string[]> {
  console.log(
    `Listing objects in bucket: ${bucketName} with prefix: ${prefix}`
  );

  const objects: string[] = [];
  let continuationToken: string | undefined;

  try {
    do {
      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      });

      const response = await client.send(command);

      if (response.Contents) {
        console.log(`Found ${response.Contents.length} objects.`);
        for (const object of response.Contents) {
          if (object.Key) {
            objects.push(object.Key);
          }
        }
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return objects;
  } catch (error) {
    console.error('Error listing S3 objects:', error);
    return [];
  }
}

// Function to download a file from S3
export async function downloadS3File(
  key: string,
  bucketName: string,
  client: S3Client
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const response = await client.send(command);

    if (!response.Body) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error(`Failed to download file: ${key}`);
    }

    // Convert the readable stream to a string
    const stream = response.Body as Readable;
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks).toString('utf-8');
  } catch (error) {
    console.error(`Error downloading file ${key}:`, error);
    // eslint-disable-next-line functional/no-throw-statements
    throw error;
  }
}

export async function writeSitemapJson(
  items: SitemapItem[],
  jsonPath: string,
  bucketName: string,
  client: S3Client
): Promise<void> {
  const sitemapJson = JSON.stringify(items, null, 2);
  console.log(`Uploading sitemap JSON to S3: ${jsonPath}`);

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: jsonPath,
      Body: sitemapJson,
    })
  );
  console.log(`Uploaded sitemap JSON to S3: ${jsonPath}`);
}
