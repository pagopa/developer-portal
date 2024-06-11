import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { mockTextBlock } from '@/../../apps/storybook-app/stories/mock-content.helper';

export const ioSignBannerLinks: readonly BannerLinkProps[] = [
  {
    theme: 'dark',
    icon: 'LiveHelp',
    content: [
      {
        ...mockTextBlock({
          type: 'paragraph',
          text: 'Scrivi un’e-mail in cui descrivi il tuo problema o dubbio all’indirizzo <a href="mailto:firmaconio-tech@pagopa.it">firmaconio-tech@pagopa.it</a>',
        }),
      },
    ],
    title: 'Serve aiuto durante l’integrazione?',
  },
  {
    theme: 'light',
    icon: 'HeadsetMic',
    content: [
      {
        ...mockTextBlock({
          type: 'paragraph',
          text: 'Per problemi o dubbi dopo l’integrazione, scrivici all’indirizzo <a href="mailto:enti-firmaconio@assistenza.pagopa.it">enti-firmaconio@assistenza.pagopa.it</a>',
        }),
      },
    ],
    title: 'Assistenza continua',
  },
];
