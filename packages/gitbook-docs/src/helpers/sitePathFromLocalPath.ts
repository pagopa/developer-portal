import path from 'path';
import { DOCUMENTATION_PATH } from './documentationParsing.helper';

const DOCUMENTATION_ABSOLUTE_PATH = path.resolve(DOCUMENTATION_PATH);

// Extract the path parts after the S3 directory name
// Example: docs/0OMsoqOg9GiJ2xusVHMv/suolo-spazi-e-beni-pubblici/segnalazioni-suggerimenti-e-reclami.md -> suolo-spazi-e-beni-pubblici/segnalazioni-suggerimenti-e-reclami
export function sitePathFromLocalPath(
  filePath: string,
  dirName: string,
  landingFile?: string
): string | undefined {
  const absoluteFilePath = path.resolve(filePath);
  const relativePath = path.relative(
    DOCUMENTATION_ABSOLUTE_PATH,
    absoluteFilePath
  );
  const normalizedRelativePath = relativePath
    .split(path.sep)
    .join('/')
    .replace(/^(\.\.\/)+/, '');
  const segments = normalizedRelativePath
    .split('/')
    .filter((segment: string) => segment.length > 0);
  const dirNameSegments = dirName.split('/').filter((part) => part.length > 0);
  const dirNameIndex = dirName
    .split('/')
    .findIndex((_, index) =>
      dirNameSegments.every(
        (dirNamePart, dirNamePartIndex) =>
          segments[index + dirNamePartIndex] === dirNamePart
      )
    );

  if (segments.length < 2) {
    return;
  }

  const docSegments = segments.slice(
    dirNameIndex + dirNameSegments.length,
    segments.length
  );
  if (docSegments.length === 0) {
    return;
  }

  const pathParts = docSegments.slice(0, -1); // remove filename
  const lastPart = docSegments[docSegments.length - 1];

  if (landingFile && pathParts.join('/') === landingFile) {
    return;
  }

  if (lastPart === 'README.md') {
    return pathParts.join('/');
  } else {
    return [...pathParts, lastPart.replace('.md', '')].join('/');
  }
}
