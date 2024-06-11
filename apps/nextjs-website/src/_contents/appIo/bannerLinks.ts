import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import {
  mockTextBlock,
  mockImageBlock,
} from '@/../../apps/storybook-app/stories/mock-content.helper';

export const appIoBannerLinks: readonly BannerLinkProps[] = [
  {
    theme: 'dark',
    icon: 'HeadsetMic',
    content: [
      { ...mockTextBlock({ type: 'heading', text: 'Hai bisogno di aiuto?' }) },
      {
        ...mockTextBlock({
          type: 'paragraph',
          text: 'Scrivi un’email in cui descrivi il tuo problema o dubbio all’indirizzo',
        }),
      },
    ],
  },
  {
    theme: 'light',
    icon: 'Feedback',
    content: [
      {
        ...mockTextBlock({
          type: 'heading',
          text: 'Dicci cosa ne pensi',
        }),
      },
      {
        ...mockTextBlock({
          type: 'paragraph',
          text: 'Per segnalare problemi o dare feedback, lascia un commento nello <a href="https://github.com/pagopa/io-app/issues/new/choose">spazio Github</a> dell’app IO',
        }),
      },
    ],
  },
];
