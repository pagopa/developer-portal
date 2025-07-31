/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-try-statements */
import path from 'path';
import fs from 'fs';

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
  guideMetadata: UrlParsingMetadata | undefined,
  filePath?: string
): string {
  // Regex to match markdown links: [link text](url)
  // Captures: [1] = link text, [2] = URL
  const regex = /\[([^\]]+)]\(([^)]+)\)/g;
  const matches = [...fileContent.matchAll(regex)];
  // eslint-disable-next-line functional/no-let
  let updatedFileContent = fileContent;
  for (const match of matches) {
    const replace = replaceUrl(guideMetadata, match[2]);
    updatedFileContent = updatedFileContent.replace(match[2] || '', replace);
  }
  if (matches.length > 0) {
    console.log('Replaced URLs in file: ', filePath || '');
  }
  return updatedFileContent;
}

// Transforms a relative URL into an absolute URL by matching it against guide metadata.
// Handles various markdown file extensions and path formats to find the correct guide URL.
export function replaceUrl(
  metadata: UrlParsingMetadata | undefined,
  value: string
): string {
  // Clean up the URL by removing mentions, README.md, and .md extensions
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

  // Skip processing for very short names (likely not valid guide names)
  if (name.length <= 1) {
    return value;
  }
  if (metadata) {
    // Find guides that contain the extracted name in their path
    const guides = metadata.guides.filter((guide) =>
      guide.guidePath.includes(name)
    );
    if (guides.length <= 0) {
      return value;
    }
    if (guides.length == 1) {
      return guides[0].guideUrl || value;
    } else {
      // If multiple matches, try to find more specific match using parent directory
      const guide = guides.find((guide) =>
        guide.guidePath.includes([secondToLastPart, lastPart].join('/'))
      );
      return guide?.guideUrl || value;
    }
  } else {
    return value;
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
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
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
