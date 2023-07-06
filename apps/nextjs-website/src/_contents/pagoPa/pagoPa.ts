import { pagoPaApiPath } from '@/_contents/pagoPa/apiPath';
import { pagoPaGuideListsPath } from '@/_contents/pagoPa/guideListsPath';
import { pagoPaOverviewPath } from '@/_contents/pagoPa/overviewPath';
import { pagoPaTutorialListsPath } from '@/_contents/pagoPa/tutorialListsPath';
import { Product } from '@/lib/types/product';

export const pagoPa: Product = {
  name: 'Piattaforma pagoPA',
  path: '/pago-pa',
  description:
    'Gestisci gli incassi in modo centralizzato e con immediata riconciliazione delle posizioni debitorie.',
  svgPath: '/icons/pagoPa.svg',
  subpaths: {
    overview: pagoPaOverviewPath,
    api: pagoPaApiPath,
    tutorials: pagoPaTutorialListsPath,
    guides: pagoPaGuideListsPath,
  },
};
