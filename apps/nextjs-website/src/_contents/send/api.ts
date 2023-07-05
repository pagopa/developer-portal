import { ApiData } from '@/lib/types/apiData';
import { send } from '@/_contents/send/send';
import { sendApiPath } from '@/_contents/send/apiPath';

export const sendApi: ApiData = {
  ...sendApiPath,
  product: send,
  specURLs: [
    {
      url: 'https://raw.githubusercontent.com/send/pn-delivery/develop/docs/openapi/api-external-b2c.yaml',
    },
    {
      url: 'https://raw.githubusercontent.com/send/pn-delivery-push/develop/docs/openapi/api-external-b2c-webhook.yaml',
    },
  ],
  bannerLinks: [
    {
      theme: 'dark',
      title: 'Hai bisogno di aiuto?',
      decoration: 'HeadsetMic',
      body: "Scrivi un'email in cui descrivi il tuo problema o dubbio all'indirizzo <strong>pn-supporto-enti@sendio.it</strong>",
    },
  ],
};
