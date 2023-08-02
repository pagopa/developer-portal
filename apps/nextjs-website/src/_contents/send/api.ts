import { ApiData } from '@/lib/types/apiData';
import { send } from '@/_contents/send/send';
import { sendApiPath } from '@/_contents/send/apiPath';
import { sendBannerLinks } from '@/_contents/send/bannerLinks';

export const sendApi: ApiData = {
  ...sendApiPath,
  product: send,
  specURLs: [
    {
      name: 'API B2B per le Pubbliche Amministrazioni',
      url: 'https://raw.githubusercontent.com/pagopa/pn-delivery/develop/docs/openapi/api-external-b2b-pa.yaml',
    },
    {
      name: 'API B2B avanzamento notifiche',
      url: 'https://raw.githubusercontent.com/pagopa/pn-delivery-push/develop/docs/openapi/api-external-b2b-webhook.yaml',
    },
  ],
  bannerLinks: sendBannerLinks,
};
