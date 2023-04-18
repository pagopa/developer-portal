import { ProductGuideMenu } from '@/domain/productGuideMenu';

export const IOTechGuide: ProductGuideMenu = [
  {
    title: 'Guida tecnica',
    kind: 'page',
    description:
      "Questo documento è una guida tecnica all'utilizzo delle API di IO e all’integrazione dei servizi pubblici.",
    path: 'guida-tecnica',
    slug: 'guida-tecnica',
    pages: [],
  },
  {
    title: 'Setup iniziale',
    kind: 'page',
    description:
      'Per erogare i servizi su IO, è necessario prima firmare un contratto di adesione.',
    path: 'setup-iniziale',
    slug: 'setup-iniziale',
    pages: [
      {
        title: 'Iscrizione al Developer Portal',
        kind: 'page',
        description: '',
        path: 'setup-iniziale/iscrizione-al-developer-portal',
        slug: 'iscrizione-al-developer-portal',
        pages: [],
      },
    ],
  },
  {
    title: 'Funzionalità',
    kind: 'group',
    path: 'funzionalita',
    slug: 'funzionalita',
    pages: [
      {
        title: 'Pubblicare un servizio',
        kind: 'page',
        description: '',
        path: 'funzionalita/pubblicare-un-servizio',
        slug: 'pubblicare-un-servizio',
        pages: [
          {
            title: 'Creare un servizio',
            kind: 'page',
            description: '',
            path: 'funzionalita/pubblicare-un-servizio/creare-un-servizio',
            slug: 'creare-un-servizio',
            pages: [],
          },
        ],
      },
    ],
  },
];
