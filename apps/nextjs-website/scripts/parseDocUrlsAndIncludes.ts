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

async function parseIncludesFromMarkdown(
  fileContent: string,
  hashDir: string
): Promise<string> {
  if (!fileContent.includes('{% include')) return fileContent;
  const regex = /{% include\s+['"]([^'"]+)['"]\s*%}/g;
  const matches = [...fileContent.matchAll(regex)];
  // eslint-disable-next-line functional/no-let
  let updatedFileContent = fileContent;
  for (const match of matches) {
    const replaceValue = await replaceIncludes(match[0], match[1], hashDir);
    updatedFileContent = updatedFileContent.replace(match[0], replaceValue);
  }
  return updatedFileContent;
}

function parseUrlsFromMarkdown(
  fileContent: string,
  guideMetadata: UrlParsingMetadata | undefined
): string {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const matches = [...fileContent.matchAll(regex)];
  // eslint-disable-next-line functional/no-let
  let updatedFileContent = fileContent;
  for (const match of matches) {
    const replace = replaceUrl(guideMetadata, match[2]);
    updatedFileContent = updatedFileContent.replace(match[2] || '', replace);
  }
  return updatedFileContent;
}

async function replaceIncludes(
  fullInclude: string,
  pathToInclude: string,
  hashDir: string
): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  const mappedIncludePath = mapIncludePath(pathToInclude, hashDir);
  const includeContent = (await fs.promises.readFile(
    mappedIncludePath,
    'utf8'
  )) as string;
  if (!includeContent || includeContent.length <= 0) {
    return fullInclude;
  }
  return fullInclude + '\n' + includeContent + '{% endinclude %}';
}

function mapIncludePath(includePath: string, hashDir: string): string {
  // Normalize the path to use POSIX separators
  const normalized = includePath.replace(/\\/g, '/');
  // Match leading ../ segments followed by .gitbook/includes
  const replaced = normalized.replace(
    /^((\.\.\/)*)\.gitbook\/includes/,
    `./${hashDir}/.gitbook/includes`
  );
  return replaced;
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
        guideMetadata
          ? guideMetadata
          : metadata.find((data) => data.dirName === item.name)
      );
    } else if (item.isFile() && fullPath.endsWith('.md')) {
      if (!guideMetadata) return;
      const urlParsedFileContent = parseUrlsFromMarkdown(
        await fs.promises.readFile(fullPath, 'utf8'),
        guideMetadata
      );
      const includesParsedFileContent = await parseIncludesFromMarkdown(
        urlParsedFileContent,
        guideMetadata?.dirName || ''
      );
      try {
        fs.writeFileSync(fullPath, includesParsedFileContent, 'utf8');
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
