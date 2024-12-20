import { ioSignApiPath } from '@/_contents/ioSign/apiPath';
import { ioSignGuideListsPath } from '@/_contents/ioSign/guideListsPath';
import { ioSignOverviewPath } from '@/_contents/ioSign/overviewPath';
import { ioSignTutorialListsPath } from '@/_contents/ioSign/tutorialListsPath';
import { Product } from '@/lib/types/product';
import { ioSignQuickStartGuidePath } from './quickStartGuidePath';
import { ioSignBannerLinks } from './bannerLinks';

export const ioSign: Product = {
  name: 'Firma con IO',
  shortName: 'Firma con IO',
  description:
    'Richiedi la Firma Elettronica Certificata su contratti e documenti. Le cittadine e i cittadini possono firmare direttamente sull’app IO.',
  slug: 'firma-con-io',
  path: '/firma-con-io',
  logo: {
    alternativeText: 'Firma con IO',
    caption: undefined,
    size: 10,
    name: '',
    width: 60,
    height: 61,
    ext: '.svg',
    mime: 'image/svg+xml',
    url: '/icons/appIo.svg',
  },
  subpaths: {
    overview: ioSignOverviewPath,
    quickStart: ioSignQuickStartGuidePath,
    api: ioSignApiPath,
    tutorials: ioSignTutorialListsPath,
    guides: ioSignGuideListsPath,
  },
  bannerLinks: ioSignBannerLinks,
};
