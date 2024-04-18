import { pdnd } from './pdnd';
import { GuideDefinition } from '../makeDocs';
import { pdndBannerLinks } from '@/_contents/pdnd/bannerLinks';

const manualeOperativo: GuideDefinition = {
  product: pdnd,
  guide: {
    name: 'Manuale operativo',
    slug: `manuale-operativo`,
  },
  versions: [
    {
      main: true,
      version: 'v1.0',
      dirName: 'b8HnYwaAzhxRFAZdZBXL',
    },
  ],
  bannerLinks: pdndBannerLinks,
};

export const pdndGuides = [manualeOperativo];
