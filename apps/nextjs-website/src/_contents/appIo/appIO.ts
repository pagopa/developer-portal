import { Product } from '@/lib/types/product';
import { appIoOverviewPath } from '@/_contents/appIo/overviewPath';
import { appIoApiPath } from '@/_contents/appIo/apiPath';
import { appIoTutorialPath } from '@/_contents/appIo/tutorialPath';
import { appIOGuideListsPath } from '@/_contents/appIo/guideListsPath';

export const appIO: Product = {
  name: 'App IO',
  description:
    'Raccogli tutti i servizi digitali del tuo ente in un’unica piattaforma e interagisci in modo semplice e sicuro con i cittadini.',
  svgPath: '/icons/AppIO.svg',
  path: '/app-io',
  subpaths: {
    overview: appIoOverviewPath,
    api: appIoApiPath,
    tutorial: appIoTutorialPath,
    guides: appIOGuideListsPath,
  },
};
