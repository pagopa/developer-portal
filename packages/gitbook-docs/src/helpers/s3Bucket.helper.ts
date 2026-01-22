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
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { MetadataItem } from '../metadataItem';

type S3Credentials = {
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  readonly sessionToken?: string;
};

export function makeS3Client(): S3Client {
  const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
  const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
  const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

  const region = process.env.NEXT_PUBLIC_COGNITO_REGION;
  const credentials: S3Credentials | undefined =
    !!S3_ACCESS_KEY_ID && !!S3_SECRET_ACCESS_KEY
      ? {
          accessKeyId: S3_ACCESS_KEY_ID,
          secretAccessKey: S3_SECRET_ACCESS_KEY,
          sessionToken: process.env.S3_SESSION_TOKEN,
        }
      : undefined;

  // Check if required environment variables are set
  if (!S3_BUCKET_NAME) {
    console.error(
      'Missing required environment variables. Please check your .env file.'
    );
    process.exit(1);
  }

  const s3 =
    !!region && !!credentials
      ? new S3Client({ region, credentials })
      : new S3Client();

  return s3;
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

  // eslint-disable-next-line functional/no-try-statements
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
  // eslint-disable-next-line functional/no-try-statements
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

    return Buffer.concat(chunks as Uint8Array[]).toString('utf-8');
  } catch (error) {
    console.error(`Error downloading file ${key}:`, error);
    // eslint-disable-next-line functional/no-throw-statements
    throw error;
  }
}

export async function putS3File(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: MetadataItem[] | any,
  path: string,
  bucketName: string,
  client: S3Client,
  locale?: string
): Promise<void> {
  const body = JSON.stringify(items, null, 2);
  const localizedPath = locale ? `${locale}/${path}` : path;
  console.log(`Uploading file to S3: ${localizedPath}`);

  const result = await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: localizedPath,
      Body: body,
    })
  );

  console.log(
    `Uploaded file to S3: ${localizedPath}, Result: ${JSON.stringify(result)}`
  );
}
export async function deleteS3Directory(
  prefix: string,
  bucketName: string,
  client: S3Client
): Promise<void> {
  console.log(`Deleting directory: ${prefix} from bucket: ${bucketName}`);
  const filesToDelete = await listS3Files(prefix, bucketName, client);

  if (filesToDelete.length === 0) {
    console.log('No file found with given prefix. Nothing to delete.');
    return;
  }

  console.log(`Found ${filesToDelete.length} files to delete.`);

  const objectsToDelete = filesToDelete.map((key) => ({ Key: key }));

  try {
    const batchSize = 1000;
    for (let i = 0; i < objectsToDelete.length; i += batchSize) {
      const batch = objectsToDelete.slice(i, i + batchSize);

      const deleteCommand = new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: {
          Objects: batch,
          Quiet: false, // set to true to disable verbose output
        },
      });

      console.log(
        `Deleting batch ${i / batchSize + 1}/${Math.ceil(
          objectsToDelete.length / batchSize
        )}...`
      );
      const output = await client.send(deleteCommand);

      // Logs specific object errors
      if (output.Errors && output.Errors.length > 0) {
        console.error(
          `There was a problem deleting batch: ${i / batchSize + 1}:`
        );
        output.Errors.forEach((error) => {
          console.error(`- ${error.Key}: ${error.Message}`);
        });
      }
    }

    console.log(`Successfully deleted files under prefix: ${prefix}`);
  } catch (error) {
    console.error(
      `There was an error deleting files under prefix: ${prefix}:`,
      error
    );
    /* eslint-disable functional/no-throw-statements */
    throw error;
  }
}
