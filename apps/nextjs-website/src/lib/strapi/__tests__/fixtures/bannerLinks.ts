import { mediaVectorJson } from '@/lib/strapi/__tests__/fixtures/media';

const firstItem = {
  id: 2,
  title: 'Serve aiuto?',
  content: [
    {
      type: 'paragraph',
      children: [
        {
          text: 'Apri un ticket utilizzando l’apposita funzione all’interno della tua ',
          type: 'text',
        },
        {
          url: 'https://selfcare.pagopa.it/auth/login?onSuccess=%2F',
          type: 'link',
          children: [{ bold: true, text: 'Area Riservata', type: 'text' }],
        },
        { text: '', type: 'text' },
      ],
    },
  ],
  theme: 'dark',
  subtitle: null,
  icon: mediaVectorJson,
};

const secondItem = {
  id: 3,
  title: 'Dicci cosa ne pensi',
  content: [
    {
      type: 'paragraph',
      children: [
        {
          text: 'Per chiarimenti sulle specifiche d’implementazione, come SACI e SANP, puoi aprire una segnalazione su ',
          type: 'text',
        },
        {
          url: 'https://github.com/pagopa/pagopa-api/issues',
          type: 'link',
          children: [{ text: 'GitHub', type: 'text' }],
        },
        { text: '', type: 'text' },
      ],
    },
  ],
  theme: 'light',
  subtitle: null,
  icon: mediaVectorJson,
};

export const bannerLinks = [firstItem, secondItem];
