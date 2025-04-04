/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-try-statements */
import dotenv from 'dotenv';
import { SitemapItem } from '../sitemapItem';
import {
  downloadS3File,
  listS3Files,
  makeS3Client,
  writeSitemapJson,
} from '../helpers/s3Bucket.helper';
import { extractTitleFromMarkdown } from '../helpers/extractTitle.helper';
import { fetchFromStrapi } from '../helpers/fetchFromStrapi';
import { sitePathFromS3Path } from '../helpers/sitePathFromS3Path';

// Try to load environment variables from .env file, but don't fail if it doesn't exist
try {
  dotenv.config({ path: '.env' });
  console.log('Loaded environment variables from .env file');
} catch (error) {
  console.log(
    'No .env file found or error loading it, using environment variables'
  );
}

// Support both variable names for S3 bucket
const S3_BUCKET_NAME =
  process.env.S3_BUCKET_NAME || process.env.S3_DOC_EXTRACTION_BUCKET_NAME;
const S3_PATH_TO_GITBOOK_DOCS = process.env.S3_PATH_TO_GITBOOK_DOCS || 'docs';
const S3_RELEASE_NOTES_METADATA_JSON_PATH =
  process.env.S3_RELEASE_NOTES_METADATA_JSON_PATH ||
  'release-notes-metadata.json';

// Check for required environment variables
const requiredEnvVars = ['STRAPI_ENDPOINT', 'STRAPI_API_TOKEN'];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

// Add bucket check separately since we look for either of two names
if (!S3_BUCKET_NAME) {
  missingEnvVars.push('S3_BUCKET_NAME or S3_DOC_EXTRACTION_BUCKET_NAME');
}

if (missingEnvVars.length > 0) {
  console.warn(
    `Warning: Missing environment variables: ${missingEnvVars.join(', ')}`
  );
  console.log('Continuing with available environment variables...');
}

const s3Client = makeS3Client();

interface StrapiReleaseNote {
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
    dirName: string;
    landingFile: string;
  };
}

function generateUrlPath(
  filePath: string,
  productSlug: string,
  landingFile: string
): string {
  const restOfPath = sitePathFromS3Path(filePath, landingFile);
  if (!restOfPath) {
    return `/${productSlug}/release-note`;
  } else {
    return `/${productSlug}/release-note/${restOfPath}`;
  }
}

async function convertReleaseNoteToSitemapItems(
  strapiReleaseNotes: StrapiReleaseNote[]
): Promise<SitemapItem[]> {
  const items: SitemapItem[] = [];
  for (const releaseNote of strapiReleaseNotes) {
    const dirName = releaseNote.attributes.dirName;
    const releaseNoteFiles = (
      await listS3Files(
        `${S3_PATH_TO_GITBOOK_DOCS}/${dirName}`,
        `${S3_BUCKET_NAME}`,
        s3Client
      )
    ).filter((file) => file.endsWith('.md'));
    const menuPath = releaseNoteFiles.find((file) =>
      file.includes(dirName + '/SUMMARY.md')
    );
    for (const filePath of releaseNoteFiles) {
      const parts = filePath.split('/');
      if (parts.length <= 2) {
        continue;
      }
      const content = await downloadS3File(
        filePath,
        `${S3_BUCKET_NAME}`,
        s3Client
      );
      const title = extractTitleFromMarkdown(content);
      const productSlug =
        releaseNote.attributes.product?.data?.attributes?.slug;
      if (dirName && menuPath && content && productSlug) {
        const path = generateUrlPath(
          filePath,
          productSlug,
          releaseNote.attributes.landingFile
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

    const strapiGuides = await fetchFromStrapi<StrapiReleaseNote>(
      'api/release-notes?populate[0]=product&pagination[pageSize]=1000&pagination[page]=1'
    );
    console.log(`Fetched ${strapiGuides.length} guides from Strapi`);

    const sitemapItems = await convertReleaseNoteToSitemapItems(strapiGuides);
    console.log(`Converted guides to ${sitemapItems.length} sitemap items`);

    await writeSitemapJson(
      sitemapItems,
      S3_RELEASE_NOTES_METADATA_JSON_PATH,
      `${S3_BUCKET_NAME}`,
      s3Client
    );
  } catch (error) {
    console.error('Error:', error);
    process.exit(1); // Exit with error code for CI pipeline visibility
  }
}

// Execute the function
main();
