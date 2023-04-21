import { ProductGuideMenu } from '@/domain/productGuideMenu';

export const IOTechGuide: ProductGuideMenu = [
  {
    title: 'Guida tecnica',
    kind: 'page',
    path: 'guida-tecnica',
    slug: 'guida-tecnica',
    pages: [],
  },
  {
    title: 'Setup iniziale',
    kind: 'page',
    path: 'setup-iniziale',
    slug: 'setup-iniziale',
    pages: [
      {
        title: 'Iscrizione al Developer Portal',
        kind: 'page',
        path: 'setup-iniziale/iscrizione-al-developer-portal',
        slug: 'iscrizione-al-developer-portal',
        pages: [],
      },
    ],
  },
  {
    title: 'Funzionalità',
    kind: 'group',
  },
  {
    title: 'Pubblicare un servizio',
    kind: 'page',
    path: 'funzionalita/pubblicare-un-servizio',
    slug: 'pubblicare-un-servizio',
    pages: [
      {
        title: 'Creare un servizio',
        kind: 'page',
        path: 'funzionalita/pubblicare-un-servizio/creare-un-servizio',
        slug: 'creare-un-servizio',
        pages: [],
      },
    ],
  },
];

export const getProductGuideMenu = (
  productSlug: string,
  guideSlug: string,
  versionSlug: string
): ProductGuideMenu => IOTechGuide;
