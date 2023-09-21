import { BannerLinkProps } from '@/editorialComponents/BannerLink';

export const pagoPaBannerLinks: readonly BannerLinkProps[] = [
  {
    theme: 'dark',
    title: 'Serve aiuto?',
    decoration: 'HeadsetMic',
    body: 'Apri un ticket utilizzando l’apposita funzione all’interno della tua area riservata di <a href="https://selfcare.pagopa.it/auth/login?onSuccess=%2F">Self Care</a>',
  },
  {
    theme: 'light',
    title: 'Dicci cosa ne pensi',
    decoration: 'Feedback',
    body: 'Per chiarimenti sulle specifiche d’implementazione, come SACI e SANP, puoi aprire una segnalazione su <a href="https://github.com/pagopa/pagopa-api/issues">GitHub</a>',
  },
];
