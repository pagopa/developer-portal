import { Product } from '@/lib/types/product';
import { pagoPaOverviewPath } from '@/_contents/pagoPa/overviewPath';
import { pagoPaGuideListsPath } from '@/_contents/pagoPa/guideListsPath';
import { pagoPaApiPath } from '@/_contents/pagoPa/apiPath';

export const pagoPa: Product = {
  name: 'Piattaforma pagoPA',
  path: '/pago-pa',
  description:
    'Gestisci gli incassi in modo centralizzato e con immediata riconciliazione delle posizioni debitorie.',
  svgPath: '/icons/PagoPA.svg',
  subpaths: {
    overview: pagoPaOverviewPath,
    api: pagoPaApiPath,
    guides: pagoPaGuideListsPath,
  },
};
