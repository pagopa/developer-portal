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
const S3_GUIDE_METADATA_JSON_PATH =
  process.env.S3_GUIDE_METADATA_JSON_PATH || 'guides-metadata.json';

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

function generateUrlPath(
  filePath: string,
  guideSlug: string,
  productSlug: string
): string {
  const restOfPath = sitePathFromS3Path(filePath);
  return `/${productSlug}/guides/${guideSlug}/${restOfPath}`;
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
      await listS3Files(
        `${S3_PATH_TO_GITBOOK_DOCS}/${dirName}`,
        `${S3_BUCKET_NAME}`,
        s3Client
      )
    ).filter((file) => file.endsWith('.md'));
    const menuPath = guideFiles.find((file) =>
      file.includes(dirName + '/SUMMARY.md')
    );
    for (const filePath of guideFiles) {
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

    const strapiGuides = await fetchFromStrapi<StrapiGuide>(
      'api/guides?populate[0]=product&populate[1]=versions&pagination[pageSize]=1000&pagination[page]=1'
    );
    console.log(`Fetched ${strapiGuides.length} guides from Strapi`);

    const sitemapItems = await convertGuideToSitemapItems(strapiGuides);
    console.log(`Converted guides to ${sitemapItems.length} sitemap items`);

    await writeSitemapJson(
      sitemapItems,
      S3_GUIDE_METADATA_JSON_PATH,
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
