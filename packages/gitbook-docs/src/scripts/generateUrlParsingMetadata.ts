/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-try-statements */
import dotenv from 'dotenv';
import { writeFile } from 'fs/promises';
import * as fs from 'fs';
import { readdir } from 'fs/promises';
import path from 'path';
import { fetchFromStrapi } from '../helpers/fetchFromStrapi';
import {
  StrapiGuide,
  GuideInfo,
  StrapiSolution,
  StrapiReleaseNote,
} from '../helpers/guidesMetadataHelper';
import { sitePathFromLocalPath } from '../helpers/sitePathFromLocalPath';
import { DOCUMENTATION_PATH } from '../helpers/documentationParsing.helper';
// Load environment variables from .env file
dotenv.config();

const URL_PARSING_METADATA_JSON_PATH =
  process.env.URL_PARSING_METADATA_JSON_PATH ||
  '../../url-parsing-metadata.json';

export type UrlParsingItem = {
  dirName: string;
  guides: {
    guidePath: string;
    guideUrl: string;
  }[];
};

export function generateUrlPath(
  filePath: string,
  guideSlug: string,
  productSlug: string,
  versionName?: string
): string {
  const restOfPath = sitePathFromLocalPath(filePath, undefined);
  return [`/${productSlug}`, 'guides', guideSlug, versionName, restOfPath]
    .filter(Boolean)
    .join('/');
}

async function getMarkdownFilesRecursively(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
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
async function convertGuideToUrlParsingItems(
  strapiGuides: StrapiGuide[],
  strapiSolutions: StrapiSolution[],
  strapiReleaseNotes: StrapiReleaseNote[]
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
  const solutionInfoList: GuideInfo[] = strapiSolutions
    .filter((solution) => !!solution.attributes.dirName)
    .map((solution) => ({
      versionName: '',
      isMainVersion: true,
      dirName: solution.attributes.dirName,
      guideSlug: solution.attributes.slug,
      productSlug: 'solutions',
    }));
  const releaseNoteInfoList: GuideInfo[] = strapiReleaseNotes
    .filter((releaseNote) => !!releaseNote.attributes.dirName)
    .map((releaseNote) => ({
      versionName: '',
      isMainVersion: true,
      dirName: releaseNote.attributes.dirName,
      guideSlug: releaseNote.attributes.slug,
      productSlug:
        releaseNote.attributes.product?.data?.attributes?.slug ||
        'release-notes',
    }));

  const infoList = [
    guideInfoList,
    solutionInfoList,
    releaseNoteInfoList,
  ].flat();

  const items: UrlParsingItem[] = [];
  for (const docInfo of infoList) {
    if (docInfo.dirName) {
      const guideDir = path.join(DOCUMENTATION_PATH, docInfo.dirName);
      if (!fs.existsSync(guideDir)) {
        console.warn(`Directory does not exist: ${guideDir}`);
        continue;
      }
      const guideFiles = await getMarkdownFilesRecursively(guideDir);
      const item = {
        dirName: docInfo.dirName,
        guides: [] as { guidePath: string; guideUrl: string }[],
      };
      for (const filePath of guideFiles) {
        const parts = filePath.split('/');
        if (parts.length <= 2) {
          continue;
        }
        if (!fs.existsSync(filePath)) continue;

        const path = generateUrlPath(
          filePath,
          docInfo.guideSlug,
          docInfo.productSlug,
          docInfo.versionName
        );
        item.guides.push({
          guidePath: filePath || '',
          guideUrl: path,
        });
      }
      items.push(item);
    }
  }
  return items;
}

async function main() {
  console.log('Starting to process Markdown files...');
  // eslint-disable-next-line functional/no-let
  let strapiGuides;
  try {
    const { data } = await fetchFromStrapi<StrapiGuide>(
      'api/guides?populate[0]=product&populate[1]=versions&pagination[pageSize]=1000&pagination[page]=1'
    );
    strapiGuides = data;
    console.log(`Fetched ${strapiGuides.length} guides from Strapi`);
  } catch (error) {
    console.error('Error fetching solutions from Strapi:', error);
    process.exit(1);
  }
  // eslint-disable-next-line functional/no-let
  let strapiSolutions;
  try {
    const { data } = await fetchFromStrapi<StrapiSolution>(
      'api/solutions?pagination[pageSize]=1000&pagination[page]=1'
    );
    strapiSolutions = data;
    console.log(`Fetched ${strapiSolutions.length} solutions from Strapi`);
  } catch (error) {
    console.error('Error fetching solutions from Strapi:', error);
    process.exit(1);
  }
  // eslint-disable-next-line functional/no-let
  let strapiReleaseNotes;
  try {
    const { data } = await fetchFromStrapi<StrapiReleaseNote>(
      'api/release-notes?populate[0]=product&pagination[pageSize]=1000&pagination[page]=1'
    );
    strapiReleaseNotes = data;
    console.log(
      `Fetched ${strapiReleaseNotes.length} release notes from Strapi`
    );
  } catch (error) {
    console.error('Error fetching release notes from Strapi:', error);
    process.exit(1);
  }
  try {
    const urlParsingItems = await convertGuideToUrlParsingItems(
      strapiGuides,
      strapiSolutions,
      strapiReleaseNotes
    );
    console.log(
      `Converted guides to ${urlParsingItems.length} url parsing items`
    );
    await writeFile(
      URL_PARSING_METADATA_JSON_PATH,
      JSON.stringify(urlParsingItems, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error('Error:', error);
    process.exit(1); // Exit with error code for CI pipeline visibility
  }
}

// Execute the function
main();
