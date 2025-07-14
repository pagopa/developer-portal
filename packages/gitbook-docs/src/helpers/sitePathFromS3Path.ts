// Extract the path parts after the S3 directory name
// Example: docs/0OMsoqOg9GiJ2xusVHMv/suolo-spazi-e-beni-pubblici/segnalazioni-suggerimenti-e-reclami.md -> suolo-spazi-e-beni-pubblici/segnalazioni-suggerimenti-e-reclami
export function sitePathFromS3Path(
  s3Path: string,
  landingFile?: string
): string | undefined {
  const parts = s3Path.split('/');
  const pathParts = parts.slice(3, parts.length - 1); // Skip "devportal-docs/docs/dirName" and remove filename
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
