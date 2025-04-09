/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-try-statements */
import {
  downloadS3File,
  listS3Files,
  makeS3Client,
  writeSitemapJson,
  loadEnvConfig,
  validateS3Environment,
} from '../helpers/s3Bucket.helper';
import { SitemapItem } from '../sitemapItem';
import { extractTitleFromMarkdown } from '../helpers/extractTitle.helper';
import {
  fetchFromStrapi,
  validateStrapiEnvironment,
} from '../helpers/fetchFromStrapi';
import { sitePathFromS3Path } from '../helpers/sitePathFromS3Path';

// Load environment variables from .env file
const envLoadResult = loadEnvConfig();
if (envLoadResult.result === 'success') {
  console.log('Loaded environment variables from .env file');
} else {
  console.log(
    'No .env file found or error loading it, using environment variables'
  );
}

// Validate environment variables
validateStrapiEnvironment();
const { s3BucketName } = validateS3Environment();

const S3_PATH_TO_GITBOOK_DOCS = process.env.S3_PATH_TO_GITBOOK_DOCS || 'docs';
const S3_GUIDE_METADATA_JSON_PATH =
  process.env.S3_GUIDE_METADATA_JSON_PATH || 'guides-metadata.json';

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
        `${s3BucketName}`,
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
        `${s3BucketName}`,
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
      `${s3BucketName}`,
      s3Client
    );
  } catch (error) {
    console.error('Error:', error);
    process.exit(1); // Exit with error code for CI pipeline visibility
  }
}

// Execute the function
main();
