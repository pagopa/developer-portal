// Extract the path parts after the S3 directory name
// Example: docs/0OMsoqOg9GiJ2xusVHMv/suolo-spazi-e-beni-pubblici/segnalazioni-suggerimenti-e-reclami.md -> suolo-spazi-e-beni-pubblici/segnalazioni-suggerimenti-e-reclami
export function sitePathFromLocalPath(
  path: string,
  landingFile?: string
): string | undefined {
  const parts = path.split('/');
  const pathParts = parts.slice(3, parts.length - 1); // Skip "docs/dirName" and remove filename
  const lastPart = parts[parts.length - 1];

  if (landingFile && pathParts.join('/') === landingFile) {
    return;
  }

  if (lastPart === 'README.md') {
    return pathParts.join('/');
  } else {
    return [...pathParts, lastPart.replace('.md', '')].join('/');
  }
}
