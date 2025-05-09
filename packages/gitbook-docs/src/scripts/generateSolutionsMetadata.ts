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

// Load environment variables from .env file
dotenv.config();

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
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
        `${S3_BUCKET_NAME}`,
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
      `${S3_BUCKET_NAME}`,
      s3Client
    );
  } catch (error) {
    console.error('Error:', error);
  }
}

// Execute the function
main();
