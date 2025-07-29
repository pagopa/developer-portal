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
import { StrapiGuide, GuideInfo } from '../helpers/guidesMetadataHelper';
import { sitePathFromS3Path } from '../helpers/sitePathFromS3Path';

// Load environment variables from .env file
dotenv.config();

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_PATH_TO_GITBOOK_DOCS =
  process.env.S3_PATH_TO_GITBOOK_DOCS || 'devportal-docs/docs';
const S3_GUIDE_METADATA_JSON_PATH =
  process.env.S3_GUIDE_METADATA_JSON_PATH || 'guides-metadata.json';
const SYNCED_GUIDES_RESPONSE_JSON_PATH =
  process.env.SYNCED_GUIDES_RESPONSE_JSON_PATH || 'synced-guides-response.json';
const SYNCED_GUIDE_LIST_PAGES_RESPONSE_JSON_PATH =
  process.env.SYNCED_GUIDE_LIST_PAGES_RESPONSE_JSON_PATH ||
  'synced-guide-list-pages-response.json';

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

async function convertGuideToSitemapItems(
  strapiGuides: StrapiGuide[]
): Promise<SitemapItem[]> {
  const guideInfoList: GuideInfo[] = strapiGuides
    .filter((guide) => !!guide.attributes.product?.data?.attributes?.slug)
    .flatMap((guide) =>
      guide.attributes.versions.map((version) => ({
        versionName: version.version,
        isMainVersion: version.main,
        dirName: version.dirName,
        guideSlug: guide.attributes.slug,
        productSlug: `${guide.attributes.product?.data?.attributes?.slug}`,
      }))
    );

  const items: SitemapItem[] = [];
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
          guideInfo.guideSlug,
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
            guideInfo.guideSlug,
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
      'api/guide-list-pages/?populate%5Bproduct%5D%5Bpopulate%5D%5B0%5D=logo&populate%5Bproduct%5D%5Bpopulate%5D%5B1%5D=bannerLinks.icon&populate%5Bproduct%5D%5Bpopulate%5D%5B2%5D=overview&populate%5Bproduct%5D%5Bpopulate%5D%5B3%5D=quickstart_guide&populate%5Bproduct%5D%5Bpopulate%5D%5B4%5D=release_note&populate%5Bproduct%5D%5Bpopulate%5D%5B5%5D=api_data_list_page&populate%5Bproduct%5D%5Bpopulate%5D%5B6%5D=api_data_list_page.apiData.%2A&populate%5Bproduct%5D%5Bpopulate%5D%5B7%5D=api_data_list_page.apiData.apiRestDetail.%2A&populate%5Bproduct%5D%5Bpopulate%5D%5B8%5D=guide_list_page&populate%5Bproduct%5D%5Bpopulate%5D%5B9%5D=tutorial_list_page&populate%5BguidesByCategory%5D%5Bpopulate%5D%5B0%5D=guides.mobileImage&populate%5BguidesByCategory%5D%5Bpopulate%5D%5B1%5D=guides.image&populate%5BguidesByCategory%5D%5Bpopulate%5D%5B2%5D=guides.listItems&populate%5BbannerLinks%5D%5Bpopulate%5D%5B0%5D=icon&populate%5Bseo%5D%5Bpopulate%5D=%2A%2CmetaImage%2CmetaSocial.image'
    );
  } catch (error) {
    console.error('Error fetching guide list pages from Strapi:', error);
    process.exit(1);
  }

  // TODO: restore this strapiGuidesUrl when Metadata will be managed by Strapi
  // const strapiGuidesUrl =
  //   'api/guides?populate[0]=product&populate[1]=versions&pagination[pageSize]=1000&pagination[page]=1';
  const strapiGuidesUrl =
    'api/guides/?populate%5Bimage%5D%5Bpopulate%5D=%2A&populate%5BmobileImage%5D%5Bpopulate%5D=%2A&populate%5BlistItems%5D%5Bpopulate%5D=%2A&populate%5Bversions%5D%5Bpopulate%5D=%2A&populate%5BbannerLinks%5D%5Bpopulate%5D%5B0%5D=icon&populate%5Bseo%5D%5Bpopulate%5D=metaSocial.image&populate%5Bproduct%5D%5Bpopulate%5D%5B0%5D=logo&populate%5Bproduct%5D%5Bpopulate%5D%5B1%5D=bannerLinks.icon&populate%5Bproduct%5D%5Bpopulate%5D%5B2%5D=overview&populate%5Bproduct%5D%5Bpopulate%5D%5B3%5D=quickstart_guide&populate%5Bproduct%5D%5Bpopulate%5D%5B4%5D=release_note&populate%5Bproduct%5D%5Bpopulate%5D%5B5%5D=api_data_list_page&populate%5Bproduct%5D%5Bpopulate%5D%5B6%5D=api_data_list_page.apiData.%2A&populate%5Bproduct%5D%5Bpopulate%5D%5B7%5D=api_data_list_page.apiData.apiRestDetail.%2A&populate%5Bproduct%5D%5Bpopulate%5D%5B8%5D=guide_list_page&populate%5Bproduct%5D%5Bpopulate%5D%5B9%5D=tutorial_list_page';

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

  const sitemapItems = await convertGuideToSitemapItems(strapiGuides);
  console.log(`Converted guides to ${sitemapItems.length} sitemap items`);

  await writeSitemapJson(
    sitemapItems,
    S3_GUIDE_METADATA_JSON_PATH,
    `${S3_BUCKET_NAME}`,
    s3Client
  );

  // TODO: remove when Strapi will manage Metadata
  await writeSitemapJson(
    responseJson,
    SYNCED_GUIDES_RESPONSE_JSON_PATH,
    `${S3_BUCKET_NAME}`,
    s3Client
  );

  // TODO: remove when Strapi will manage Metadata
  await writeSitemapJson(
    guideListPagesResponse,
    SYNCED_GUIDE_LIST_PAGES_RESPONSE_JSON_PATH,
    `${S3_BUCKET_NAME}`,
    s3Client
  );
}

// Execute the function
main();
