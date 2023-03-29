import { Nav } from '@/domain/navigator';
import { ioSignPageLinks } from './staticProduct';

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
    path: ioSignPageLinks.overview,
  },
  {
    name: {
      nav: 'Quick Start',
      breadcrumb: 'Firma con IO - Quick Start',
    },
    path: ioSignPageLinks.quickStart,
  },
  {
    name: {
      nav: 'Tutorial',
      breadcrumb: 'Firma con IO - Tutorial',
    },
    path: ioSignPageLinks.tutorial,
  },
  {
    name: {
      breadcrumb:
        'Come creare e preparare il documento  da firmare digitalmente con Firma con IO',
    },
    path: ioSignPageLinks.tutorialHowCreatePdf,
  },
];
