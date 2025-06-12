import { listS3Files, makeS3Client } from '@/helpers/s3SoapApi.helpers';
import { staticContentsUrl } from '@/config';

export async function makeApiSoapUrlList(apiDirName: string) {
  const files = listS3Files('.wsd.xml', makeS3Client());

  const fileList = await files;
  return fileList.map((file) => `${staticContentsUrl}/${apiDirName}/${file}`);
}
