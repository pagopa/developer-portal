import { ioSign } from './ioSign';
import { GuideDefinition } from '../makeDocs';
import { ioSignBannerLinks } from '@/_contents/ioSign/bannerLinks';

const manualeOperativo: GuideDefinition = {
  product: ioSign,
  guide: {
    name: 'Manuale Operativo',
    slug: 'manuale-operativo',
  },
  versions: [
    {
      main: true,
      version: 'v1.0',
      dirName: 'AdBuOCmwur7AhLlgfCeG',
    },
  ],
  bannerLinks: ioSignBannerLinks,
};

const guidaUso: GuideDefinition = {
  product: ioSign,
  guide: {
    name: 'Guida alla scelta di Firma con IO',
    slug: 'guida-scelta-firma',
  },
  versions: [
    {
      main: true,
      version: 'v1.0',
      dirName: 'pAbKWM3c3Yc9pzNrJPNX',
    },
  ],
  bannerLinks: ioSignBannerLinks,
};

export const ioSignGuides = [
  manualeOperativo,
  guidaUso,
];
