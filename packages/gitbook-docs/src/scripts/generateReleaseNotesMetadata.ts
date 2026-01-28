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
import { StrapiReleaseNote } from '../helpers/strapiTypes';
import { getSyncedReleaseNotesResponseJsonFile } from '../syncedResponses';

// Load environment variables from .env file
dotenv.config();

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_PATH_TO_GITBOOK_DOCS =
  process.env.S3_PATH_TO_GITBOOK_DOCS || 'devportal-docs/docs';
const S3_RELEASE_NOTES_METADATA_JSON_PATH =
  process.env.S3_RELEASE_NOTES_METADATA_JSON_PATH ||
  'release-notes-metadata.json';
const LOCALE = process.env.LOCALE;

const s3Client = makeS3Client();

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

async function convertReleaseNoteToMetadataItems(
  strapiReleaseNotes: StrapiReleaseNote[]
): Promise<MetadataItem[]> {
  const items: MetadataItem[] = [];
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
  let strapiReleaseNotes;
  // eslint-disable-next-line functional/no-let
  let responseJson;
  try {
    const result = await fetchFromStrapi<StrapiReleaseNote>(
      `api/release-notes/?[locale]=${
        LOCALE || 'it'
      }&populate[bannerLinks][populate][0]=icon&populate[product][populate][0]=logo&populate[product][populate][1]=bannerLinks.icon&populate[product][populate][2]=overview&populate[product][populate][3]=quickstart_guide&populate[product][populate][4]=release_note&populate[product][populate][5]=api_data_list_page&populate[product][populate][6]=api_data_list_page.apiData.*&populate[product][populate][7]=api_data_list_page.apiData.apiRestDetail.slug&populate[product][populate][8]=api_data_list_page.apiData.apiRestDetail.specUrls&populate[product][populate][9]=api_data_list_page.apiData.apiSoapDetail.*&populate[product][populate][10]=guide_list_page&populate[product][populate][11]=tutorial_list_page&populate[product][populate][12]=use_case_list_page&populate[seo][populate]=*,metaImage,metaSocial.image&pagination[pageSize]=1000&pagination[page]=1`
    );
    strapiReleaseNotes = result.data;
    responseJson = result.responseJson;
  } catch (error) {
    console.error('Error fetching release notes from Strapi:', error);
    process.exit(1);
  }

  console.log(`Fetched ${strapiReleaseNotes.length} release notes from Strapi`);

  const metadataItems = await convertReleaseNoteToMetadataItems(
    strapiReleaseNotes
  );
  console.log(
    `Converted release notes to ${metadataItems.length} metadata items`
  );

  await putS3File(
    metadataItems,
    S3_RELEASE_NOTES_METADATA_JSON_PATH,
    `${S3_BUCKET_NAME}`,
    s3Client,
    LOCALE
  );

  // TODO: remove when Strapi will manage Metadata
  await putS3File(
    responseJson,
    getSyncedReleaseNotesResponseJsonFile,
    `${S3_BUCKET_NAME}`,
    s3Client,
    LOCALE
  );
}

// Execute the function
main();
