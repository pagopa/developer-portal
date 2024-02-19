import { pagoPaApiPath } from '@/_contents/pagoPa/apiPath';
import { pagoPaGuideListsPath } from '@/_contents/pagoPa/guideListsPath';
import { pagoPaOverviewPath } from '@/_contents/pagoPa/overviewPath';
import { pagoPaTutorialListsPath } from '@/_contents/pagoPa/tutorialListsPath';
import { pagoPaQuickStartGuidePath } from '@/_contents/pagoPa/quickStartGuidePath';
import { Product } from '@/lib/types/product';

export const pagoPa: Product = {
  name: 'Piattaforma pagoPA',
  description:
    'Gestisci gli incassi in modo centralizzato e con immediata riconciliazione delle posizioni debitorie.',
  path: '/pago-pa',
  slug: 'pago-pa',
  logo: {
    name: '',
    width: 60,
    height: 61,
    ext: '.svg',
    mime: 'image/svg+xml',
    url: '/icons/pagoPa.svg',
  },

  subpaths: {
    overview: pagoPaOverviewPath,
    quickStart: pagoPaQuickStartGuidePath,
    api: pagoPaApiPath,
    tutorials: pagoPaTutorialListsPath,
    guides: pagoPaGuideListsPath,
  },
};
