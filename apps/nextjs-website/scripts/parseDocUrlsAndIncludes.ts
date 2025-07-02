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
  const name = value.split('/').at(-1) || '';
  if (metadata) {
    const guides = metadata.guides.find((guide) =>
      guide.guidePath.includes(name)
    );
    return guides?.guideUrl || value;
  } else return value;
}

async function findMarkdownFiles(
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
      await findMarkdownFiles(
        fullPath,
        metadata.find((data) => data.dirName === item.name)
      );
    } else if (item.isFile() && fullPath.endsWith('.md')) {
      // eslint-disable-next-line functional/no-let
      const fileContent = await fs.promises.readFile(fullPath, 'utf8');
      const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const matches = [...fileContent.matchAll(regex)];
      // eslint-disable-next-line functional/no-let
      let hasUpdated = false;
      for (const match of matches) {
        if (match[0] === metadata[0]) continue;
        hasUpdated = true;
        const replace = replaceUrl(metadata[0], match[2]);
        console.log('REPLACE ', replace);
        fileContent.replace(match[2] || '', replace);
      }
      if (hasUpdated) {
        console.log('Updating file:', fullPath);
        fs.writeFileSync(fullPath, fileContent, 'utf8');
      }
    }
  }
}

async function main() {
  try {
    await findMarkdownFiles(
      '/home/marbert/Projects/developer-portal/apps/nextjs-website/docs'
    );
  } catch (error) {
    console.error('Error:', error);
    process.exit(1); // Exit with error code for CI pipeline visibility
  }
}

main();
