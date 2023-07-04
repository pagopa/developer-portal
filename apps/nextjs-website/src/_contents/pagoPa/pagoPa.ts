import { Product } from '@/lib/types/product';
import { pagoPaOverviewPath } from '@/_contents/pagoPa/overviewPath';
import { pagoPaGuideListsPath } from '@/_contents/pagoPa/guideListsPath';
import { pagoPaApiPath } from '@/_contents/pagoPa/apiPath';

export const pagoPa: Product = {
  name: 'Piattaforma pagoPA',
  path: '/pago-pa',
  subpaths: {
    overview: pagoPaOverviewPath,
    api: pagoPaApiPath,
    guides: pagoPaGuideListsPath,
  },
};
