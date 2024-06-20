import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';

export const ioSignBannerLinks: readonly BannerLinkProps[] = [
  {
    theme: 'dark',
    icon: 'LiveHelp',
    content: [
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
    icon: 'HeadsetMic',
    content: [
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
