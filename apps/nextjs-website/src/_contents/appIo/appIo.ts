import { Product } from '@/lib/types/product';
import { appIoOverviewPath } from '@/_contents/appIo/overviewPath';
import { appIoApiPath } from '@/_contents/appIo/apiPath';
import { appIOGuideListsPath } from '@/_contents/appIo/guideListsPath';
import { appIoTutorialListsPath } from '@/_contents/appIo/tutorialListsPath';

export const appIo: Product = {
  name: "L'App IO",
  description:
    'Raccogli tutti i servizi digitali del tuo ente in un’unica piattaforma e interagisci in modo semplice e sicuro con i cittadini.',
  svgPath: '/icons/appIo.svg',
  path: '/app-io',
  subpaths: {
    overview: appIoOverviewPath,
    api: appIoApiPath,
    tutorials: appIoTutorialListsPath,
    guides: appIOGuideListsPath,
  },
};
