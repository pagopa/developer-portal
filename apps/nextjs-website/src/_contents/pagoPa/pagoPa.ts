import { pagoPaApiPath } from '@/_contents/pagoPa/apiPath';
import { pagoPaGuideListsPath } from '@/_contents/pagoPa/guideListsPath';
import { pagoPaOverviewPath } from '@/_contents/pagoPa/overviewPath';
import { pagoPaTutorialListsPath } from '@/_contents/pagoPa/tutorialListsPath';
import { pagoPaQuickStartGuidePath } from '@/_contents/pagoPa/quickStartGuidePath';
import { Product } from '@/lib/types/product';
import { baseUrl } from '@/config';

export const pagoPa: Product = {
  name: 'Piattaforma pagoPA',
  path: '/pago-pa',
  slug: 'pago-pa',
  description:
    'Gestisci gli incassi in modo centralizzato e con immediata riconciliazione delle posizioni debitorie.',
  svgPath: '/icons/pagoPa.svg',
  pngUrl: `${baseUrl}/icons/pagoPa.png`,
  subpaths: {
    overview: pagoPaOverviewPath,
    quickStart: pagoPaQuickStartGuidePath,
    api: pagoPaApiPath,
    tutorials: pagoPaTutorialListsPath,
    guides: pagoPaGuideListsPath,
  },
};
