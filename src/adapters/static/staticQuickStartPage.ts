import { ProductQuickStartPage } from '@/domain/productQuickStartPage';

export const staticProductQuickStartPage: ProductQuickStartPage = {
  title: 'Firma con IO',
  submenu: [
    {
      text: 'Panoramica',
      href: '/firma-con-io/panoramica',
    },
    {
      text: 'Quick Start',
      href: '/firma-con-io/quick-start',
    },
  ],
  related: {
    title: 'Esplora i tutorial',
    previews: [
      {
        type: 'quickstart',
        preTitle: 'QUICK START',
        title: 'Prepara i documenti per la firma',
        description:
          'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
        findMore: {
          text: 'Scopri di più',
          href: '#',
        },
      },
      {
        type: 'tutorial',
        preTitle: 'TUTORIAL',
        title: 'Firma con IO in 3 minuti',
        description:
          'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
        findMore: {
          text: 'Scopri di più',
          href: '#',
        },
      },
    ],
  },
};
