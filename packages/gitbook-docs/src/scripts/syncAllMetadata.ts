/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-let */

import dotenv from 'dotenv';
import { writeFile } from 'fs/promises';
import * as fs from 'fs';
import path from 'path';
import { SitemapItem } from '../sitemapItem';
import {
  downloadS3File,
  listS3Files,
  makeS3Client,
  writeSitemapJson,
} from '../helpers/s3Bucket.helper';
import { S3Client } from '@aws-sdk/client-s3';
import { extractTitleFromMarkdown } from '../helpers/extractTitle.helper';
import { fetchFromStrapi } from '../helpers/fetchFromStrapi';
import {
  MetadataInfo,
  MetadataType,
  StrapiGuide,
  StrapiReleaseNote,
  StrapiSolution,
  StrapiGuideListPageResponse,
  StrapiSolutionListPageResponse,
  StrapiGuidesResponse,
  StrapiSolutionsResponse,
  StrapiReleaseNotesResponse,
} from '../helpers/guidesMetadataHelper';
import { sitePathFromS3Path } from '../helpers/sitePathFromS3Path';
import { sitePathFromLocalPath } from '../helpers/sitePathFromLocalPath';
import {
  getSyncedGuideListPagesResponseJsonPath,
  getSyncedGuidesResponseJsonPath,
  getSyncedSolutionListPagesResponseJsonPath,
  getSyncedSolutionsResponseJsonPath,
  getSyncedReleaseNotesResponseJsonPath,
} from '../syncedResponses';
import { DOCUMENTATION_PATH } from '../helpers/documentationParsing.helper';

// Load environment variables
dotenv.config();

// Configuration
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_PATH_TO_GITBOOK_DOCS =
  process.env.S3_PATH_TO_GITBOOK_DOCS || 'devportal-docs/docs';
const URL_PARSING_METADATA_JSON_PATH =
  process.env.URL_PARSING_METADATA_JSON_PATH ||
  '../../url-parsing-metadata.json';
const METADATA_TYPE = (process.env.METADATA_TYPE || 'all').toLowerCase();
const GENERATE_URL_METADATA = process.env.GENERATE_URL_METADATA !== 'false';
const GENERATE_SITEMAP_METADATA =
  process.env.GENERATE_SITEMAP_METADATA !== 'false';
const SAVE_STRAPI_RESPONSES = process.env.SAVE_STRAPI_RESPONSES !== 'false';

// S3 paths for metadata files
const S3_GUIDE_METADATA_JSON_PATH =
  process.env.S3_GUIDE_METADATA_JSON_PATH || 'guides-metadata.json';
const S3_SOLUTIONS_METADATA_JSON_PATH =
  process.env.S3_SOLUTIONS_METADATA_JSON_PATH || 'solutions-metadata.json';
const S3_RELEASE_NOTES_METADATA_JSON_PATH =
  process.env.S3_RELEASE_NOTES_METADATA_JSON_PATH ||
  'release-notes-metadata.json';

// Cache for S3 operations
const s3FileCache = new Map<string, string>();
const s3ListCache = new Map<string, string[]>();

interface StrapiData {
  guides: StrapiGuide[];
  solutions: StrapiSolution[];
  releaseNotes: StrapiReleaseNote[];
  guidesRawResponse?: StrapiGuidesResponse;
  solutionsRawResponse?: StrapiSolutionsResponse;
  releaseNotesRawResponse?: StrapiReleaseNotesResponse;
  guideListPagesResponse?: StrapiGuideListPageResponse[];
  solutionListPageResponse?: StrapiSolutionListPageResponse[];
}

interface UrlParsingItem {
  dirName: string;
  docs: {
    path: string;
    url: string;
  }[];
}

let s3Client: S3Client | undefined;

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = makeS3Client();
  }
  return s3Client;
}

// Cached S3 operations
async function cachedListS3Files(prefix: string): Promise<string[]> {
  if (s3ListCache.has(prefix)) {
    return s3ListCache.get(prefix)!;
  }
  const files = await listS3Files(prefix, S3_BUCKET_NAME!, getS3Client());
  s3ListCache.set(prefix, files);
  return files;
}

async function cachedDownloadS3File(filePath: string): Promise<string> {
  if (s3FileCache.has(filePath)) {
    return s3FileCache.get(filePath)!;
  }
  const content = await downloadS3File(
    filePath,
    S3_BUCKET_NAME!,
    getS3Client()
  );
  s3FileCache.set(filePath, content);
  return content;
}

// Fetch all data from Strapi in one go
async function fetchAllStrapiData(): Promise<StrapiData> {
  console.log('Fetching all data from Strapi...');

  const [
    guidesResult,
    solutionsResult,
    releaseNotesResult,
    guideListPagesResponse,
    solutionListPageResponse,
  ] = await Promise.all([
    // Guides with full populate
    fetchFromStrapi<StrapiGuide>(
      'api/guides?populate[0]=product&populate[1]=versions&populate[2]=image&populate[3]=mobileImage&populate[4]=bannerLinks&populate[5]=bannerLinks.icon&populate[6]=listItems&populate[7]=seo&populate[8]=seo.metaImage&populate[9]=seo.metaSocial.image&pagination[pageSize]=1000&pagination[page]=1'
    ),
    // Solutions with full populate
    fetchFromStrapi<StrapiSolution>(
      'api/solutions/?populate[icon]=icon&populate[stats]=*&populate[steps][populate][products]=*&populate[seo][populate]=*,metaImage,metaSocial.image&populate[products][populate][0]=logo&populate[bannerLinks][populate][0]=icon&populate[webinars][populate][coverImage][populate][0]=image&populate[webinars][populate][webinarSpeakers][populate][0]=avatar&populate[webinars][populate][relatedLinks][populate][0]=links&populate[webinars][populate][relatedResources][populate][resources][populate][0]=image&populate[webinars][populate][relatedResources][populate][downloadableDocuments][populate]=*&populate[webinars][populate][seo][populate]=*,metaImage,metaSocial.image&populate[webinars][populate][questionsAndAnswers]=*&populate[webinars][populate][webinarCategory][populate][0]=icon&populate[webinars][populate][headerImage][populate][0]=image&populate[caseHistories][populate][0]=case_histories&populate[caseHistories][populate][1]=case_histories.image&pagination[pageSize]=1000&pagination[page]=1'
    ),
    // Release notes with full populate
    fetchFromStrapi<StrapiReleaseNote>(
      'api/release-notes/?populate[bannerLinks][populate][0]=icon&populate[product][populate][0]=logo&populate[product][populate][1]=bannerLinks.icon&populate[product][populate][2]=overview&populate[product][populate][3]=quickstart_guide&populate[product][populate][4]=release_note&populate[product][populate][5]=api_data_list_page&populate[product][populate][6]=api_data_list_page.apiData.*&populate[product][populate][7]=api_data_list_page.apiData.apiRestDetail.slug&populate[product][populate][8]=api_data_list_page.apiData.apiRestDetail.specUrls&populate[product][populate][9]=api_data_list_page.apiData.apiSoapDetail.*&populate[product][populate][10]=guide_list_page&populate[product][populate][11]=tutorial_list_page&populate[seo][populate]=*,metaImage,metaSocial.image&pagination[pageSize]=1000&pagination[page]=1'
    ),
    // Guide list pages
    fetchFromStrapi<StrapiGuideListPageResponse>(
      'api/guide-list-pages/?populate%5Bproduct%5D%5Bpopulate%5D%5B0%5D=logo&populate%5Bproduct%5D%5Bpopulate%5D%5B1%5D=bannerLinks.icon&populate%5Bproduct%5D%5Bpopulate%5D%5B2%5D=overview&populate%5Bproduct%5D%5Bpopulate%5D%5B3%5D=quickstart_guide&populate%5Bproduct%5D%5Bpopulate%5D%5B4%5D=release_note&populate%5Bproduct%5D%5Bpopulate%5D%5B5%5D=api_data_list_page&populate%5Bproduct%5D%5Bpopulate%5D%5B6%5D=api_data_list_page.apiData.%2A&populate%5Bproduct%5D%5Bpopulate%5D%5B7%5D=api_data_list_page.apiData.apiRestDetail.%2A&populate%5Bproduct%5D%5Bpopulate%5D%5B8%5D=guide_list_page&populate%5Bproduct%5D%5Bpopulate%5D%5B9%5D=tutorial_list_page&populate%5BguidesByCategory%5D%5Bpopulate%5D%5B0%5D=guides.mobileImage&populate%5BguidesByCategory%5D%5Bpopulate%5D%5B1%5D=guides.image&populate%5BguidesByCategory%5D%5Bpopulate%5D%5B2%5D=guides.listItems&populate%5BbannerLinks%5D%5Bpopulate%5D%5B0%5D=icon&populate%5Bseo%5D%5Bpopulate%5D=%2A%2CmetaImage%2CmetaSocial.image'
    ),
    // Solution list page
    fetchFromStrapi<StrapiSolutionListPageResponse>(
      'api/solution-list-page/?populate%5Bsolutions%5D%5Bpopulate%5D%5B0%5D=bannerLinks&populate%5Bsolutions%5D%5Bpopulate%5D%5B1%5D=bannerLinks.icon&populate%5Bsolutions%5D%5Bpopulate%5D%5B2%5D=products.logo&populate%5Bsolutions%5D%5Bpopulate%5D%5B3%5D=icon&populate%5Bsolutions%5D%5Bpopulate%5D%5B4%5D=icon.name&populate%5Bsolutions%5D%5Bpopulate%5D%5B5%5D=stats&populate%5Bsolutions%5D%5Bpopulate%5D%5B6%5D=steps&populate%5Bsolutions%5D%5Bpopulate%5D%5B7%5D=steps.products&populate%5Bsolutions%5D%5Bpopulate%5D%5B8%5D=webinars&populate%5Bsolutions%5D%5Bpopulate%5D%5B9%5D=webinars.coverImage&populate%5Bsolutions%5D%5Bpopulate%5D%5B10%5D=caseHistories&populate%5Bsolutions%5D%5Bpopulate%5D%5B11%5D=caseHistories.case_histories&populate%5Bsolutions%5D%5Bpopulate%5D%5B12%5D=caseHistories.case_histories.image&populate%5BcaseHistories%5D%5Bpopulate%5D%5B0%5D=case_histories&populate%5BcaseHistories%5D%5Bpopulate%5D%5B1%5D=case_histories.image&populate%5Bfeatures%5D%5Bpopulate%5D%5B0%5D=items.icon&populate%5Bseo%5D%5Bpopulate%5D=%2A%2CmetaImage%2CmetaSocial.image'
    ),
  ]);

  console.log(
    `Fetched ${guidesResult.data.length} guides, ${solutionsResult.data.length} solutions, ${releaseNotesResult.data.length} release notes`
  );

  return {
    guides: guidesResult.data,
    solutions: solutionsResult.data,
    releaseNotes: releaseNotesResult.data,
    guidesRawResponse: guidesResult.responseJson,
    solutionsRawResponse: solutionsResult.responseJson,
    releaseNotesRawResponse: releaseNotesResult.responseJson,
    guideListPagesResponse: guideListPagesResponse.data,
    solutionListPageResponse: solutionListPageResponse.data,
  };
}

// Generate URL path helper functions
function generateUrlPath(
  filePath: string,
  slug: string,
  productSlug?: string,
  versionName?: string,
  metadataType: MetadataType = MetadataType.Guide,
  landingFile?: string
): string {
  const isS3Path = filePath.includes(S3_PATH_TO_GITBOOK_DOCS);
  const restOfPath = isS3Path
    ? sitePathFromS3Path(filePath, landingFile)
    : sitePathFromLocalPath(filePath, landingFile);

  switch (metadataType) {
    case MetadataType.Guide:
      return [`/${productSlug}`, 'guides', slug, versionName, restOfPath]
        .filter(Boolean)
        .join('/');
    case MetadataType.Solution:
      return ['/solutions', slug, 'details', restOfPath]
        .filter(Boolean)
        .join('/');
    case MetadataType.ReleaseNote:
      return [`/${productSlug}`, 'release-note', slug, restOfPath]
        .filter(Boolean)
        .join('/');
  }
}

// Get markdown files recursively (for URL parsing metadata)
async function getMarkdownFilesRecursively(dir: string): Promise<string[]> {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (!fs.existsSync(fullPath)) return [];
      if (entry.isDirectory()) {
        return getMarkdownFilesRecursively(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        return [fullPath];
      } else {
        return [];
      }
    })
  );
  return files.flat();
}

// Process guide metadata
async function processGuidesMetadata(
  guides: StrapiGuide[]
): Promise<SitemapItem[]> {
  const guideInfoList: MetadataInfo[] = guides
    .filter((guide) => !!guide.attributes.product?.data?.attributes?.slug)
    .flatMap((guide) =>
      guide.attributes.versions.map((version) => ({
        versionName: version.version,
        isMainVersion: version.main,
        dirName: version.dirName,
        slug: guide.attributes.slug,
        productSlug: `${guide.attributes.product?.data?.attributes?.slug}`,
        metadataType: MetadataType.Guide,
      }))
    );

  const items: SitemapItem[] = [];

  for (const guideInfo of guideInfoList) {
    const guideFiles = (
      await cachedListS3Files(`${S3_PATH_TO_GITBOOK_DOCS}/${guideInfo.dirName}`)
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

      const content = await cachedDownloadS3File(filePath);
      const title = extractTitleFromMarkdown(content);

      if (menuPath && content) {
        const path = generateUrlPath(
          filePath,
          guideInfo.slug,
          guideInfo.productSlug,
          guideInfo.versionName,
          MetadataType.Guide
        );

        const baseItem: SitemapItem = {
          path,
          dirName: guideInfo.dirName,
          contentS3Path: filePath,
          menuS3Path: menuPath,
          title: title || path.split('/').pop() || 'Untitled',
          version: guideInfo.versionName,
        };

        items.push(baseItem);

        if (guideInfo.isMainVersion) {
          const versionlessPath = generateUrlPath(
            filePath,
            guideInfo.slug,
            guideInfo.productSlug,
            undefined,
            MetadataType.Guide
          );

          items.push({
            ...baseItem,
            path: versionlessPath,
          });
        }
      }
    }
  }

  return items;
}

// Process solutions metadata
async function processSolutionsMetadata(
  solutions: StrapiSolution[]
): Promise<SitemapItem[]> {
  const items: SitemapItem[] = [];

  for (const solution of solutions) {
    const dirName = solution.attributes.dirName;
    if (!dirName) continue;

    const solutionFiles = (
      await cachedListS3Files(`${S3_PATH_TO_GITBOOK_DOCS}/${dirName}`)
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

      const content = await cachedDownloadS3File(filePath);
      const title = extractTitleFromMarkdown(content);

      if (menuPath && content) {
        const path = generateUrlPath(
          filePath,
          solution.attributes.slug,
          undefined,
          undefined,
          MetadataType.Solution,
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

// Process release notes metadata
async function processReleaseNotesMetadata(
  releaseNotes: StrapiReleaseNote[]
): Promise<SitemapItem[]> {
  const items: SitemapItem[] = [];

  for (const releaseNote of releaseNotes) {
    const dirName = releaseNote.attributes.dirName;
    if (!dirName) continue;

    const releaseNoteFiles = (
      await cachedListS3Files(`${S3_PATH_TO_GITBOOK_DOCS}/${dirName}`)
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

      const content = await cachedDownloadS3File(filePath);
      const title = extractTitleFromMarkdown(content);
      const productSlug =
        releaseNote.attributes.product?.data?.attributes?.slug;

      if (dirName && menuPath && content && productSlug) {
        const path = generateUrlPath(
          filePath,
          releaseNote.attributes.slug,
          productSlug,
          undefined,
          MetadataType.ReleaseNote,
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

// Generate URL parsing metadata
async function generateUrlParsingMetadata(
  data: StrapiData
): Promise<UrlParsingItem[]> {
  const guideInfoList: MetadataInfo[] = data.guides
    .filter((guide) => !!guide.attributes.product?.data?.attributes?.slug)
    .flatMap((guide) =>
      guide.attributes.versions.map((version) => ({
        versionName: version.version,
        isMainVersion: version.main,
        dirName: version.dirName,
        slug: guide.attributes.slug,
        productSlug: `${guide.attributes.product?.data?.attributes?.slug}`,
        metadataType: MetadataType.Guide,
      }))
    );

  const solutionInfoList: MetadataInfo[] = data.solutions
    .filter((solution) => !!solution.attributes.dirName)
    .map((solution) => ({
      versionName: '',
      isMainVersion: true,
      dirName: solution.attributes.dirName,
      slug: solution.attributes.slug,
      productSlug: '',
      metadataType: MetadataType.Solution,
    }));

  const releaseNoteInfoList: MetadataInfo[] = data.releaseNotes
    .filter(
      (releaseNote) =>
        !!releaseNote.attributes.dirName &&
        !!releaseNote.attributes.product?.data?.attributes?.slug
    )
    .map((releaseNote) => ({
      versionName: '',
      isMainVersion: true,
      dirName: releaseNote.attributes.dirName,
      slug: releaseNote.attributes.slug,
      productSlug: `${releaseNote.attributes.product?.data?.attributes?.slug}`,
      metadataType: MetadataType.ReleaseNote,
    }));

  const allInfoList = [
    ...guideInfoList,
    ...solutionInfoList,
    ...releaseNoteInfoList,
  ];
  const urlParsingItems: UrlParsingItem[] = [];

  for (const info of allInfoList) {
    const files = await getMarkdownFilesRecursively(
      path.join(DOCUMENTATION_PATH, info.dirName)
    );

    const docs = files.map((filePath) => ({
      path: filePath,
      url: generateUrlPath(
        filePath,
        info.slug,
        info.productSlug,
        info.versionName,
        info.metadataType
      ),
    }));

    urlParsingItems.push({
      dirName: info.dirName,
      docs,
    });
  }

  return urlParsingItems;
}

// Main function
async function main() {
  try {
    console.log('Starting unified metadata sync...');
    console.log(`Metadata type: ${METADATA_TYPE}`);
    console.log(`Generate URL metadata: ${GENERATE_URL_METADATA}`);
    console.log(`Generate sitemap metadata: ${GENERATE_SITEMAP_METADATA}`);
    console.log(`Save Strapi responses: ${SAVE_STRAPI_RESPONSES}`);

    // Fetch all data from Strapi once
    const strapiData = await fetchAllStrapiData();

    const metadataFilter = {
      guides: METADATA_TYPE === 'all' || METADATA_TYPE === 'guides',
      solutions: METADATA_TYPE === 'all' || METADATA_TYPE === 'solutions',
      releaseNotes:
        METADATA_TYPE === 'all' || METADATA_TYPE === 'release_notes',
    };

    // Save synced responses
    if (SAVE_STRAPI_RESPONSES && metadataFilter.guides) {
      await writeSitemapJson(
        strapiData.guidesRawResponse,
        getSyncedGuidesResponseJsonPath(),
        S3_BUCKET_NAME!,
        getS3Client()
      );
      await writeSitemapJson(
        strapiData.guideListPagesResponse,
        getSyncedGuideListPagesResponseJsonPath(),
        S3_BUCKET_NAME!,
        getS3Client()
      );
    }

    if (SAVE_STRAPI_RESPONSES && metadataFilter.solutions) {
      await writeSitemapJson(
        strapiData.solutionsRawResponse,
        getSyncedSolutionsResponseJsonPath(),
        S3_BUCKET_NAME!,
        getS3Client()
      );
      await writeSitemapJson(
        strapiData.solutionListPageResponse,
        getSyncedSolutionListPagesResponseJsonPath(),
        S3_BUCKET_NAME!,
        getS3Client()
      );
    }

    if (SAVE_STRAPI_RESPONSES && metadataFilter.releaseNotes) {
      await writeSitemapJson(
        strapiData.releaseNotesRawResponse,
        getSyncedReleaseNotesResponseJsonPath(),
        S3_BUCKET_NAME!,
        getS3Client()
      );
    }

    // Generate URL parsing metadata if needed
    if (GENERATE_URL_METADATA) {
      console.log('Generating URL parsing metadata...');
      const urlParsingMetadata = await generateUrlParsingMetadata(strapiData);
      await writeFile(
        URL_PARSING_METADATA_JSON_PATH,
        JSON.stringify(urlParsingMetadata, null, 2)
      );
      console.log(
        `URL parsing metadata saved to ${URL_PARSING_METADATA_JSON_PATH}`
      );
    }

    // Process and save guides metadata
    if (GENERATE_SITEMAP_METADATA && metadataFilter.guides) {
      console.log('Processing guides metadata...');
      const guidesSitemap = await processGuidesMetadata(strapiData.guides);
      await writeSitemapJson(
        guidesSitemap,
        S3_GUIDE_METADATA_JSON_PATH,
        S3_BUCKET_NAME!,
        getS3Client()
      );
      console.log(`Saved ${guidesSitemap.length} guide items to S3`);
    }

    // Process and save solutions metadata
    if (GENERATE_SITEMAP_METADATA && metadataFilter.solutions) {
      console.log('Processing solutions metadata...');
      const solutionsSitemap = await processSolutionsMetadata(
        strapiData.solutions
      );
      await writeSitemapJson(
        solutionsSitemap,
        S3_SOLUTIONS_METADATA_JSON_PATH,
        S3_BUCKET_NAME!,
        getS3Client()
      );
      console.log(`Saved ${solutionsSitemap.length} solution items to S3`);
    }

    // Process and save release notes metadata
    if (GENERATE_SITEMAP_METADATA && metadataFilter.releaseNotes) {
      console.log('Processing release notes metadata...');
      const releaseNotesSitemap = await processReleaseNotesMetadata(
        strapiData.releaseNotes
      );
      await writeSitemapJson(
        releaseNotesSitemap,
        S3_RELEASE_NOTES_METADATA_JSON_PATH,
        S3_BUCKET_NAME!,
        getS3Client()
      );
      console.log(
        `Saved ${releaseNotesSitemap.length} release note items to S3`
      );
    }

    console.log('Metadata sync completed successfully!');
    console.log(
      `Cache stats: ${s3FileCache.size} files cached, ${s3ListCache.size} directories cached`
    );
  } catch (error) {
    console.error('Error during metadata sync:', error);
    process.exit(1);
  }
}

main();
