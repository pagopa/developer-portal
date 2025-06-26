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
  writeUrlParsingMetadataJson,
} from '../helpers/s3Bucket.helper';
import * as pathParser from 'path';
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
  productSlug: string,
  versionName?: string
): string {
  const restOfPath = sitePathFromS3Path(filePath);
  return [`/${productSlug}`, 'guides', guideSlug, versionName, restOfPath]
    .filter(Boolean)
    .join('/');
}

export type UrlParsingItem = {
  dirName: string;
  isPageIndex: boolean;
  pagePath: string;
  spaceToPrefix: { spaceID: string; pathPrefix: string }[];
};

type GuideInfo = {
  versionName: string;
  isMainVersion: boolean;
  dirName: string;
  guideSlug: string;
  productSlug: string;
};

async function convertGuideToUrlParsingItems(
  strapiGuides: StrapiGuide[]
): Promise<UrlParsingItem[]> {
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

  const items: UrlParsingItem[] = [];
  for (const guideInfo of guideInfoList) {
    const guideFiles = (
      await listS3Files(
        `${S3_PATH_TO_GITBOOK_DOCS}/${guideInfo.dirName}`,
        `${s3BucketName}`,
        s3Client
      )
    ).filter((file) => file.endsWith('.md'));
    const menuPath = guideFiles.find((file) =>
      file.includes(guideInfo.dirName + '/SUMMARY.md')
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
      if (menuPath && content) {
        const path = generateUrlPath(
          filePath,
          guideInfo.guideSlug,
          guideInfo.productSlug,
          guideInfo.versionName
        );
        const item = {
          dirName: guideInfo.dirName,
          isPageIndex: pathParser.parse(filePath).name === 'README',
          pagePath: guideInfo.guideSlug,
          spaceToPrefix: [],
        };
        items.push(item);
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

    const urlParsingItems = await convertGuideToUrlParsingItems(strapiGuides);
    console.log(
      `Converted guides to ${urlParsingItems.length} url parsing items`
    );

    await writeUrlParsingMetadataJson(
      urlParsingItems,
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
