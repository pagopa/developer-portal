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
  intro: {
    title: 'Quick start',
    description:
      'I cittadini possono essere notificati di eventuali multe e provvedere al pagamento attraverso Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien.',
  },
  related: {
    title: 'Risorse correlate',
    previews: [
      {
        type: 'api',
        preTitle: 'API',
        title: 'Vedi le API',
        description:
          'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
        findMore: {
          text: 'Scopri di più',
          href: '#',
        },
      },
      {
        type: 'tutorial',
        preTitle: 'Tutorial',
        title: 'Scopri i tutorial',
        description:
          'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
        findMore: {
          text: 'Scopri di più',
          href: '#',
        },
      },
      {
        type: 'guide',
        preTitle: 'Guida Tecnica',
        title: 'Consulta la guida tecnica',
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
