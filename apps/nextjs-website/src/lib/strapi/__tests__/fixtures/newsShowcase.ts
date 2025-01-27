import { mediaRasterJson } from '@/lib/strapi/__tests__/fixtures/media';

export const newsShowcase = {
  id: 12,
  title: "Cosa c'è di nuovo",
  subTitle: null,
  items: {
    data: [
      {
        id: 33,
        attributes: {
          title:
            'Usa il validatore di SEND per fare una verifica sull’integrazione',
          comingSoon: false,
          createdAt: '2024-04-09T15:14:17.240Z',
          updatedAt: '2025-01-23T08:46:59.696Z',
          publishedAt: '2024-04-09T15:21:06.885Z',
          locale: 'it',
          label: 'SEND GA 2.3',
          link: {
            id: 600,
            text: 'Vai al validatore',
            href: '/send/guides/validatore',
            target: null,
          },
          image: mediaRasterJson,
        },
      },
      {
        id: 32,
        attributes: {
          title:
            'Scopri la Quick Start di piattaforma pagoPA: l’integrazione in pochi semplici step',
          comingSoon: false,
          createdAt: '2024-04-09T15:20:36.038Z',
          updatedAt: '2024-04-09T15:21:03.886Z',
          publishedAt: '2024-04-09T15:21:03.877Z',
          locale: 'it',
          label: null,
          link: {
            id: 599,
            text: 'Vai alla guida',
            href: '/pago-pa/quick-start',
            target: null,
          },
          image: mediaRasterJson,
        },
      },
      {
        id: 31,
        attributes: {
          title: 'Scopri i nuovi tutorial di Firma con IO',
          comingSoon: false,
          createdAt: '2024-04-09T15:15:38.917Z',
          updatedAt: '2025-01-22T14:33:37.191Z',
          publishedAt: '2024-04-09T15:21:00.525Z',
          locale: 'it',
          label: 'SEND GA 2.3',
          link: {
            id: 598,
            text: 'Vai ai tutorial',
            href: '/firma-con-io/tutorials',
            target: null,
          },
          image: mediaRasterJson,
        },
      },
    ],
  },
  link: {
    id: 657,
    text: 'Vai alle release note',
    href: '/send/release-note',
    target: '_self',
  },
};
