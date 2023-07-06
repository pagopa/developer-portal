import { ApiData } from '@/lib/types/apiData';
import { ioSign } from '@/_contents/ioSign/ioSign';
import { ioSignApiPath } from '@/_contents/ioSign/apiPath';

export const ioSignApi: ApiData = {
  ...ioSignApiPath,
  product: ioSign,
  specURLs: [
    {
      url: 'https://raw.githubusercontent.com/pagopa/io-sign/latest/apps/io-func-sign-issuer/openapi.yaml',
    },
  ],
  bannerLinks: [
    {
      theme: 'dark',
      title: "Serve aiuto durante l'integrazione?",
      decoration: 'HeadsetMic',
      body: 'Scrivi un’e-mail in cui descrivi il tuo problema o dubbio all’indirizzo <strong>firmaconio-tech@pagopa.it</strong>',
    },
    {
      theme: 'light',
      title: 'Assistenza continua',
      decoration: 'Feedback',
      body: "Per problemi o dubbi dopo l'integrazione, scrivici all'indirizzo <strong>enti-firmaconio@assistenza.pagopa.it</strong>",
    },
  ],
};
