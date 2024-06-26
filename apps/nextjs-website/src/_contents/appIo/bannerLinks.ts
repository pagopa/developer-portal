import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';

export const appIoBannerLinks: readonly BannerLinkProps[] = [
  {
    theme: 'dark',
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
            text: 'Scrivi un’email in cui descrivi il tuo problema o dubbio all’indirizzo ',
          },
          {
            type: 'link',
            url: 'mailto:onboarding@io.italia.it',
            children: [
              {
                type: 'text',
                text: 'onboarding@io.italia.it',
              },
            ],
          },
        ],
      },
    ],
    title: 'Hai bisogno di aiuto?',
  },
  {
    theme: 'light',
    icon: {
      name: 'feedback.svg',
      alternativeText: undefined,
      caption: undefined,
      width: 60,
      height: 61,
      ext: '.svg',
      mime: 'image/svg+xml',
      url: '/icons/feedback.svg',
    },
    body: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'Per segnalare problemi o dare feedback, lascia un commento nello ',
          },
          {
            type: 'link',
            url: 'https://github.com/pagopa/io-app/issues/new/choose',
            children: [
              {
                type: 'text',
                text: 'spazio Github',
                bold: true,
              },
            ],
          },
          {
            type: 'text',
            text: " dell'app IO",
          },
        ],
      },
    ],
    title: 'Dicci cosa ne pensi',
  },
];
