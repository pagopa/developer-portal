import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { mockTextBlock } from '@/../../apps/storybook-app/stories/mock-content.helper';

export const sendBannerLinks: readonly BannerLinkProps[] = [
  {
    theme: 'dark',
    icon: 'HeadsetMic',
    content: [
      {
        ...mockTextBlock({
          type: 'paragraph',
          text: 'Invia una richiesta di supporto utilizzando<a href="https://pagopa.atlassian.net/servicedesk/customer/portal/5"> SEND - Supporto Enti</a>',
        }),
      },
    ],
    title: 'Hai bisogno di aiuto?',
  },
];
