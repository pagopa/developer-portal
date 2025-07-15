/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-try-statements */
export const DOCUMENTATION_PATH =
  process.env.DOCUMENTATION_PATH || 'devportal-docs/docs';
export type UrlParsingMetadata = {
  dirName: string;
  guides: {
    guidePath: string;
    guideUrl: string;
  }[];
};

export function parseUrlsFromMarkdown(
  fileContent: string,
  guideMetadata: UrlParsingMetadata | undefined
): string {
  const regex = /\[([^\]]+)]\(([^)]+)\)/g;
  const matches = [...fileContent.matchAll(regex)];
  // eslint-disable-next-line functional/no-let
  let updatedFileContent = fileContent;
  for (const match of matches) {
    const replace = replaceUrl(guideMetadata, match[2]);
    updatedFileContent = updatedFileContent.replace(match[2] || '', replace);
  }
  return updatedFileContent;
}

export function replaceUrl(
  metadata: UrlParsingMetadata | undefined,
  value: string
): string {
  const splitValue = value
    .replace(' "mention"', '')
    .replace('README.md', '')
    .replace('.md', '')
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

export async function parseIncludesFromMarkdown(
  fileContent: string,
  hashDir: string
): Promise<string> {
  if (!fileContent.includes('{% include')) {
    return fileContent;
  }
  const regex = /{% include\s+['"]([^'"]+)['"]\s*%}/gs;
  const matches = [...fileContent.matchAll(regex)];
  // eslint-disable-next-line functional/no-let
  let updatedFileContent = fileContent;
  for (const match of matches) {
    const includeContent = await getIncludeContent(match[1], hashDir);
    const replaceValue = await replaceIncludes(match[0], includeContent);
    updatedFileContent = updatedFileContent.replace(match[0], replaceValue);
  }
  return updatedFileContent;
}

export async function getIncludeContent(
  includePath: string,
  hashDir: string
): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  const mappedIncludePath = mapIncludePath(includePath, hashDir);
  if (!fs.existsSync(mappedIncludePath)) {
    console.log('no file found for', mappedIncludePath);
    return '';
  }
  return (await fs.promises.readFile(mappedIncludePath, 'utf8')) as string;
}

export async function replaceIncludes(
  fullInclude: string,
  includeContent: string
): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  if (!includeContent || includeContent.length <= 0) {
    return fullInclude;
  }
  return includeContent;
}

function mapIncludePath(includePath: string, hashDir: string): string {
  // Normalize the path to use POSIX separators
  const normalized = includePath.replace(/\\/g, '/');
  // Match leading ../ segments followed by .gitbook/includes
  return normalized.replace(
    /^((\.\.\/)*)\.gitbook\/includes/,
    DOCUMENTATION_PATH + `/${hashDir}/.gitbook/includes`
  );
}
