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
import {
  fetchFromStrapi,
  getResponseFromStrapi,
} from '../helpers/fetchFromStrapi';
import { sitePathFromS3Path } from '../helpers/sitePathFromS3Path';
import { StrapiSolution } from '../helpers/guidesMetadataHelper';

// Load environment variables from .env file
dotenv.config();

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_PATH_TO_GITBOOK_DOCS =
  process.env.S3_PATH_TO_GITBOOK_DOCS || 'devportal-docs/docs';
const S3_SOLUTIONS_METADATA_JSON_PATH =
  process.env.S3_SOLUTIONS_METADATA_JSON_PATH || 'solutions-metadata.json';
const SYNCED_SOLUTIONS_RESPONSE_JSON_PATH =
  process.env.SYNCED_SOLUTIONS_RESPONSE_JSON_PATH ||
  'synced-solutions-response.json';
const SYNCED_SOLUTION_LIST_PAGES_RESPONSE_JSON_PATH =
  process.env.SYNCED_SOLUTION_LIST_PAGES_RESPONSE_JSON_PATH ||
  'synced-solution-list-pages-response.json';

const s3Client = makeS3Client();
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
        `${S3_BUCKET_NAME}`,
        s3Client
      )
    ).filter((file) => file.endsWith('.md'));
    const menuPath = solutionFiles.find((file) =>
      file.includes(dirName + '/SUMMARY.md')
    );
    for (const filePath of solutionFiles) {
      const parts = filePath.split('/');
      if (
        parts.length <= 2 ||
        filePath.endsWith('/SUMMARY.md') ||
        filePath.includes('.gitbook/includes')
      ) {
        continue;
      }
      const content = await downloadS3File(
        filePath,
        `${S3_BUCKET_NAME}`,
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
          menuS3Path: menuPath,
          title: title || path.split('/').pop() || 'Untitled',
        });
      }
    }
  }
  return items;
}

async function main() {
  console.log('Starting to process Markdown files...');

  // TODO: remove when Strapi will manage Metadata
  // eslint-disable-next-line functional/no-let
  let solutionListPagesResponse;
  try {
    solutionListPagesResponse = await getResponseFromStrapi(
      'api/solution-list-page/?populate%5Bsolutions%5D%5Bpopulate%5D%5B0%5D=bannerLinks&populate%5Bsolutions%5D%5Bpopulate%5D%5B1%5D=bannerLinks.icon&populate%5Bsolutions%5D%5Bpopulate%5D%5B2%5D=products.logo&populate%5Bsolutions%5D%5Bpopulate%5D%5B3%5D=icon&populate%5Bsolutions%5D%5Bpopulate%5D%5B4%5D=icon.name&populate%5Bsolutions%5D%5Bpopulate%5D%5B5%5D=stats&populate%5Bsolutions%5D%5Bpopulate%5D%5B6%5D=steps&populate%5Bsolutions%5D%5Bpopulate%5D%5B7%5D=steps.products&populate%5Bsolutions%5D%5Bpopulate%5D%5B8%5D=webinars&populate%5Bsolutions%5D%5Bpopulate%5D%5B9%5D=webinars.coverImage&populate%5Bsolutions%5D%5Bpopulate%5D%5B10%5D=caseHistories&populate%5Bsolutions%5D%5Bpopulate%5D%5B11%5D=caseHistories.case_histories&populate%5Bsolutions%5D%5Bpopulate%5D%5B12%5D=caseHistories.case_histories.image&populate%5BcaseHistories%5D%5Bpopulate%5D%5B0%5D=case_histories&populate%5BcaseHistories%5D%5Bpopulate%5D%5B1%5D=case_histories.image&populate%5Bfeatures%5D%5Bpopulate%5D%5B0%5D=items.icon&populate%5Bseo%5D%5Bpopulate%5D=%2A%2CmetaImage%2CmetaSocial.image'
    );
  } catch (error) {
    console.error('Error fetching solution list pages from Strapi:', error);
    process.exit(1);
  }

  // eslint-disable-next-line functional/no-let
  let strapiSolutions;
  // eslint-disable-next-line functional/no-let
  let responseJson;
  try {
    const result = await fetchFromStrapi<StrapiSolution>(
      'api/solutions?pagination[pageSize]=1000&pagination[page]=1'
    );
    strapiSolutions = result.data;
    responseJson = result.responseJson;
  } catch (error) {
    console.error('Error fetching solutions from Strapi:', error);
    process.exit(1);
  }

  console.log(`Fetched ${strapiSolutions.length} solutions from Strapi`);

  const sitemapItems = await convertSolutionToSitemapItems(strapiSolutions);
  console.log(`Converted solutions to ${sitemapItems.length} sitemap items`);

  await writeSitemapJson(
    sitemapItems,
    S3_SOLUTIONS_METADATA_JSON_PATH,
    `${S3_BUCKET_NAME}`,
    s3Client
  );

  // TODO: remove when Strapi will manage Metadata
  await writeSitemapJson(
    responseJson,
    SYNCED_SOLUTIONS_RESPONSE_JSON_PATH,
    `${S3_BUCKET_NAME}`,
    s3Client
  );

  // TODO: remove when Strapi will manage Metadata
  await writeSitemapJson(
    solutionListPagesResponse,
    SYNCED_SOLUTION_LIST_PAGES_RESPONSE_JSON_PATH,
    `${S3_BUCKET_NAME}`,
    s3Client
  );
}

// Execute the function
main();
