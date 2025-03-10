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
import path from 'path';
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({
  path: path.resolve(process.cwd(), 'apps/nextjs-website/.env'),
});

// Environment variables
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_PATH_TO_GITBOOK_DOCS = process.env.S3_PATH_TO_GITBOOK_DOCS || 'docs';
const AWS_REGION = process.env.NEXT_PUBLIC_COGNITO_REGION;

// Define interfaces
interface DirectoryStructure {
  [dirName: string]: {
    contentFiles: string[];
    summaryFile?: string;
  };
}

interface SitemapItem {
  path: string;
  dirName: string;
  bodyS3Path: string;
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
async function listS3Objects(
  prefix: string = S3_PATH_TO_GITBOOK_DOCS
): Promise<string[]> {
  console.log(
    `Listing objects in bucket: ${S3_BUCKET_NAME} with prefix: ${prefix}`
  );

  const objects: string[] = [];
  let continuationToken: string | undefined;

  try {
    do {
      const command = new ListObjectsV2Command({
        Bucket: S3_BUCKET_NAME,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      });

      console.log('Sending ListObjectsV2Command...');
      const response = await s3Client.send(command);
      console.log('Response received.');

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
    throw error;
  }
}

// Function to download a file from S3
async function downloadS3File(key: string): Promise<string> {
  try {
    console.log(`Downloading file: ${key}`);
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
function extractTitleFromMarkdown(content: string): string {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    let title = titleMatch[1].trim();
    // Remove any emojis or special characters
    title = title.replace(/[\u{1F600}-\u{1F6FF}]/gu, '');
    return title;
  }
  return 'Untitled';
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
    console.log(data.data[0].attributes.versions[0]);
    console.log(
      `Successfully fetched ${data.data?.length || 0} guides from Strapi`
    );
    return data.data || [];
  } catch (error) {
    console.error('Error fetching guides from Strapi:', error);
    return [];
  }
}

// Updated generateUrlPath function that uses Strapi guide data
function generateUrlPathWithStrapiData(
  dirName: string,
  filePath: string,
  dirToGuideMap: Record<string, StrapiGuide>
): string {
  // Get the guide for this directory
  const guide = dirToGuideMap[dirName];

  if (!guide) {
    console.warn(`No matching Strapi guide found for directory: ${dirName}`);
    return '';
  }

  // Extract the path parts after the directory name
  // Example: docs/0OMsoqOg9GiJ2xusVHMv/suolo-spazi-e-beni-pubblici/segnalazioni-suggerimenti-e-reclami.md
  const parts = filePath.split('/');
  const pathParts = parts.slice(2, parts.length - 1); // Skip "docs/dirName" and remove filename
  const fileName = parts[parts.length - 1].replace('.md', '');

  // Construct the path with the format /:product-slug/guides/:guide-slug/...rest-of-path
  const productSlug =
    guide.attributes.product?.data?.attributes?.slug || 'default-product';
  const guideSlug = guide.attributes.slug;

  // Join all path parts
  const restOfPath = [...pathParts, fileName].join('/');

  return `/${productSlug}/guides/${guideSlug}/${restOfPath}`;
}

async function main() {
  try {
    console.log('Starting to process Markdown files...');

    // Fetch all strapi guides
    const strapiGuides = await fetchStrapiGuides();
    console.log(`Fetched ${strapiGuides.length} guides from Strapi`);

    // Create a mapping from directory names to guides
    // This assumes that the directory name in S3 corresponds to some identifier in Strapi
    // You might need to adjust this logic based on your actual data structure
    const dirToGuideMap: Record<string, StrapiGuide> = {};

    // For demonstration, we'll use a simple mapping based on position
    // In a real scenario, you might need a more sophisticated matching logic
    const allObjects = await listS3Objects();
    console.log(`Found ${allObjects.length} total objects in S3 bucket`);

    // Filter for only Markdown files
    const markdownFiles = allObjects.filter((file) => file.endsWith('.md'));
    console.log(`Found ${markdownFiles.length} Markdown files`);

    // Organize files by directory
    const dirStructure: DirectoryStructure = {};

    for (const file of markdownFiles) {
      // Extract directory name (assuming format like "docs/dirName/file.md")
      const parts = file.split('/');
      if (parts.length >= 3) {
        const dirName = parts[1]; // The directory name after "docs/"

        if (!dirStructure[dirName]) {
          dirStructure[dirName] = {
            contentFiles: [],
            summaryFile: undefined,
          };
        }

        if (parts[parts.length - 1] === 'SUMMARY.md') {
          dirStructure[dirName].summaryFile = file;
        } else {
          dirStructure[dirName].contentFiles.push(file);
        }
      }
    }

    const dirNames = Object.keys(dirStructure);
    for (let i = 0; i < Math.min(dirNames.length, strapiGuides.length); i++) {
      const strapiDirName = strapiGuides[i].attributes.versions.find(
        (v) => v.main
      )?.dirName;
      if (strapiDirName) {
        dirToGuideMap[strapiDirName] = strapiGuides[i];
      }
    }

    console.log(
      `Found ${
        Object.keys(dirStructure).length
      } directories with Markdown files`
    );
    console.log(
      `Mapped ${Object.keys(dirToGuideMap).length} directories to Strapi guides`
    );

    // Create sitemap items for all directories
    const sitemapItems: SitemapItem[] = [];

    for (const dirName of Object.keys(dirStructure)) {
      console.log(`Processing directory: ${dirName}`);

      // Get the summary file for this directory if it exists
      const summaryFile = dirStructure[dirName].summaryFile;

      if (!summaryFile) {
        console.log(
          `No SUMMARY.md found for directory: ${dirName}, skipping...`
        );
        continue;
      }

      // Process each content file in the directory
      for (const contentFile of dirStructure[dirName].contentFiles) {
        try {
          // Download content file to extract title
          const content = await downloadS3File(contentFile);
          const title = extractTitleFromMarkdown(content);

          // Generate URL path using Strapi data
          const urlPath = generateUrlPathWithStrapiData(
            dirName,
            contentFile,
            dirToGuideMap
          );

          if (!urlPath) {
            console.log(
              `Skipping file ${contentFile} - no valid URL path could be generated`
            );
            continue;
          }

          // Create sitemap item
          const sitemapItem: SitemapItem = {
            path: urlPath,
            dirName: dirName,
            bodyS3Path: contentFile,
            manuS3Path: summaryFile,
            title: title,
          };

          sitemapItems.push(sitemapItem);
          console.log(
            `Added sitemap item: ${title} (${dirName}) with path: ${urlPath}`
          );
        } catch (error) {
          console.error(`Error processing file ${contentFile}:`, error);
        }
      }
    }

    // Write the sitemap items to a file
    const sitemapJson = JSON.stringify(sitemapItems, null, 2);

    // Write the file to the S3 bucket
    const s3OutputPath = `${S3_PATH_TO_GITBOOK_DOCS}/guides-metadata.json`;
    console.log(`Uploading sitemap JSON to S3: ${s3OutputPath}`);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: s3OutputPath,
        Body: sitemapJson,
      })
    );

    console.log(
      `Sitemap JSON successfully uploaded to S3 with ${sitemapItems.length} items`
    );
  } catch (error) {
    console.error('Error:', error);
  }
}

// Execute the function
main();
