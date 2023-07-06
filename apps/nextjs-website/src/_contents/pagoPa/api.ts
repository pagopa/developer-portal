import { ApiData } from '@/lib/types/apiData';
import { pagoPa } from '@/_contents/pagoPa/pagoPa';
import { pagoPaApiPath } from '@/_contents/pagoPa/apiPath';

export const pagoPaApi: ApiData = {
  ...pagoPaApiPath,
  product: pagoPa,
  soapDocumentation: {
    url: 'https://github.com/pagopa/pagopa-api',
    title: 'Consulta la documentazione API SOAP',
    buttonLabel: 'Vai a GitHub',
    icon: 'ExitToApp',
  },
  specURLs: [
    {
      url: 'https://raw.githubusercontent.com/pagopa/pagopa-api/f25f9becb7a784a6fb136a1ac7a0feca1fcbd3d7/api-definitions/db_positions/api.yaml',
    },
  ],
  bannerLinks: [
    {
      theme: 'dark',
      title: 'Serve aiuto?',
      decoration: 'HeadsetMic',
      body: 'Apri un ticket utilizzando l’apposita funzione all’interno della tua <strong>area riservata di Self Care</strong>',
    },
    {
      theme: 'light',
      title: 'Dicci cosa ne pensi',
      decoration: 'Feedback',
      body: 'Per chiarimenti sulle specifiche d’implementazione, come SACI e SANP, puoi aprire una segnalazione su <strong>GitHub</strong>',
    },
  ],
};
