import { Product } from '@/lib/types/product';
import { ioSignOverviewPath } from '@/_contents/ioSign/overviewPath';
import { ioSignGuideListsPath } from '@/_contents/ioSign/guideListsPath';
import { ioSignApiPath } from '@/_contents/ioSign/apiPath';
import { ioSignTutorialPath } from '@/_contents/ioSign/tutorialPath';

export const ioSign: Product = {
  name: 'Firma con IO',
  description:
    'Richiedi la Firma Elettronica Certificata su contratti e documenti. Le cittadine e i cittadini possono firmare direttamente sull’app IO.',
  svgPath: '/icons/AppIO.svg',
  path: '/io-sign',
  subpaths: {
    overview: ioSignOverviewPath,
    api: ioSignApiPath,
    tutorial: ioSignTutorialPath,
    guides: ioSignGuideListsPath,
  },
};
