/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-expression-statements */
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import _ from 'lodash';

export function makeS3Client(): S3Client {
  const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
  const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
  const AWS_REGION = process.env.NEXT_PUBLIC_COGNITO_REGION;

  // Check if required environment variables are set
  if (!S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY) {
    console.error(
      'Missing required environment variables. Please check your .env file.'
    );
    process.exit(1);
  }

  return new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: S3_ACCESS_KEY_ID,
      secretAccessKey: S3_SECRET_ACCESS_KEY,
    },
  });
}

// Function to list all objects in the S3 bucket with a specific prefix
export async function listS3Files(
  suffix: string,
  client: S3Client
): Promise<string[]> {
  const bucketName = process.env.S3_BUCKET_NAME;
  const objects: string[] = [];
  let continuationToken: string | undefined;
  console.log(
    `Listing objects in bucket: ${bucketName} with suffix: ${suffix}`
  );
  // eslint-disable-next-line functional/no-try-statements
  try {
    do {
      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        ContinuationToken: continuationToken,
      });

      const response = await client.send(command);

      if (response.Contents) {
        console.log(`Found ${response.Contents.length} objects.`);
        for (const object of response.Contents) {
          if (object.Key && _.endsWith(object.Key, suffix)) {
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
