import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';

export const appIoBannerLinks: readonly BannerLinkProps[] = [
  {
    theme: 'dark',
    icon: 'HeadsetMic',
    content: [
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
    contentMaxWidth: 450,
    justify: 'right',
  },
  {
    theme: 'light',
    icon: 'Feedback',
    content: [
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
          {
            type: 'link',
            url: 'https://www.google.com',
            children: [
              {
                type: 'text',
                text: '',
              },
            ],
          },
          {
            text: '',
            type: 'text',
          },
        ],
      },
    ],
    title: 'Dicci cosa ne pensi',
    contentMaxWidth: 450,
    justify: 'left',
  },
];
