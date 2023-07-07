import { ApiData } from '@/lib/types/apiData';
import { appIo } from '@/_contents/appIo/appIo';
import { appIoApiPath } from '@/_contents/appIo/apiPath';

export const appIoApi: ApiData = {
  ...appIoApiPath,
  product: appIo,
  specURLs: [
    {
      url: 'https://raw.githubusercontent.com/pagopa/io-functions-services/master/openapi/index.yaml',
    },
  ],
  bannerLinks: [
    {
      theme: 'dark',
      title: 'Per richiedere supporto',
      decoration: 'HeadsetMic',
      body: "Scrivi un'email in cui descrivi il tuo problema o dubbio all'indirizzo <strong>onboarding@io.italia.it</strong>",
    },
    {
      theme: 'light',
      title: 'Per segnalazioni o feedback',
      decoration: 'Feedback',
      body: "Pubblica un commento nello <strong>spazio Github</strong> dell'app IO",
    },
  ],
};
