import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';

export const sendBannerLinks: readonly BannerLinkProps[] = [
  {
    theme: 'dark',
    icon: 'HeadsetMic',
    content: [
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
    maxWidth: 448,
    justify: 'center',
  },
];
