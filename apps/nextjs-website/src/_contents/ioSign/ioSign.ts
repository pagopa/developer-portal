import { ioSignApiPath } from '@/_contents/ioSign/apiPath';
import { ioSignGuideListsPath } from '@/_contents/ioSign/guideListsPath';
import { ioSignOverviewPath } from '@/_contents/ioSign/overviewPath';
import { ioSignTutorialListsPath } from '@/_contents/ioSign/tutorialListsPath';
import { Product } from '@/lib/types/product';
import { ioSignQuickStartGuidePath } from './quickStartGuidePath';
import { baseUrl } from '@/config';

export const ioSign: Product = {
  name: 'Firma con IO',
  slug: 'firma-con-io',
  path: '/firma-con-io',
  description:
    'Richiedi la Firma Elettronica Certificata su contratti e documenti. Le cittadine e i cittadini possono firmare direttamente sull’app IO.',
  svgPath: '/icons/appIo.svg',
  pngUrl: `${baseUrl}/icons/appIo.png`,
  subpaths: {
    overview: ioSignOverviewPath,
    quickStart: ioSignQuickStartGuidePath,
    api: ioSignApiPath,
    tutorials: ioSignTutorialListsPath,
    guides: ioSignGuideListsPath,
  },
};
