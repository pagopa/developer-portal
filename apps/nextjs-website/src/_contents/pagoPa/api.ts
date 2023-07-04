import { ApiData } from '@/lib/types/apiData';
import { pagoPa } from '@/_contents/pagoPa/pagoPa';
import { pagoPaApiPath } from '@/_contents/pagoPa/apiPath';

export const pagoPaApi: ApiData = {
  ...pagoPaApiPath,
  product: pagoPa,
  specURLs: [
    {
      url: 'https://raw.githubusercontent.com/pagopa/pn-delivery/develop/docs/openapi/api-external-b2c.yaml',
    },
    {
      url: 'https://raw.githubusercontent.com/pagopa/pn-delivery-push/develop/docs/openapi/api-external-b2c-webhook.yaml',
    },
  ],
  bannerLinks: [
    {
      theme: 'dark',
      title: 'Hai bisogno di aiuto?',
      decoration: 'HeadsetMic',
      body: "Scrivi un'email in cui descrivi il tuo problema o dubbio all'indirizzo <strong>pn-supporto-enti@pagopaio.it</strong>",
    },
  ],
};
