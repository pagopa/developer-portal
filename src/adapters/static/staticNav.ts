import { Nav } from '@/domain/navigator';
import { ioSignOverviewPreview, ioSignQuickStartPreview, ioSignTutorialPreview } from './staticProduct';

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
    path: ioSignOverviewPreview.preview.link,
  },
  {
    name: {
      nav: 'Quick Start',
      breadcrumb: 'Firma con IO - Quick Start',
    },
    path: ioSignQuickStartPreview.link,
  },
  {
    name: {
      nav: 'Tutorial',
      breadcrumb: 'Firma con IO - Tutorial',
    },
    path: ioSignTutorialPreview.preview.link,
  },
];
