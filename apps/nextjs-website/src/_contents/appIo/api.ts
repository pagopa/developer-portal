import { ApiData } from '@/lib/types/apiData';
import { appIo } from '@/_contents/appIo/appIo';
import { appIoApiPath } from '@/_contents/appIo/apiPath';
import { appIoBannerLinks } from '@/_contents/appIo/bannerLinks';

export const appIoApi: ApiData = {
  ...appIoApiPath,
  product: appIo,
  specURLs: [
    {
      url: 'https://raw.githubusercontent.com/pagopa/io-functions-services/master/openapi/index.yaml',
    },
  ],
  bannerLinks: appIoBannerLinks,
};
