/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable functional/no-throw-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-return-void */
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Environment variables
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_PATH_TO_GITBOOK_DOCS = process.env.S3_PATH_TO_GITBOOK_DOCS || 'docs';
const S3_GUIDE_METADATA_JSON_PATH =
  process.env.S3_GUIDE_METADATA_JSON_PATH || 'guides-metadata.json';
const AWS_REGION = process.env.NEXT_PUBLIC_COGNITO_REGION;

interface SitemapItem {
  path: string;
  dirName: string;
  contentS3Path: string;
  manuS3Path: string;
  title: string;
}

// Check if required environment variables are set
if (!S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY || !S3_BUCKET_NAME) {
  console.error(
    'Missing required environment variables. Please check your .env file.'
  );
  process.exit(1);
}

// Initialize S3 client
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
});

// Function to list all objects in the S3 bucket with a specific prefix
async function listS3Files(prefix: string): Promise<string[]> {
  console.log(
    `Listing objects in bucket: ${S3_BUCKET_NAME} with prefix: ${prefix}`
  );

  const objects: string[] = [];
  let continuationToken: string | undefined;

  // eslint-disable-next-line functional/no-try-statements
  try {
    do {
      const command = new ListObjectsV2Command({
        Bucket: S3_BUCKET_NAME,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      });

      const response = await s3Client.send(command);

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
async function downloadS3File(key: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);

    if (!response.Body) {
      throw new Error(`Failed to download file: ${key}`);
    }

    // Convert the readable stream to a string
    const stream = response.Body as Readable;
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }

    // @ts-ignore
    return Buffer.concat(chunks).toString('utf-8');
  } catch (error) {
    console.error(`Error downloading file ${key}:`, error);
    throw error;
  }
}

// Function to extract title from markdown content
function extractTitleFromMarkdown(content: string): string | undefined {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    let title = titleMatch[1].trim();
    // Remove any emojis or special characters
    title = title.replace(/[\u{1F600}-\u{1F6FF}]/gu, '');
    return title;
  }
  return undefined;
}

// Interface for Strapi guide data
interface StrapiGuide {
  id: number;
  attributes: {
    slug: string;
    title: string;
    product?: {
      data?: {
        attributes?: {
          slug: string;
        };
      };
    };
    versions: {
      id: number;
      main: boolean;
      version: string;
      dirName: string;
    }[];
  };
}

// Function to fetch guides from Strapi
async function fetchStrapiGuides(): Promise<StrapiGuide[]> {
  try {
    console.log('Fetching guides from Strapi...');
    const strapiEndpoint = process.env.STRAPI_ENDPOINT;
    const strapiApiToken = process.env.STRAPI_API_TOKEN;

    if (!strapiEndpoint || !strapiApiToken) {
      console.error('Missing Strapi configuration in environment variables');
      return [];
    }

    // Using pagination with a large page size to fetch all guides in one request
    const response = await fetch(
      `${strapiEndpoint}/api/guides?populate[0]=product&populate[1]=versions&pagination[pageSize]=1000&pagination[page]=1`,
      {
        headers: {
          Authorization: `Bearer ${strapiApiToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch guides: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(
      `Successfully fetched ${data.data?.length || 0} guides from Strapi`
    );
    return data.data || [];
  } catch (error) {
    console.error('Error fetching guides from Strapi:', error);
    return [];
  }
}

function generateUrlPath(
  filePath: string,
  guideSlug: string,
  productSlug: string
): string {
  // Extract the path parts after the directory name
  // Example: docs/0OMsoqOg9GiJ2xusVHMv/suolo-spazi-e-beni-pubblici/segnalazioni-suggerimenti-e-reclami.md
  const parts = filePath.split('/');
  const pathParts = parts.slice(2, parts.length - 1); // Skip "docs/dirName" and remove filename
  const fileName = parts[parts.length - 1].replace('.md', '');

  // Join all path parts
  const restOfPath = [...pathParts, fileName].join('/');

  return `/${productSlug}/guides/${guideSlug}/${restOfPath}`;
}

async function writeSitemapJson(items: SitemapItem[]): Promise<void> {
  const sitemapJson = JSON.stringify(items, null, 2);
  console.log(`Uploading sitemap JSON to S3: ${S3_GUIDE_METADATA_JSON_PATH}`);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: S3_GUIDE_METADATA_JSON_PATH,
      Body: sitemapJson,
    })
  );
  console.log(`Uploaded sitemap JSON to S3: ${S3_GUIDE_METADATA_JSON_PATH}`);
}

async function convertGuideToSitemapItems(
  strapiGuides: StrapiGuide[]
): Promise<SitemapItem[]> {
  const versions = strapiGuides.flatMap((guide) => {
    return guide.attributes.versions.map((version) => ({
      version: version,
      guideSlug: guide.attributes.slug,
      productSlug: guide.attributes.product?.data?.attributes?.slug,
    }));
  });

  const items: SitemapItem[] = [];
  for (const version of versions) {
    const dirName = version.version.dirName;
    const guideFiles = (
      await listS3Files(`${S3_PATH_TO_GITBOOK_DOCS}/${dirName}`)
    ).filter((file) => file.endsWith('.md'));
    const menuPath = guideFiles.find((file) =>
      file.includes(dirName + '/SUMMARY.md')
    );
    for (const filePath of guideFiles) {
      const parts = filePath.split('/');
      if (parts.length <= 2) {
        continue;
      }
      const content = await downloadS3File(filePath);
      const title = extractTitleFromMarkdown(content);
      if (dirName && menuPath && content && version.productSlug) {
        const path = generateUrlPath(
          filePath,
          version.guideSlug,
          version.productSlug
        );
        items.push({
          path,
          dirName,
          contentS3Path: filePath,
          manuS3Path: menuPath,
          title: title || path.split('/').pop() || 'Untitled',
        });
      }
    }
  }
  return items;
}

async function main() {
  try {
    console.log('Starting to process Markdown files...');

    const strapiGuides = await fetchStrapiGuides();
    console.log(`Fetched ${strapiGuides.length} guides from Strapi`);

    const sitemapItems = await convertGuideToSitemapItems(strapiGuides);
    console.log(`Converted guides to ${sitemapItems.length} sitemap items`);

    await writeSitemapJson(sitemapItems);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Execute the function
main();
