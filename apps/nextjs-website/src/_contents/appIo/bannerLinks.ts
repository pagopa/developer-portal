import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import {
  mockTextBlock,
  mockUrlBlock,
} from '@/../../apps/storybook-app/stories/mock-content.helper';

export const appIoBannerLinks: readonly BannerLinkProps[] = [
  {
    theme: 'dark',
    icon: 'HeadsetMic',
    content: [
      {
        ...mockTextBlock({
          type: 'paragraph',
          text: 'Scrivi un’email in cui descrivi il tuo problema o dubbio all’indirizzo',
        }),
      },
    ],
    title: 'Hai bisogno di aiuto?',
  },
  {
    theme: 'light',
    icon: 'Feedback',
    content: [
      {
        ...mockTextBlock({
          type: 'paragraph',
          text: 'Per segnalare problemi o dare feedback, lascia un commento nello',
        }),
      },
      {
        ...mockUrlBlock({
          url: 'https://github.com/pagopa/io-app/issues/new/choose',
          text: 'spazio Github',
        }),
      },
      {
        ...mockTextBlock({
          type: 'paragraph',
          text: 'dell’app IO',
        }),
      },
    ],
    title: 'Dicci cosa ne pensi',
  },
];
