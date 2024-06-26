import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';

export const ioSignBannerLinks: readonly BannerLinkProps[] = [
  {
    theme: 'dark',
    icon: {
      name: 'livehelp.svg',
      alternativeText: undefined,
      caption: undefined,
      width: 60,
      height: 61,
      ext: '.svg',
      mime: 'image/svg+xml',
      url: '/icons/livehelp.svg',
    },
    body: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'Scrivi un’e-mail in cui descrivi il tuo problema o dubbio all’indirizzo ',
          },
          {
            type: 'link',
            url: 'mailto:firmaconio-tech@pagopa.it',
            children: [
              {
                type: 'text',
                text: 'firmaconio-tech@pagopa.it',
                bold: true,
              },
            ],
          },
        ],
      },
    ],
    title: 'Serve aiuto durante l’integrazione?',
  },
  {
    theme: 'light',
    icon: {
      name: 'headset.svg',
      alternativeText: undefined,
      caption: undefined,
      width: 60,
      height: 61,
      ext: '.svg',
      mime: 'image/svg+xml',
      url: '/icons/headset.svg',
    },
    body: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'Per problemi o dubbi dopo l’integrazione, scrivici all’indirizzo ',
          },
          {
            type: 'link',
            url: 'mailto:enti-firmaconio@assistenza.pagopa.it',
            children: [
              {
                type: 'text',
                text: 'enti-firmaconio@assistenza.pagopa.it',
                bold: true,
              },
            ],
          },
        ],
      },
    ],
    title: 'Assistenza continua',
  },
];
