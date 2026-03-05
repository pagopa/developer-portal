/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */ 
import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

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
      "Missing required environment variables. Please check your .env file.",
    );
    process.exit(1);
  }

  const s3 =
    !!region && !!credentials
      ? new S3Client({ region, credentials })
      : new S3Client();

  return s3;
}


export async function putS3File(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any,
  path: string,
  bucketName: string,
  client: S3Client,
): Promise<void> {
  const body = JSON.stringify(items, null, 2);
  console.log(`Uploading file to S3: ${path}`);

  const result = await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: path,
      Body: body,
    }),
  );

  console.log(
    `Uploaded file to S3: ${path}, Result: ${JSON.stringify(result)}`,
  );
}
