import { Nav } from '@/domain/navigator';

export const staticNav: Nav = [
  {
    name: {
      breadcrumb: 'Homepage',
    },
    path: '/',
  },
  {
    name: {
      nav: 'Panoramica',
      breadcrumb: 'Firma con IO - Panoramica',
    },
    path: '/firma-con-io/panoramica',
  },
  {
    name: {
      nav: 'Quick Start',
      breadcrumb: 'Firma con IO - Quick Start',
    },
    path: '/firma-con-io/quick-start',
  },
  {
    name: {
      nav: 'Tutorial',
      breadcrumb: 'Firma con IO - Tutorial',
    },
    path: '/firma-con-io/tutorial',
  }
];
