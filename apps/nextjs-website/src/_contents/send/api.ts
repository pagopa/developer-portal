import { ApiData } from '@/lib/types/apiData';
import { send } from '@/_contents/send/send';
import { sendApiPath } from '@/_contents/send/apiPath';
import { sendBannerLinks } from '@/_contents/send/bannerLinks';

export const sendApi: ApiData = {
  ...sendApiPath,
  product: send,
  specURLs: [
    {
      url: 'https://raw.githubusercontent.com/pagopa/pn-delivery/release/2.1.0/docs/openapi/api-external-b2b-pa-bundle.yaml',
    },
  ],
  bannerLinks: sendBannerLinks,
};
