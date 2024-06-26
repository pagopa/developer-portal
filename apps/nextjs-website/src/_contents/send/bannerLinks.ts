import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';

export const sendBannerLinks: readonly BannerLinkProps[] = [
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
            text: 'Invia una richiesta di supporto utilizzando ',
            type: 'text',
          },
          {
            type: 'link',
            url: 'https://pagopa.atlassian.net/servicedesk/customer/portal/5',
            children: [
              {
                type: 'text',
                text: 'SEND - Supporto Enti',
                bold: true,
              },
            ],
          },
        ],
      },
    ],
    title: 'Hai bisogno di aiuto?',
  },
];
