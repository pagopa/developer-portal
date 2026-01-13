/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-try-statements */

import {
  DOCUMENTATION_PATH,
  parseIncludesFromMarkdown,
  parseUrlsFromMarkdown,
  UrlParsingMetadata,
} from '../helpers/documentationParsing.helper';
import path from 'path';
import fs from 'fs';

const URL_PARSING_METADATA_JSON_PATH =
  process.env.URL_PARSING_METADATA_JSON_PATH ||
  '../../url-parsing-metadata.json';

const metadata = loadMetadata(URL_PARSING_METADATA_JSON_PATH);

function loadMetadata(filePath: string): UrlParsingMetadata[] {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { readFileSync } = fs;
  const file = readFileSync(filePath, 'utf8');
  return JSON.parse(file);
}

async function recursiveParseMarkdownFiles(
  dirPath: string,
  guideMetadata?: UrlParsingMetadata
) {
  const items = await fs.promises.readdir(dirPath, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    if (item.isDirectory()) {
      await recursiveParseMarkdownFiles(
        fullPath,
        guideMetadata
          ? guideMetadata
          : metadata.find((data) => data.dirName === item.name)
      );
    } else if (item.isFile() && fullPath.endsWith('.md')) {
      if (!guideMetadata) return;
      const includesParsedFileContent = await parseIncludesFromMarkdown(
        await fs.promises.readFile(fullPath, 'utf8'),
        fullPath
      );
      const urlParsedFileContent = parseUrlsFromMarkdown(
        includesParsedFileContent,
        guideMetadata,
        metadata,
        fullPath
      );
      try {
        fs.writeFileSync(fullPath, urlParsedFileContent, 'utf8');
      } catch (error) {
        console.error(`Error writing to file ${fullPath}:`, error);
      }
    }
  }
}

async function main() {
  try {
    console.log('Starting to parse documentation files...');
    await recursiveParseMarkdownFiles(DOCUMENTATION_PATH);
    console.log('Documentation files parsed successfully.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1); // Exit with error code for CI pipeline visibility
  }
}

main();
