/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-try-statements */

type UrlParsingMetadata = {
  dirName: string;
  guides: {
    guideName: string;
    guideUrl: string;
  }[];
};

const S3_PATH_TO_GITBOOK_DOCS = process.env.S3_PATH_TO_GITBOOK_DOCS || 'docs';

function loadMetadata(filePath: string): UrlParsingMetadata[] {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { readFileSync } = require('fs');
  const file = readFileSync(filePath, 'utf8');
  const obj = JSON.parse(file);
  return obj;
}

function replaceUrl(
  dirName: string,
  metadata: UrlParsingMetadata[],
  value: string
): string {
  const versionMetadata = metadata.find((item) => item.dirName === dirName);
  if (!versionMetadata) return value;
  const name = value.split('/').at(-1) || '';
  const guides = versionMetadata.guides.find((guide) =>
    guide.guideName.includes(name)
  );
  return guides?.guideUrl || value;
}

function main() {
  try {
    const tmpPath = '/home/marbert/Projects/developer-portal/file.json';
    const metadata = loadMetadata(tmpPath);
    console.log(
      replaceUrl(
        'b8HnYwaAzhxRFAZdZBXL',
        metadata,
        'percorso/percorso/percorso/come-integrare-i-propri-servizi-su-pdnd-interoperabilita'
      )
    );
  } catch (error) {
    console.error('Error:', error);
    process.exit(1); // Exit with error code for CI pipeline visibility
  }
}

main();
