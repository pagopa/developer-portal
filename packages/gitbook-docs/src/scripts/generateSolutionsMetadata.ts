/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-try-statements */
import dotenv from 'dotenv';
import { MetadataItem } from '../metadataItem';
import {
  downloadS3File,
  listS3Files,
  makeS3Client,
  putS3File,
} from '../helpers/s3Bucket.helper';
import { extractTitleFromMarkdown } from '../helpers/extractTitle.helper';
import { fetchFromStrapi } from '../helpers/fetchFromStrapi';
import { sitePathFromS3Path } from '../helpers/sitePathFromS3Path';
import { StrapiSolution } from '../helpers/strapiTypes';
import { getSyncedSolutionsResponseJsonPath } from '../syncedResponses';

// Load environment variables from .env file
dotenv.config();

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_PATH_TO_GITBOOK_DOCS =
  process.env.S3_PATH_TO_GITBOOK_DOCS || 'devportal-docs/docs';
const S3_SOLUTIONS_METADATA_JSON_PATH =
  process.env.S3_SOLUTIONS_METADATA_JSON_PATH || 'solutions-metadata.json';
const SYNCED_SOLUTIONS_RESPONSE_JSON_PATH =
  getSyncedSolutionsResponseJsonPath();

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

async function convertSolutionToMetadataItems(
  strapiSolutions: StrapiSolution[]
): Promise<MetadataItem[]> {
  const items: MetadataItem[] = [];
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

  // eslint-disable-next-line functional/no-let
  let strapiSolutions;
  // eslint-disable-next-line functional/no-let
  let responseJson;
  try {
    const result = await fetchFromStrapi<StrapiSolution>(
      'api/solutions/?populate[icon]=icon&populate[stats]=*&populate[steps][populate][products]=*&populate[seo][populate]=*,metaImage,metaSocial.image&populate[products][populate][0]=logo&populate[bannerLinks][populate][0]=icon&populate[webinars][populate][coverImage][populate][0]=image&populate[webinars][populate][webinarSpeakers][populate][0]=avatar&populate[webinars][populate][relatedLinks][populate][0]=links&populate[webinars][populate][relatedResources][populate][resources][populate][0]=image&populate[webinars][populate][relatedResources][populate][downloadableDocuments][populate]=*&populate[webinars][populate][seo][populate]=*,metaImage,metaSocial.image&populate[webinars][populate][questionsAndAnswers]=*&populate[webinars][populate][webinarCategory][populate][0]=icon&populate[webinars][populate][headerImage][populate][0]=image&populate[caseHistories][populate][0]=case_histories&populate[caseHistories][populate][1]=case_histories.image&pagination[pageSize]=1000&pagination[page]=1'
    );
    strapiSolutions = result.data;
    responseJson = result.responseJson;
  } catch (error) {
    console.error('Error fetching solutions from Strapi:', error);
    process.exit(1);
  }

  console.log(`Fetched ${strapiSolutions.length} solutions from Strapi`);

  const metadataItems = await convertSolutionToMetadataItems(strapiSolutions);
  console.log(`Converted solutions to ${metadataItems.length} metadata items`);

  await putS3File(
    metadataItems,
    S3_SOLUTIONS_METADATA_JSON_PATH,
    `${S3_BUCKET_NAME}`,
    s3Client
  );

  await putS3File(
    responseJson,
    SYNCED_SOLUTIONS_RESPONSE_JSON_PATH,
    `${S3_BUCKET_NAME}`,
    s3Client
  );
}

// Execute the function
main();
