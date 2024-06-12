import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';

export const pagoPaBannerLinks: readonly BannerLinkProps[] = [
  {
    theme: 'dark',
    icon: 'HeadsetMic',
    content: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Apri un ticket utilizzando l’apposita funzione all’interno della tua ',
            type: 'text',
          },
          {
            type: 'link',
            url: 'https://selfcare.pagopa.it/auth/login?onSuccess=%2F',
            children: [
              {
                type: 'text',
                text: 'Area Riservata',
                bold: true,
              },
            ],
          },
        ],
      },
    ],
    title: 'Serve aiuto?',
  },
  {
    theme: 'light',
    icon: 'Feedback',
    content: [
      {
        type: 'paragraph',
        children: [
          {
            text: '',
            type: 'text',
          },
          {
            type: 'link',
            url: 'https://selfcare.pagopa.it/auth/login?onSuccess=%2F',
            children: [
              {
                type: 'text',
                text: '',
                bold: true,
              },
            ],
          },
          {
            text: 'Per chiarimenti sulle specifiche d’implementazione, come SACI e SANP, puoi aprire una segnalazione su ',
            type: 'text',
          },
          {
            type: 'link',
            url: 'https://github.com/pagopa/pagopa-api/issues',
            children: [
              {
                type: 'text',
                text: 'GitHub',
                bold: true,
              },
            ],
          },
        ],
      },
    ],
    title: 'Dicci cosa ne pensi',
  },
];
