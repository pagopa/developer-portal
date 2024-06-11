import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { mockTextBlock } from '@/../../apps/storybook-app/stories/mock-content.helper';

export const pagoPaBannerLinks: readonly BannerLinkProps[] = [
  {
    theme: 'dark',
    icon: 'HeadsetMic',
    content: [
      {
        ...mockTextBlock({
          type: 'paragraph',
          text: 'Apri un ticket utilizzando l’apposita funzione all’interno della tua <a href="https://selfcare.pagopa.it/auth/login?onSuccess=%2F">Area Riservata</a>',
        }),
      },
    ],
    title: 'Serve aiuto?',
  },
  {
    theme: 'light',
    icon: 'Feedback',
    content: [
      {
        ...mockTextBlock({
          type: 'paragraph',
          text: 'Per chiarimenti sulle specifiche d’implementazione, come SACI e SANP, puoi aprire una segnalazione su <a href="https://github.com/pagopa/pagopa-api/issues">GitHub</a>',
        }),
      },
    ],
    title: 'Dicci cosa ne pensi',
  },
];
