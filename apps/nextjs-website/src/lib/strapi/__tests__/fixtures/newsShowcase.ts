import { StrapiNewsShowcase } from '../../types/newsShowcase';
import { mediaJpeg } from '../factories/media';

export const newsShowcase = {
  title: "Cosa c'è di nuovo",
  subTitle: 'Le ultime novità su SEND e non solo',
  items: [
    {
      title:
        "Usa il validatore di SEND per fare una verifica sull'integrazione",
      comingSoon: false,
      publishedAt: '2024-04-09T15:21:06.885Z',
      label: 'Label',
      link: {
        text: 'Vai al validatore',
        href: '/send/guides/validatore',
        target: '_self',
      },
      image: mediaJpeg(),
    },
    {
      title:
        "Scopri la Quick Start di piattaforma pagoPA: l'integrazione in pochi semplici step",
      comingSoon: false,
      publishedAt: '2024-04-09T15:21:03.877Z',
      label: 'Label',
      link: {
        text: 'Vai alla guida',
        href: '/pago-pa/quick-start',
        target: '_self',
      },
      image: mediaJpeg(),
    },
    {
      title: 'Scopri i nuovi tutorial di Firma con IO',
      comingSoon: false,
      publishedAt: '2024-04-09T15:21:00.525Z',
      label: 'Label',
      link: {
        text: 'Vai ai tutorial',
        href: '/firma-con-io/tutorials',
        target: '_self',
      },
      image: mediaJpeg(),
    },
  ],
  link: {
    text: 'Vai alle release note',
    href: '/send/release-note',
    target: '_self',
  },
} satisfies StrapiNewsShowcase;
