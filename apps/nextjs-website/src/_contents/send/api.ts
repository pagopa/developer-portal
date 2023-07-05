import { ApiData } from '@/lib/types/apiData';
import { send } from '@/_contents/send/send';
import { sendApiPath } from '@/_contents/send/apiPath';

export const sendApi: ApiData = {
  ...sendApiPath,
  product: send,
  specURLs: [
    {
      name: 'API B2B per le Pubbliche Amministrazioni',
      url: 'https://raw.githubusercontent.com/pagopa/pn-delivery/develop/docs/openapi/api-external-b2b-pa.yaml',
    },
    {
      name: 'API B2B avanzamento notifiche,
      url: 'https://raw.githubusercontent.com/pagopa/pn-delivery-push/develop/docs/openapi/api-external-b2b-webhook.yaml',
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
