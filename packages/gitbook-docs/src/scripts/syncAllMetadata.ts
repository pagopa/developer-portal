/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-let */

import dotenv from 'dotenv';
import * as fs from 'fs';
import path from 'path';
import { MetadataItem } from '../metadataItem';
import {
  downloadS3File,
  makeS3Client,
  putS3File,
} from '../helpers/s3Bucket.helper';
import { S3Client } from '@aws-sdk/client-s3';
import { extractTitleFromMarkdown } from '../helpers/extractTitle.helper';
import { fetchFromStrapi } from '../helpers/fetchFromStrapi';
import { MetadataInfo, MetadataType } from '../helpers/guidesMetadataHelper';
import { sitePathFromS3Path } from '../helpers/sitePathFromS3Path';
import {
  getSyncedApisDataResponseJsonPath,
  getSyncedGuidesResponseJsonPath,
  getSyncedProductsResponseJsonPath,
  getSyncedReleaseNotesResponseJsonPath,
  getSyncedSolutionsResponseJsonPath,
} from '../syncedResponses';
import { DOCUMENTATION_PATH } from '../helpers/documentationParsing.helper';
import {
  StrapiApiData,
  StrapiGuide,
  StrapiGuidesResponse,
  StrapiProduct,
  StrapiReleaseNote,
  StrapiReleaseNotesResponse,
  StrapiSolution,
  StrapiSolutionsResponse,
} from '../helpers/strapiTypes';
import {
  apisDataQueryString,
  getReleaseNotesQueryString,
  getSolutionsQueryString,
  guidesQueryString,
  productsQueryString,
} from '../helpers/strapiQuery';
import { compact } from 'lodash';

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

// TODO: rename
const GENERATE_METADATA = process.env.GENERATE_SITEMAP_METADATA !== 'false';
const SAVE_STRAPI_RESPONSES = process.env.SAVE_STRAPI_RESPONSES !== 'false';
const GENERATE_ROOT_METADATA_FILE =
  process.env.GENERATE_ROOT_METADATA_FILE !== 'false';

// Optional filter to sync only specific directories
// Format: comma-separated list of dirNames (e.g., "dir1,dir2,dir3")
// When provided, only guides/solutions/release-notes with matching dirNames will be synced
const DIR_NAMES_FILTER = process.env.DIR_NAMES_FILTER
  ? process.env.DIR_NAMES_FILTER.split(',').map((name) => name.trim())
  : undefined;
const S3_MAIN_GUIDE_VERSIONS_DIRNAMES_JSON_PATH =
  process.env.S3_MAIN_GUIDE_VERSIONS_DIRNAMES_JSON_PATH ||
  'main-guide-versions-dirNames.json';
const S3_MAIN_GUIDE_VERSIONS_DIRNAMES_TO_REMOVE_JSON_PATH =
  process.env.S3_MAIN_GUIDE_VERSIONS_DIRNAMES_TO_REMOVE_JSON_PATH ||
  'main-guide-versions-dirNames-to-remove.json';

// S3 paths for metadata files
const S3_GUIDE_METADATA_JSON_PATH =
  process.env.S3_GUIDE_METADATA_JSON_PATH || 'guides-metadata.json';
const S3_SOLUTIONS_METADATA_JSON_PATH =
  process.env.S3_SOLUTIONS_METADATA_JSON_PATH || 'solutions-metadata.json';
const S3_RELEASE_NOTES_METADATA_JSON_PATH =
  process.env.S3_RELEASE_NOTES_METADATA_JSON_PATH ||
  'release-notes-metadata.json';
const S3_DIRNAME_METADATA_JSON_PATH =
  process.env.S3_DIRNAME_METADATA_JSON_PATH || 'metadata.json';
const S3_SOLUTIONS_DIRNAMES_JSON_PATH =
  process.env.S3_SOLUTIONS_DIRNAMES_JSON_PATH || 'solutions-dirNames.json';
const S3_RELEASE_NOTES_DIRNAMES_JSON_PATH =
  process.env.S3_RELEASE_NOTES_DIRNAMES_JSON_PATH ||
  'release-notes-dirNames.json';

const DOCUMENTATION_ABSOLUTE_PATH = path.resolve(DOCUMENTATION_PATH);

interface StrapiData {
  guides: StrapiGuide[];
  solutions: StrapiSolution[];
  releaseNotes: StrapiReleaseNote[];
  products: StrapiProduct[];
  apisData: StrapiApiData[];
  guidesRawResponse?: StrapiGuidesResponse;
  solutionsRawResponse?: StrapiSolutionsResponse;
  releaseNotesRawResponse?: StrapiReleaseNotesResponse;
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
  if (DIR_NAMES_FILTER) {
    console.log(
      `Applying dirName filter: ${DIR_NAMES_FILTER.join(', ')} (${
        DIR_NAMES_FILTER.length
      } directories)`
    );
  }

  const [
    guidesResult,
    solutionsResult,
    releaseNotesResult,
    productsResult,
    apisDataResult,
  ] = await Promise.all([
    // Guides with full populate
    // NOTE: Cannot filter by versions.dirName server-side due to Strapi v4 component array limitation
    // Client-side filtering will be applied later in processGuidesMetadata
    fetchFromStrapi<StrapiGuide>(`api/guides?${guidesQueryString}`),
    // Solutions with dirName filter (if provided)
    fetchFromStrapi<StrapiSolution>(
      `api/solutions/?${getSolutionsQueryString(DIR_NAMES_FILTER)}`
    ),
    // Release notes with dirName filter (if provided)
    fetchFromStrapi<StrapiReleaseNote>(
      `api/release-notes/?${getReleaseNotesQueryString(DIR_NAMES_FILTER)}`
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
  // Convert local path to S3 path if needed, then extract site path
  const normalizedFilePath = filePath.replace(/\\/g, '/');
  const normalizedS3Base = S3_PATH_TO_GITBOOK_DOCS.replace(/\\/g, '/').replace(
    /^\/+/,
    ''
  );
  const isAlreadyS3Path =
    normalizedFilePath.startsWith(normalizedS3Base) ||
    normalizedFilePath.startsWith(`/${normalizedS3Base}`);
  const s3Path = isAlreadyS3Path
    ? normalizedFilePath
    : localPathToS3Path(filePath);
  const restOfPath = sitePathFromS3Path(s3Path, landingFile);

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
  guides: StrapiGuide[],
  skipFilter = false
): Promise<MetadataItem[][]> {
  const guideInfoList: MetadataInfo[] = guides
    .filter((guide) => !!guide.attributes.product?.data?.attributes?.slug)
    .flatMap((guide) =>
      guide.attributes.versions
        // Client-side filtering for guides: filter by dirName if DIR_NAMES_FILTER is provided
        .filter(
          (version) =>
            skipFilter ||
            !DIR_NAMES_FILTER ||
            DIR_NAMES_FILTER.includes(version.dirName)
        )
        .map((version) => ({
          versionName: version.version,
          isMainVersion: version.main,
          dirName: version.dirName,
          slug: guide.attributes.slug,
          productSlug: `${guide.attributes.product?.data?.attributes?.slug}`,
          metadataType: MetadataType.Guide,
        }))
    );

  const items: MetadataItem[][] = [];

  for (const guideInfo of guideInfoList) {
    const guideDir = path.join(DOCUMENTATION_PATH, guideInfo.dirName);
    if (!fs.existsSync(guideDir)) {
      console.warn(`Guide directory not found for ${guideInfo.dirName}`);
      continue;
    }

    const guideItems: MetadataItem[] = [];
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

        const baseItem: MetadataItem = {
          path,
          dirName: guideInfo.dirName,
          contentS3Path: localPathToS3Path(filePath),
          menuS3Path,
          title: title || path.split('/').pop() || 'Untitled',
          version: guideInfo.versionName,
        };

        guideItems.push(baseItem);

        if (guideInfo.isMainVersion) {
          const versionlessPath = generateUrlPath(
            filePath,
            guideInfo.slug,
            guideInfo.productSlug,
            undefined,
            MetadataType.Guide
          );

          guideItems.push({
            ...baseItem,
            path: versionlessPath,
          });
        }
      }
    }
    items.push(guideItems);
  }

  return items;
}

function getMainVersionsDirNames(guides: StrapiGuide[]): {
  dirNames: string[];
} {
  return {
    dirNames: compact(
      guides.flatMap((guide) =>
        guide.attributes.versions.map(
          (version) => version.main && version.dirName
        )
      )
    ),
  };
}

function getSolutionsDirNames(solutions: StrapiSolution[]): {
  dirNames: string[];
} {
  return {
    dirNames: compact(solutions.map((solution) => solution.attributes.dirName)),
  };
}

function getReleaseNotesDirNames(releaseNotes: StrapiReleaseNote[]): {
  dirNames: string[];
} {
  return {
    dirNames: compact(
      releaseNotes.map((releaseNote) => releaseNote.attributes.dirName)
    ),
  };
}

// Process solutions metadata
async function processSolutionsMetadata(
  solutions: StrapiSolution[]
): Promise<MetadataItem[][]> {
  const items: MetadataItem[][] = [];

  for (const solution of solutions) {
    const dirName = solution.attributes.dirName;
    if (!dirName) continue;

    const itemList: MetadataItem[] = [];
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

        itemList.push({
          path,
          dirName,
          contentS3Path: localPathToS3Path(filePath),
          menuS3Path,
          title: title || path.split('/').pop() || 'Untitled',
        });
      }
    }
    items.push(itemList);
  }

  return items;
}

// Process release notes metadata
async function processReleaseNotesMetadata(
  releaseNotes: StrapiReleaseNote[]
): Promise<MetadataItem[][]> {
  const items: MetadataItem[][] = [];

  for (const releaseNote of releaseNotes) {
    const dirName = releaseNote.attributes.dirName;
    if (!dirName) continue;

    const itemList: MetadataItem[] = [];
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

        itemList.push({
          path,
          dirName,
          contentS3Path: localPathToS3Path(filePath),
          menuS3Path,
          title: title || path.split('/').pop() || 'Untitled',
        });
      }
    }
    items.push(itemList);
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
    console.log(`Generate metadata: ${GENERATE_METADATA}`);
    console.log(`Save Strapi responses: ${SAVE_STRAPI_RESPONSES}`);
    console.log(`Generate root metadata file: ${GENERATE_ROOT_METADATA_FILE}`);
    if (DIR_NAMES_FILTER) {
      console.log(
        `DirName filter active: ${DIR_NAMES_FILTER.length} directories specified`
      );
    }

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
      await putS3File(
        strapiData.products,
        getSyncedProductsResponseJsonPath(),
        S3_BUCKET_NAME!,
        getS3Client()
      );
      await putS3File(
        strapiData.apisData,
        getSyncedApisDataResponseJsonPath(),
        S3_BUCKET_NAME!,
        getS3Client()
      );
    }

    // Save synced responses
    if (SAVE_STRAPI_RESPONSES && metadataFilter.guides) {
      await putS3File(
        strapiData.guidesRawResponse,
        getSyncedGuidesResponseJsonPath(),
        S3_BUCKET_NAME!,
        getS3Client()
      );
    }

    if (SAVE_STRAPI_RESPONSES && metadataFilter.solutions) {
      await putS3File(
        strapiData.solutionsRawResponse,
        getSyncedSolutionsResponseJsonPath(),
        S3_BUCKET_NAME!,
        getS3Client()
      );
    }

    if (SAVE_STRAPI_RESPONSES && metadataFilter.releaseNotes) {
      await putS3File(
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
      await fs.promises.writeFile(
        URL_PARSING_METADATA_JSON_PATH,
        JSON.stringify(urlParsingMetadata, null, 2)
      );
      console.log(
        `URL parsing metadata saved to ${URL_PARSING_METADATA_JSON_PATH}`
      );
    }

    const mainVersionsDirNames = getMainVersionsDirNames(strapiData.guides);
    console.log(
      `Processed ${mainVersionsDirNames.dirNames.length} main version guide items.`
    );

    const s3MainVersionsDirNamesFile = await downloadS3File(
      S3_MAIN_GUIDE_VERSIONS_DIRNAMES_JSON_PATH,
      S3_BUCKET_NAME!,
      getS3Client()
    ).catch((error) => {
      console.log(
        `No existing main versions dirNames file found in S3: ${error}. Returning empty list.`
      );
      return '{ "dirNames": [] }';
    });

    const s3MainVersionsDirNames: { dirNames: string[] } = JSON.parse(
      s3MainVersionsDirNamesFile
    );

    const setMainNames = new Set(mainVersionsDirNames.dirNames);

    const dirNamesToRemove: string[] = s3MainVersionsDirNames.dirNames.filter(
      (dirNames) => !setMainNames.has(dirNames)
    );

    if (dirNamesToRemove.length > 0) {
      await putS3File(
        { dirNames: dirNamesToRemove },
        S3_MAIN_GUIDE_VERSIONS_DIRNAMES_TO_REMOVE_JSON_PATH,
        S3_BUCKET_NAME!,
        getS3Client()
      );
    }
    await putS3File(
      mainVersionsDirNames,
      S3_MAIN_GUIDE_VERSIONS_DIRNAMES_JSON_PATH,
      S3_BUCKET_NAME!,
      getS3Client()
    );

    const solutionsDirNames = getSolutionsDirNames(strapiData.solutions);
    console.log(
      `Processed ${solutionsDirNames.dirNames.length} solution items.`
    );
    await putS3File(
      solutionsDirNames,
      S3_SOLUTIONS_DIRNAMES_JSON_PATH,
      S3_BUCKET_NAME!,
      getS3Client()
    );

    const releaseNotesDirNames = getReleaseNotesDirNames(
      strapiData.releaseNotes
    );
    console.log(
      `Processed ${releaseNotesDirNames.dirNames.length} release note items.`
    );
    await putS3File(
      releaseNotesDirNames,
      S3_RELEASE_NOTES_DIRNAMES_JSON_PATH,
      S3_BUCKET_NAME!,
      getS3Client()
    );

    // Process and save guides metadata
    if (GENERATE_METADATA && metadataFilter.guides) {
      console.log('Processing guides metadata...');
      const guidesMetadata = await processGuidesMetadata(strapiData.guides);
      if (GENERATE_ROOT_METADATA_FILE) {
        const allGuidesMetadata = await processGuidesMetadata(
          strapiData.guides,
          true
        );
        await putS3File(
          allGuidesMetadata.flat(),
          S3_GUIDE_METADATA_JSON_PATH,
          S3_BUCKET_NAME!,
          getS3Client()
        );
      }

      guidesMetadata.map(async (guideMetadata) => {
        if (guideMetadata.length > 0) {
          await putS3File(
            guideMetadata,
            path.join(
              S3_PATH_TO_GITBOOK_DOCS,
              guideMetadata[0].dirName,
              S3_DIRNAME_METADATA_JSON_PATH
            ),
            S3_BUCKET_NAME!,
            getS3Client()
          );
        }
      });

      console.log(`Saved ${guidesMetadata.length} guide items to S3`);
    }

    // Process and save solutions metadata
    if (GENERATE_METADATA && metadataFilter.solutions) {
      console.log('Processing solutions metadata...');
      const solutionsMetadata = await processSolutionsMetadata(
        strapiData.solutions
      );
      if (GENERATE_ROOT_METADATA_FILE) {
        await putS3File(
          solutionsMetadata.flat(),
          S3_SOLUTIONS_METADATA_JSON_PATH,
          S3_BUCKET_NAME!,
          getS3Client()
        );
      }

      solutionsMetadata.map(async (solutionMetadata) => {
        if (solutionMetadata.length > 0) {
          await putS3File(
            solutionMetadata,
            path.join(
              S3_PATH_TO_GITBOOK_DOCS,
              solutionMetadata[0].dirName,
              S3_DIRNAME_METADATA_JSON_PATH
            ),
            S3_BUCKET_NAME!,
            getS3Client()
          );
        }
      });

      console.log(`Saved ${solutionsMetadata.length} solution items to S3`);
    }

    // Process and save release notes metadata
    if (GENERATE_METADATA && metadataFilter.releaseNotes) {
      console.log('Processing release notes metadata...');
      const releaseNotesMetadata = await processReleaseNotesMetadata(
        strapiData.releaseNotes
      );
      if (GENERATE_ROOT_METADATA_FILE) {
        await putS3File(
          releaseNotesMetadata.flat(),
          S3_RELEASE_NOTES_METADATA_JSON_PATH,
          S3_BUCKET_NAME!,
          getS3Client()
        );
      }

      releaseNotesMetadata.map(async (releaseNote) => {
        if (releaseNote.length > 0) {
          await putS3File(
            releaseNote,
            path.join(
              S3_PATH_TO_GITBOOK_DOCS,
              releaseNote[0].dirName,
              S3_DIRNAME_METADATA_JSON_PATH
            ),
            S3_BUCKET_NAME!,
            getS3Client()
          );
        }
      });

      console.log(
        `Saved ${releaseNotesMetadata.length} release note items to S3`
      );
    }

    console.log('Metadata sync completed successfully!');
  } catch (error) {
    console.error('Error during metadata sync:', error);
    process.exit(1);
  }
}

main();
