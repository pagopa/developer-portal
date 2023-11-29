import { Product } from '@/lib/types/product';
import { appIoApiPath } from '@/_contents/appIo/apiPath';
import { appIOGuideListsPath } from '@/_contents/appIo/guideListsPath';
import { appIoOverviewPath } from '@/_contents/appIo/overviewPath';
import { appIoQuickStartGuidePath } from '@/_contents/appIo/quickStartGuidePath';
import { appIoTutorialListsPath } from '@/_contents/appIo/tutorialListsPath';
import { baseUrl } from '@/config';

export const appIo: Product = {
  name: "L'App IO",
  description:
    'Raccogli tutti i servizi digitali del tuo ente in un’unica piattaforma e interagisci in modo semplice e sicuro con i cittadini.',
  svgPath: '/icons/appIo.svg',
  pngUrl: `${baseUrl}/icons/appIo.png`,
  path: '/app-io',
  slug: 'app-io',
  subpaths: {
    overview: appIoOverviewPath,
    quickStart: appIoQuickStartGuidePath,
    api: appIoApiPath,
    tutorials: appIoTutorialListsPath,
    guides: appIOGuideListsPath,
  },
};
