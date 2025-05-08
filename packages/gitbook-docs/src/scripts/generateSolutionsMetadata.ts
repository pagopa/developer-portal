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
loadEnvConfig();

// Validate environment variables
validateStrapiEnvironment();
const { s3BucketName } = validateS3Environment();

const S3_PATH_TO_GITBOOK_DOCS = process.env.S3_PATH_TO_GITBOOK_DOCS || 'docs';
const S3_SOLUTIONS_METADATA_JSON_PATH =
  process.env.S3_SOLUTIONS_METADATA_JSON_PATH || 'solutions-metadata.json';

const s3Client = makeS3Client();

interface StrapiSolution {
  id: number;
  attributes: {
    slug: string;
    title: string;
    landingUseCaseFile: string;
    dirName: string;
  };
}

function generateUrlPath(
  filePath: string,
  slug: string,
  landingUseCaseFile: string
): string {
  const restOfPath = sitePathFromS3Path(filePath, landingUseCaseFile);
  if (!restOfPath) {
    return `/solutions/${slug}/details`;
  } else {
    return `/solutions/${slug}/details/${restOfPath}`;
  }
}

async function convertSolutionToSitemapItems(
  strapiSolutions: StrapiSolution[]
): Promise<SitemapItem[]> {
  const items: SitemapItem[] = [];
  for (const solution of strapiSolutions) {
    const dirName = solution.attributes.dirName;
    const solutionFiles = (
      await listS3Files(
        `${S3_PATH_TO_GITBOOK_DOCS}/${dirName}`,
        `${s3BucketName}`,
        s3Client
      )
    ).filter((file) => file.endsWith('.md'));
    const menuPath = solutionFiles.find((file) =>
      file.includes(dirName + '/SUMMARY.md')
    );
    for (const filePath of solutionFiles) {
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
      if (dirName && menuPath && content) {
        const path = generateUrlPath(
          filePath,
          solution.attributes.slug,
          solution.attributes.landingUseCaseFile
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

    const strapiSolutions = await fetchFromStrapi<StrapiSolution>(
      'api/solutions?pagination[pageSize]=1000&pagination[page]=1'
    );
    console.log(`Fetched ${strapiSolutions.length} solutions from Strapi`);

    const sitemapItems = await convertSolutionToSitemapItems(strapiSolutions);
    console.log(`Converted solutions to ${sitemapItems.length} sitemap items`);

    await writeSitemapJson(
      sitemapItems,
      S3_SOLUTIONS_METADATA_JSON_PATH,
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
