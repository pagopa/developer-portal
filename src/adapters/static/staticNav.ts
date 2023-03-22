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
      nav: 'Guide e manuali',
      breadcrumb: 'Firma con IO - Guide e manuali',
    },
    path: '/firma-con-io/guide-e-manuali',
  },
  {
    name: {
      breadcrumb: 'Firma con IO - Manuale - 1',
    },
    path: '/firma-con-io/guide-e-manuali/manuale-1',
  },
  {
    name: {
      breadcrumb: 'Firma con IO - Manuale - 2',
    },
    path: '/firma-con-io/guide-e-manuali/manuale-2',
  },
  {
    name: {
      nav: 'Panoramica',
      breadcrumb: 'Piattaforma Notifiche - Panoramica',
    },
    path: '/piattaforma-notifiche/panoramica',
  },
];
