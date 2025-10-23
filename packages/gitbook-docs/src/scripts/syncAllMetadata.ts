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
import qs from 'qs';
import { SitemapItem } from '../sitemapItem';
import { makeS3Client, writeSitemapJson } from '../helpers/s3Bucket.helper';
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
  StrapiProduct,
  StrapiApiData,
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
import { baseUrl } from 'nextjs-website/src/config';

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

const SITEMAP_URL = process.env.SITEMAP_URL || `${baseUrl}/sitemap.xml`;
const S3_SITEMAP_PATH = process.env.S3_SITEMAP_PATH || 'sitemap.xml';
const S3_PRODUCTS_METADATA_JSON_PATH =
  process.env.S3_PRODUCTS_METADATA_JSON_PATH || 'synced-products-response.json';
const S3_APIS_DATA_METADATA_JSON_PATH =
  process.env.S3_APIS_DATA_METADATA_JSON_PATH ||
  'synced-apis-data-response.json';

const DOCUMENTATION_ABSOLUTE_PATH = path.resolve(DOCUMENTATION_PATH);

const STRAPI_PAGE_SIZE = 1000;

const STRAPI_DEFAULT_PAGINATION = {
  pagination: {
    pageSize: STRAPI_PAGE_SIZE,
    page: 1,
  },
};

const productRelationsPopulate = {
  populate: [
    'logo',
    'bannerLinks.icon',
    'overview',
    'quickstart_guide',
    'release_note',
    'api_data_list_page',
    'api_data_list_page.apiData.*',
    'api_data_list_page.apiData.apiRestDetail.*',
    'guide_list_page',
    'tutorial_list_page',
    'use_case_list_page',
  ],
};

const webinarPopulate = {
  populate: {
    coverImage: {
      populate: ['image'],
    },
    webinarSpeakers: {
      populate: ['avatar'],
    },
    relatedLinks: {
      populate: ['links'],
    },
    relatedResources: {
      populate: {
        resources: {
          populate: ['image'],
        },
        downloadableDocuments: {
          populate: '*',
        },
      },
    },
    seo: {
      populate: '*,metaImage,metaSocial.image',
    },
    questionsAndAnswers: '*',
    webinarCategory: {
      populate: ['icon'],
    },
    headerImage: {
      populate: ['image'],
    },
  },
};

const guidesPopulate = {
  populate: {
    image: { populate: '*' },
    mobileImage: { populate: '*' },
    listItems: { populate: '*' },
    versions: { populate: '*' },
    bannerLinks: { populate: ['icon'] },
    seo: { populate: '*,metaImage,metaSocial.image' },
    product: {
      ...productRelationsPopulate,
    },
  },
};

const guidesQueryParams = {
  ...guidesPopulate,
  ...STRAPI_DEFAULT_PAGINATION,
};

const releaseNotesQueryParams = {
  populate: {
    bannerLinks: {
      populate: ['icon'],
    },
    product: {
      populate: [
        'logo',
        'bannerLinks.icon',
        'overview',
        'quickstart_guide',
        'release_note',
        'api_data_list_page',
        'api_data_list_page.apiData.*',
        'api_data_list_page.apiData.apiRestDetail.slug',
        'api_data_list_page.apiData.apiRestDetail.specUrls',
        'api_data_list_page.apiData.apiSoapDetail.*',
        'guide_list_page',
        'tutorial_list_page',
        'use_case_list_page',
      ],
    },
    seo: {
      populate: '*,metaImage,metaSocial.image',
    },
  },
  ...STRAPI_DEFAULT_PAGINATION,
};

const solutionsPopulate = {
  populate: {
    icon: 'icon',
    stats: '*',
    steps: {
      populate: {
        products: '*',
      },
    },
    seo: {
      populate: '*,metaImage,metaSocial.image',
    },
    products: {
      populate: ['logo'],
    },
    bannerLinks: {
      populate: ['icon'],
    },
    webinars: {
      ...webinarPopulate,
    },
    caseHistories: {
      populate: ['case_histories', 'case_histories.image'],
    },
  },
};

const solutionsQueryParams = {
  ...solutionsPopulate,
  ...STRAPI_DEFAULT_PAGINATION,
};

const productsQueryParams = {
  ...STRAPI_DEFAULT_PAGINATION,
};

const apisDataPopulate = {
  populate: {
    product: {
      populate: '*',
    },
    apiRestDetail: {
      populate: {
        specUrls: {
          populate: '*',
        },
      },
    },
    apiSoapDetail: {
      populate: '*',
    },
  },
};

const apisDataQueryParams = {
  ...apisDataPopulate,
  ...STRAPI_DEFAULT_PAGINATION,
};

const guideListPagesQueryParams = {
  populate: {
    product: {
      ...productRelationsPopulate,
    },
    guidesByCategory: {
      populate: {
        guides: {
          populate: ['mobileImage', 'image', 'listItems'],
        },
      },
    },
    bannerLinks: {
      populate: ['icon'],
    },
    seo: {
      populate: '*,metaImage,metaSocial.image',
    },
  },
};

const solutionListPageQueryParams = {
  populate: {
    solutions: {
      populate: [
        'bannerLinks',
        'bannerLinks.icon',
        'products.logo',
        'icon',
        'icon.name',
        'stats',
        'steps',
        'steps.products',
        'webinars',
        'webinars.coverImage',
        'caseHistories',
        'caseHistories.case_histories',
        'caseHistories.case_histories.image',
      ],
    },
    caseHistories: {
      populate: ['case_histories', 'case_histories.image'],
    },
    features: {
      populate: ['items.icon'],
    },
    seo: {
      populate: '*,metaImage,metaSocial.image',
    },
  },
};

const guidesQueryString = qs.stringify(guidesQueryParams);
const solutionsQueryString = qs.stringify(solutionsQueryParams);
const productsQueryString = qs.stringify(productsQueryParams);
const apisDataQueryString = qs.stringify(apisDataQueryParams);
const releaseNotesQueryString = qs.stringify(releaseNotesQueryParams);
const guideListPagesQueryString = qs.stringify(guideListPagesQueryParams);
const solutionListPageQueryString = qs.stringify(solutionListPageQueryParams);

interface StrapiData {
  guides: StrapiGuide[];
  solutions: StrapiSolution[];
  releaseNotes: StrapiReleaseNote[];
  products: StrapiProduct[];
  apisData: StrapiApiData[];
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

function localPathToS3Path(localPath: string): string {
  const relativePath = path
    .relative(DOCUMENTATION_ABSOLUTE_PATH, path.resolve(localPath))
    .split(path.sep)
    .join('/');
  const basePath = S3_PATH_TO_GITBOOK_DOCS.replace(/\\/g, '/').replace(
    /\/$/,
    ''
  );
  if (relativePath.startsWith('..')) {
    console.warn(
      `Cannot derive S3 path for ${localPath}; falling back to base directory ${basePath}`
    );
    const sanitizedPath = relativePath.replace(/^(\.\.\/?)+/, '');
    return sanitizedPath ? `${basePath}/${sanitizedPath}` : basePath;
  }
  return `${basePath}/${relativePath}`;
}

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = makeS3Client();
  }
  return s3Client;
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
    productsResult,
    apisDataResult,
  ] = await Promise.all([
    // Guides with full populate
    fetchFromStrapi<StrapiGuide>(`api/guides?${guidesQueryString}`),
    // Solutions with full populate
    fetchFromStrapi<StrapiSolution>(`api/solutions/?${solutionsQueryString}`),
    // Release notes with full populate
    fetchFromStrapi<StrapiReleaseNote>(
      `api/release-notes/?${releaseNotesQueryString}`
    ),
    // Guide list pages
    fetchFromStrapi<StrapiGuideListPageResponse>(
      `api/guide-list-pages/?${guideListPagesQueryString}`
    ),
    // Solution list page
    fetchFromStrapi<StrapiSolutionListPageResponse>(
      `api/solution-list-page/?${solutionListPageQueryString}`
    ),
    // Products
    fetchFromStrapi<StrapiProduct>(`api/products?${productsQueryString}`),
    // APIs data
    fetchFromStrapi<StrapiApiData>(`api/apis-data?${apisDataQueryString}`),
  ]);

  console.log(
    `Fetched ${guidesResult.data.length} guides, ${solutionsResult.data.length} solutions, ${releaseNotesResult.data.length} release notes, ${productsResult.data.length} products, ${apisDataResult.data.length} apis data entries`
  );

  return {
    guides: guidesResult.data,
    solutions: solutionsResult.data,
    releaseNotes: releaseNotesResult.data,
    products: productsResult.data,
    apisData: apisDataResult.data,
    guidesRawResponse: guidesResult.responseJson,
    solutionsRawResponse: solutionsResult.responseJson,
    releaseNotesRawResponse: releaseNotesResult.responseJson,
    guideListPagesResponse: guideListPagesResponse.data,
    solutionListPageResponse: solutionListPageResponse.data,
  };
}

async function fetchSitemapXml(): Promise<string> {
  console.log(`Fetching sitemap from ${SITEMAP_URL}...`);
  const response = await fetch(SITEMAP_URL);
  if (!response.ok) {
    // eslint
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error(
      `Failed to fetch sitemap: ${response.status} ${response.statusText}`
    );
  }
  return await response.text();
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
  if (!fs.existsSync(dir)) {
    console.warn(`Skipping missing documentation directory ${dir}`);
    return [];
  }
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
    const guideDir = path.join(DOCUMENTATION_PATH, guideInfo.dirName);
    if (!fs.existsSync(guideDir)) {
      console.warn(`Guide directory not found for ${guideInfo.dirName}`);
      continue;
    }

    const guideFiles = await getMarkdownFilesRecursively(guideDir);
    const menuLocalPath = guideFiles.find((file) =>
      file.replace(/\\/g, '/').endsWith(`${guideInfo.dirName}/SUMMARY.md`)
    );
    const menuS3Path = menuLocalPath
      ? localPathToS3Path(menuLocalPath)
      : undefined;

    for (const filePath of guideFiles) {
      const normalizedFilePath = filePath.replace(/\\/g, '/');
      const parts = normalizedFilePath.split('/');
      if (
        parts.length <= 2 ||
        normalizedFilePath.endsWith('/SUMMARY.md') ||
        normalizedFilePath.includes('.gitbook/includes')
      ) {
        continue;
      }

      const content = await fs.promises.readFile(filePath, 'utf8');
      const title = extractTitleFromMarkdown(content);

      if (menuS3Path && content) {
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
          contentS3Path: localPathToS3Path(filePath),
          menuS3Path,
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

    const solutionDir = path.join(DOCUMENTATION_PATH, dirName);
    if (!fs.existsSync(solutionDir)) {
      console.warn(`Solution directory not found for ${dirName}`);
      continue;
    }

    const solutionFiles = await getMarkdownFilesRecursively(solutionDir);
    const menuLocalPath = solutionFiles.find((file) =>
      file.replace(/\\/g, '/').endsWith(`${dirName}/SUMMARY.md`)
    );
    const menuS3Path = menuLocalPath
      ? localPathToS3Path(menuLocalPath)
      : undefined;

    for (const filePath of solutionFiles) {
      const normalizedFilePath = filePath.replace(/\\/g, '/');
      const parts = normalizedFilePath.split('/');
      if (
        parts.length <= 2 ||
        normalizedFilePath.endsWith('/SUMMARY.md') ||
        normalizedFilePath.includes('.gitbook/includes')
      ) {
        continue;
      }

      const content = await fs.promises.readFile(filePath, 'utf8');
      const title = extractTitleFromMarkdown(content);

      if (menuS3Path && content) {
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
          contentS3Path: localPathToS3Path(filePath),
          menuS3Path,
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

    const releaseNoteDir = path.join(DOCUMENTATION_PATH, dirName);
    if (!fs.existsSync(releaseNoteDir)) {
      console.warn(`Release note directory not found for ${dirName}`);
      continue;
    }

    const releaseNoteFiles = await getMarkdownFilesRecursively(releaseNoteDir);
    const menuLocalPath = releaseNoteFiles.find((file) =>
      file.replace(/\\/g, '/').endsWith(`${dirName}/SUMMARY.md`)
    );
    const menuS3Path = menuLocalPath
      ? localPathToS3Path(menuLocalPath)
      : undefined;

    for (const filePath of releaseNoteFiles) {
      const normalizedFilePath = filePath.replace(/\\/g, '/');
      const parts = normalizedFilePath.split('/');
      if (
        parts.length <= 2 ||
        normalizedFilePath.endsWith('/SUMMARY.md') ||
        normalizedFilePath.includes('.gitbook/includes')
      ) {
        continue;
      }

      const content = await fs.promises.readFile(filePath, 'utf8');
      const title = extractTitleFromMarkdown(content);
      const productSlug =
        releaseNote.attributes.product?.data?.attributes?.slug;

      if (dirName && menuS3Path && content && productSlug) {
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
          contentS3Path: localPathToS3Path(filePath),
          menuS3Path,
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

    if (SAVE_STRAPI_RESPONSES) {
      console.log('Saving Strapi products, APIs data, and sitemap...');
      await writeSitemapJson(
        strapiData.products,
        S3_PRODUCTS_METADATA_JSON_PATH,
        S3_BUCKET_NAME!,
        getS3Client()
      );
      await writeSitemapJson(
        strapiData.apisData,
        S3_APIS_DATA_METADATA_JSON_PATH,
        S3_BUCKET_NAME!,
        getS3Client()
      );
      const sitemapXml = await fetchSitemapXml();
      await writeSitemapJson(
        sitemapXml,
        S3_SITEMAP_PATH,
        S3_BUCKET_NAME!,
        getS3Client()
      );
    }

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
  } catch (error) {
    console.error('Error during metadata sync:', error);
    process.exit(1);
  }
}

main();
