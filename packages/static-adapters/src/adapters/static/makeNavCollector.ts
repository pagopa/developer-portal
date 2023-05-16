import { Nav, NavCollector } from 'core/domain/navigator';
import { ioSignPageLinks } from './products/ioSignPages';
import { ioAppPageLinks } from './products/ioAppPages';

const staticNav: Nav = [
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
      nav: 'Guide e Manuali',
      breadcrumb: 'App IO - Guide e Manuali',
    },
    path: ioAppPageLinks.guides,
  },
];

export const makeNavCollector = (): NavCollector => ({
  getNav: () => staticNav,
});
