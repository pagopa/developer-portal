import { Nav } from '@/domain/navigator';
import { ioSignPageLinks } from './products/ioSignPages';
import { ioAppPageLinks } from './products/ioAppPages';

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
      nav: 'Guida Rapida',
      breadcrumb: 'Firma con IO - Guida Rapida',
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
        'Preparare il documento da firmare digitalmente con Firma con IO',
    },
    path: ioSignPageLinks.tutorialHowCreatePdf,
  },
  {
    name: {
      breadcrumb: `Guida tecnica all'integrazione dei servizi`,
    },
    path: ioAppPageLinks.guideTechGuideV23Home,
  },
  {
    name: {
      breadcrumb: `Guida tecnica all'integrazione dei servizi`,
    },
    path: ioAppPageLinks.guideTechGuideV23Changelog,
  },
];
