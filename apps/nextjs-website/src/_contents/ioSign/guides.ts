import { ioSign } from './ioSign';
import { makeGuide } from '../makeDocs';
import { ioSignBannerLinks } from '@/_contents/ioSign/bannerLinks';

const manualeOperativo = makeGuide({
  product: ioSign,
  guide: {
    name: 'Manuale Operativo',
    slug: 'manuale-operativo',
  },
  versions: [
    {
      version: 'v1.0',
      dirName: 'AdBuOCmwur7AhLlgfCeG',
    },
  ],
  bannerLinks: ioSignBannerLinks,
});

export const ioSignGuides = manualeOperativo;
