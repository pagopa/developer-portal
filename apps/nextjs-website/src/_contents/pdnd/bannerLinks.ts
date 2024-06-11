import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { mockTextBlock } from '@/../../apps/storybook-app/stories/mock-content.helper';

export const pdndBannerLinks: readonly BannerLinkProps[] = [
  {
    theme: 'light',
    icon: 'Feedback',
    content: [
      {
        ...mockTextBlock({
          type: 'paragraph',
          text: 'Per segnalare problemi o dare feedback, lascia un commento nello <a href="https://github.com/pagopa/pdnd-interop-frontend/issues">spazio Github</a> di PDND Interoperabilità.',
        }),
      },
    ],
    title: 'Dicci cosa ne pensi',
  },
];
