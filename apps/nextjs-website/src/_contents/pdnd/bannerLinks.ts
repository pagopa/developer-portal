import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';

export const pdndBannerLinks: readonly BannerLinkProps[] = [
  {
    theme: 'light',
    icon: 'Feedback',
    content: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Per segnalare problemi o dare feedback, lascia un commento nello ',
            type: 'text',
          },
          {
            type: 'link',
            url: 'https://github.com/pagopa/pdnd-interop-frontend/issues',
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
            text: ' di PDND Interoperabilità.',
          },
        ],
      },
    ],
    title: 'Dicci cosa ne pensi',
  },
];
