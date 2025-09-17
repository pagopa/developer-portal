import { getSoapApiMetadata } from '@/helpers/s3Metadata.helpers';
import { staticContentsUrl } from '@/config';

export async function makeApiSoapUrlList(apiDirName: string) {
  const soapApiMetadata = await getSoapApiMetadata().then((metadata) =>
    metadata.find((item) => item.dirName === apiDirName),
  );
  if (!soapApiMetadata) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error(`No metadata found for API directory: ${apiDirName}`);
  }

  return soapApiMetadata.contentS3Paths.map(
    (url) => `${staticContentsUrl}/soap-api/${url}`,
  ) as readonly string[];
}
