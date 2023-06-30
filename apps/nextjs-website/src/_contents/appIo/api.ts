import { ApiData } from '@/lib/types/apiData';
import { appIO } from '@/_contents/appIo/appIO';
import { appIoApiPath } from '@/_contents/appIo/apiPath';

export const appIoApi: ApiData = {
  ...appIoApiPath,
  product: appIO,
  specURL:
    'https://raw.githubusercontent.com/pagopa/io-functions-services/50a116f/openapi/index.yaml',
};
