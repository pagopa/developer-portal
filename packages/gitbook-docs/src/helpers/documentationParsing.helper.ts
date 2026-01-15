/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-try-statements */
import path from 'path';
import * as fs from 'fs';

export const DOCUMENTATION_PATH =
  process.env.DOCUMENTATION_PATH || '../../devportal-docs/docs';
export type UrlParsingMetadata = {
  dirName: string;
  docs: {
    path: string;
    url: string;
  }[];
};

export function parseUrlsFromMarkdown(
  fileContent: string,
  currentDocMetadata: UrlParsingMetadata | undefined,
  allDocsMetadata: UrlParsingMetadata[] = [],
  filePath?: string
): string {
  // Regex to match markdown links: [link text](url)
  // Captures: [1] = link text, [2] = URL
  const regex = /\[([^\]]+)]\(([^)]+)\)/g;
  const tableRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g;
  const matches = [...fileContent.matchAll(regex)];
  const tableMatches = [...fileContent.matchAll(tableRegex)];
  const allMatches = matches.concat(tableMatches);
  // eslint-disable-next-line functional/no-let
  let updatedFileContent = fileContent;
  for (const match of allMatches) {
    const replace = replaceUrl(
      currentDocMetadata,
      allDocsMetadata,
      match[2],
      filePath
    );
    updatedFileContent = updatedFileContent.replaceAll(
      '(' + (match[2] || '') + ')',
      '(' + replace + ')'
    );
    updatedFileContent = updatedFileContent.replaceAll(
      '"' + (match[2] || '') + '"',
      '"' + replace + '"'
    );
  }
  if (allMatches.length > 0) {
    console.log('Replaced URLs in file: ', filePath || '');
  }
  return updatedFileContent;
}

// Transforms a relative URL into an absolute URL by matching it against guide metadata.
// Handles various markdown file extensions and path formats to find the correct guide URL.
export function replaceUrl(
  currentDocMetadata: UrlParsingMetadata | undefined,
  allDocsMetadata: UrlParsingMetadata[] = [],
  value: string,
  filePath?: string
): string {
  if (!currentDocMetadata) return value;
  if (/^https?:/.test(value)) {
    return value;
  }
  // Clean up the URL by removing mentions, README.md, and .md extensions
  const splitValue = value
    .replace(' "mention"', '')
    .replace('.md', '')
    .split('/')
    .filter((val) => {
      return val != '';
    });
  const splitPath = filePath
    ? filePath
        .replace(' "mention"', '')
        .replace('.md', '')
        .split('/')
        .filter((val) => {
          return val != '';
        })
    : [];

  const lastPart = splitValue.at(-1) || '';
  const splitValues = [splitValue.at(-3), splitValue.at(-2)].filter(
    (value) => value !== undefined
  ) as string[];
  const splitPaths = [splitPath.at(-3), splitPath.at(-2)].filter(
    (value) => value !== undefined
  ) as string[];
  const urlPartsBeforeName =
    splitValues.length > 0
      ? splitValues.join('/')
      : splitPaths.length > 0
      ? splitPaths.join('/')
      : '';
  const name = lastPart.replace('.md', '').split('#')[0];

  // Skip processing for very short names (likely not valid guide names)
  if (name.length <= 1) {
    return value;
  }
  const perfectMatch =
    splitValue.length > 1
      ? currentDocMetadata.docs.filter((doc) => doc.path.includes(value))
      : [];
  const nameMatch = currentDocMetadata.docs.filter((doc) =>
    doc.path.includes(name)
  );
  // Find guides that contain the extracted name in their path
  const docs = [perfectMatch.length > 0 ? perfectMatch : nameMatch].flat();
  if (docs.length <= 0) {
    const dirName = value.split('/s/').slice(1)[0]?.split('/')[0];
    const externalDocs = allDocsMetadata.filter(
      (g) => g.dirName.includes(name) || g.dirName === dirName
    );
    if (externalDocs.length > 0) {
      docs.push(...externalDocs[0].docs);
    } else return value;
  }
  const subParts = value.includes('#') ? value.split('#').at(-1) : '';
  const urlEnding = subParts && subParts.length > 0 ? '#' + subParts : '';
  if (docs.length == 1) {
    return docs[0].url + urlEnding || value;
  } else {
    // If multiple matches, try to find more specific match using parent directory
    const doc = docs
      .sort((doc1, doc2) => {
        return doc1.path.length - doc2.path.length;
      })
      .find((guide) =>
        guide.path.includes([urlPartsBeforeName, name].join('/'))
      );
    return doc ? doc?.url + urlEnding : docs[0].url + urlEnding;
  }
}

// Processes markdown content to expand include directives.
export async function parseIncludesFromMarkdown(
  fileContent: string,
  filePath: string
): Promise<string> {
  if (!fileContent.includes('{% include')) {
    return fileContent;
  }
  // Regex to match Jekyll include syntax: {% include "filename" %}
  // Captures: [1] = filename/path to include
  const regex = /{% include\s+['"]([^'"]+)['"]\s*%}/gs;
  const matches = [...fileContent.matchAll(regex)];
  // eslint-disable-next-line functional/no-let
  let updatedFileContent = fileContent;
  for (const match of matches) {
    const includeContent = await getIncludeContent(match[1], filePath);
    const replaceValue = await replaceIncludes(match[0], includeContent);
    updatedFileContent = updatedFileContent.replace(match[0], replaceValue);
  }
  if (matches.length > 0) {
    console.log('Replaced reusable contents in file: ', filePath);
  }
  return updatedFileContent;
}

export async function getIncludeContent(
  includePath: string,
  filePath: string
): Promise<string> {
  const mappedIncludePath = mapIncludePath(includePath, filePath);
  if (!fs.existsSync(mappedIncludePath)) {
    console.log('no file found for', mappedIncludePath);
    return '';
  }
  return (await fs.promises.readFile(mappedIncludePath, 'utf8')) as string;
}

// Replaces the include directive with the actual file content.
// Returns the original directive if no content is available.
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

// Maps relative include paths to absolute filesystem paths.
// Handles GitBook-style include paths by replacing relative navigation with absolute paths.
function mapIncludePath(includePath: string, filePath: string): string {
  // Normalize the path to use POSIX separators
  const normalized = includePath.replace(/\\/g, '/');
  // Join the directory of the current file with the normalized include path
  return path.join(path.dirname(filePath), normalized);
}
