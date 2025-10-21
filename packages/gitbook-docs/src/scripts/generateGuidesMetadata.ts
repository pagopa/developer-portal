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
  writeMetadataJson,
} from '../helpers/s3Bucket.helper';
import { extractTitleFromMarkdown } from '../helpers/extractTitle.helper';
import {
  fetchFromStrapi,
  getResponseFromStrapi,
} from '../helpers/fetchFromStrapi';
import { StrapiGuide } from '../helpers/strapiTypes';
import { MetadataInfo } from '../helpers/guidesMetadataHelper';
import { sitePathFromS3Path } from '../helpers/sitePathFromS3Path';
import {
  getSyncedGuideListPagesResponseJsonPath,
  getSyncedGuidesResponseJsonPath,
} from '../syncedResponses';

// Load environment variables from .env file
dotenv.config();

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_PATH_TO_GITBOOK_DOCS =
  process.env.S3_PATH_TO_GITBOOK_DOCS || 'devportal-docs/docs';
const S3_GUIDE_METADATA_JSON_PATH =
  process.env.S3_GUIDE_METADATA_JSON_PATH || 'guides-metadata.json';
const SYNCED_GUIDES_RESPONSE_JSON_PATH = getSyncedGuidesResponseJsonPath();
const SYNCED_GUIDE_LIST_PAGES_RESPONSE_JSON_PATH =
  getSyncedGuideListPagesResponseJsonPath();

const s3Client = makeS3Client();

function generateUrlPath(
  filePath: string,
  guideSlug: string,
  productSlug: string,
  versionName?: string
): string {
  const restOfPath = sitePathFromS3Path(filePath, undefined);
  return [`/${productSlug}`, 'guides', guideSlug, versionName, restOfPath]
    .filter(Boolean)
    .join('/');
}

async function convertGuideToMetadataItems(
  strapiGuides: StrapiGuide[]
): Promise<MetadataItem[]> {
  const guideInfoList: MetadataInfo[] = strapiGuides
    .filter((guide) => !!guide.attributes.product?.data?.attributes?.slug)
    .flatMap((guide) =>
      guide.attributes.versions.map((version) => ({
        versionName: version.version,
        isMainVersion: version.main,
        dirName: version.dirName,
        slug: guide.attributes.slug,
        productSlug: `${guide.attributes.product?.data?.attributes?.slug}`,
      }))
    );

  const items: MetadataItem[] = [];
  for (const guideInfo of guideInfoList) {
    const guideFiles = (
      await listS3Files(
        `${S3_PATH_TO_GITBOOK_DOCS}/${guideInfo.dirName}`,
        `${S3_BUCKET_NAME}`,
        s3Client
      )
    ).filter((file) => file.endsWith('.md'));
    const menuPath = guideFiles.find((file) =>
      file.includes(guideInfo.dirName + '/SUMMARY.md')
    );
    for (const filePath of guideFiles) {
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
      if (menuPath && content) {
        const path = generateUrlPath(
          filePath,
          guideInfo.slug,
          guideInfo.productSlug,
          guideInfo.versionName
        );
        const item = {
          path,
          dirName: guideInfo.dirName,
          contentS3Path: filePath,
          menuS3Path: menuPath,
          title: title || path.split('/').pop() || 'Untitled',
          version: guideInfo.versionName,
        };
        items.push(item);
        if (guideInfo.isMainVersion) {
          const path = generateUrlPath(
            filePath,
            guideInfo.slug,
            guideInfo.productSlug
          );
          items.push({
            ...item,
            path,
          });
        }
      }
    }
  }
  return items;
}

async function main() {
  console.log('Starting to process Markdown files...');

  // TODO: remove when Strapi will manage Metadata
  // eslint-disable-next-line functional/no-let
  let guideListPagesResponse;
  try {
    guideListPagesResponse = await getResponseFromStrapi(
      'api/guide-list-pages/?populate[product][populate][0]=logo&populate[product][populate][1]=bannerLinks.icon&populate[product][populate][2]=overview&populate[product][populate][3]=quickstart_guide&populate[product][populate][4]=release_note&populate[product][populate][5]=api_data_list_page&populate[product][populate][6]=api_data_list_page.apiData.*&populate[product][populate][7]=api_data_list_page.apiData.apiRestDetail.*&populate[product][populate][8]=guide_list_page&populate[product][populate][9]=tutorial_list_page&populate[product][populate][10]=use_case_list_page&populate[guidesByCategory][populate][0]=guides.mobileImage&populate[guidesByCategory][populate][1]=guides.image&populate[guidesByCategory][populate][2]=guides.listItems&populate[bannerLinks][populate][0]=icon&populate[seo][populate]=*,metaImage,metaSocial.image'
    );
  } catch (error) {
    console.error('Error fetching guide list pages from Strapi:', error);
    process.exit(1);
  }

  // TODO: restore this strapiGuidesUrl when Metadata will be managed by Strapi
  // const strapiGuidesUrl =
  //   'api/guides?populate[0]=product&populate[1]=versions&pagination[pageSize]=1000&pagination[page]=1';
  const strapiGuidesUrl =
    'api/guides/?populate[image][populate]=*&populate[mobileImage][populate]=*&populate[listItems][populate]=*&populate[versions][populate]=*&populate[bannerLinks][populate][0]=icon&populate[seo][populate]=metaSocial.image&populate[product][populate][0]=logo&populate[product][populate][1]=bannerLinks.icon&populate[product][populate][2]=overview&populate[product][populate][3]=quickstart_guide&populate[product][populate][4]=release_note&populate[product][populate][5]=api_data_list_page&populate[product][populate][6]=api_data_list_page.apiData.*&populate[product][populate][7]=api_data_list_page.apiData.apiRestDetail.*&populate[product][populate][8]=guide_list_page&populate[product][populate][9]=tutorial_list_page&populate[product][populate][10]=use_case_list_page';

  // eslint-disable-next-line functional/no-let
  let strapiGuides;
  // eslint-disable-next-line functional/no-let
  let responseJson;
  try {
    const result = await fetchFromStrapi<StrapiGuide>(strapiGuidesUrl);
    strapiGuides = result.data;
    responseJson = result.responseJson;
  } catch (error) {
    console.error('Error fetching guides from Strapi:', error);
    process.exit(1);
  }

  console.log(`Fetched ${strapiGuides.length} guides from Strapi`);

  const metadataItems = await convertGuideToMetadataItems(strapiGuides);
  console.log(`Converted guides to ${metadataItems.length} metadata items`);

  await writeMetadataJson(
    metadataItems,
    S3_GUIDE_METADATA_JSON_PATH,
    `${S3_BUCKET_NAME}`,
    s3Client
  );

  await writeMetadataJson(
    responseJson,
    SYNCED_GUIDES_RESPONSE_JSON_PATH,
    `${S3_BUCKET_NAME}`,
    s3Client
  );

  await writeMetadataJson(
    guideListPagesResponse,
    SYNCED_GUIDE_LIST_PAGES_RESPONSE_JSON_PATH,
    `${S3_BUCKET_NAME}`,
    s3Client
  );
}

// Execute the function
main();
