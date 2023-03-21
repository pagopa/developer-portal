import { NavLinks } from '@/domain/navLinks';

export const navLinks: NavLinks = [
  {
    name: 'Firma con IO',
    path: '/firma-con-io',
    children: [
      {
        name: 'Panoramica',
        path: '/firma-con-io/panoramica',
        children: [],
      },
      {
        name: 'Quick Start',
        path: '/firma-con-io/quick-start',
        children: [],
      },
    ],
  },
];
