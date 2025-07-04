/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-try-statements */

type UrlParsingMetadata = {
  dirName: string;
  guides: {
    guidePath: string;
    guideUrl: string;
  }[];
};

const URL_PARSING_METADATA_JSON_PATH =
  process.env.URL_PARSING_METADATA_JSON_PATH || 'url-parsing-metadata.json';

const DOCUMENTATION_PATH =
  process.env.DOCUMENTATION_PATH || 'devportal-docs/docs';

const metadata = loadMetadata(URL_PARSING_METADATA_JSON_PATH);

function loadMetadata(filePath: string): UrlParsingMetadata[] {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { readFileSync } = require('fs');
  const file = readFileSync(filePath, 'utf8');
  return JSON.parse(file);
}

function replaceUrl(
  metadata: UrlParsingMetadata | undefined,
  value: string
): string {
  const splitValue = value
    .replace(' "mention"', '')
    .replace('README.md', '')
    .split('/')
    .filter((val) => {
      return val != '';
    });
  const lastPart = splitValue.at(-1) || '';
  const secondToLastPart = splitValue.at(-2) || '';
  const name = lastPart.replace('.md', '');
  if (name.length <= 1) {
    return value;
  }
  if (metadata) {
    const guides = metadata.guides.filter((guide) =>
      guide.guidePath.includes(name)
    );
    if (guides.length <= 0) {
      return value;
    }
    if (guides.length == 1) {
      return guides[0].guideUrl || value;
    } else {
      const guide = guides.find((guide) =>
        guide.guidePath.includes([secondToLastPart, lastPart].join('/'))
      );

      return guide?.guideUrl || value;
    }
  } else {
    return value;
  }
}

async function recursiveParseMarkdownFiles(
  dirPath: string,
  guideMetadata?: UrlParsingMetadata
) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const path = require('path');
  // eslint-disable-next-line functional/no-let

  const items = await fs.promises.readdir(dirPath, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    if (item.isDirectory()) {
      await recursiveParseMarkdownFiles(
        fullPath,
        metadata.find((data) => data.dirName === item.name)
      );
    } else if (item.isFile() && fullPath.endsWith('.md')) {
      // eslint-disable-next-line functional/no-let
      let fileContent = await fs.promises.readFile(fullPath, 'utf8');
      const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const matches = [...fileContent.matchAll(regex)];
      for (const match of matches) {
        const replace = replaceUrl(guideMetadata, match[2]);
        fileContent = fileContent.replace(match[2] || '', replace);
      }
      try {
        fs.writeFileSync(fullPath, fileContent, 'utf8');
      } catch (error) {
        console.error(`Error writing to file ${fullPath}:`, error);
      }
    }
  }
}

async function main() {
  try {
    await recursiveParseMarkdownFiles(DOCUMENTATION_PATH);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1); // Exit with error code for CI pipeline visibility
  }
}

main();
