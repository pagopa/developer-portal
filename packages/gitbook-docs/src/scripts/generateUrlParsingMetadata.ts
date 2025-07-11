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
  generateUrlPath,
} from '../helpers/guidesMetadataHelper';
// Load environment variables from .env file
dotenv.config();

const URL_PARSING_METADATA_JSON_PATH =
  process.env.URL_PARSING_METADATA_JSON_PATH || 'url-parsing-metadata.json';

export type UrlParsingItem = {
  dirName: string;
  guides: {
    guidePath: string;
    guideUrl: string;
  }[];
};
async function getMarkdownFilesRecursively(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return getMarkdownFilesRecursively(fullPath); // Ricorsione
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
    if (guideInfo.dirName) {
      const guideDir = path.join('devportal-docs', 'docs', guideInfo.dirName);

      const guideFiles = await getMarkdownFilesRecursively(guideDir);
      const menuPath = guideFiles.find((file) =>
        file.includes(guideInfo.dirName + '/SUMMARY.md')
      );
      const item = {
        dirName: guideInfo.dirName,
        guides: [] as { guidePath: string; guideUrl: string }[],
      };
      for (const filePath of guideFiles) {
        const parts = filePath.split('/');
        if (parts.length <= 2) {
          continue;
        }
        const content = fs.readFileSync(filePath, 'utf8');

        if (menuPath && content) {
          const path = generateUrlPath(
            filePath,
            guideInfo.guideSlug,
            guideInfo.productSlug,
            guideInfo.versionName
          );
          item.guides.push({
            guidePath: filePath || '',
            guideUrl: path,
          });
        }
      }
      items.push(item);
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
