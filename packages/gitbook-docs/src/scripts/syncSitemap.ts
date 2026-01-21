/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-let */

import { baseUrl } from 'nextjs-website/src/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { makeS3Client } from '../helpers/s3Bucket.helper';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const SITEMAP_URL = process.env.SITEMAP_URL || `${baseUrl}/sitemap.xml`;
const S3_SITEMAP_PATH = process.env.S3_SITEMAP_PATH || 'sitemap.xml';

let s3Client: S3Client | undefined;

async function fetchSitemapXml(): Promise<string> {
  console.log(`Fetching sitemap from ${SITEMAP_URL}...`);
  const response = await fetch(SITEMAP_URL);
  if (!response.ok) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error(
      `Failed to fetch sitemap: ${response.status} ${response.statusText}`
    );
  }
  return await response.text();
}

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = makeS3Client();
  }
  return s3Client;
}

async function main() {
  const sitemapXml = await fetchSitemapXml();

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: `${S3_BUCKET_NAME}`,
      Key: S3_SITEMAP_PATH,
      Body: sitemapXml,
    })
  );
}

main();
