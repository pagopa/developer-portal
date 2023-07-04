import { Product } from '@/lib/types/product';
import { pagoPaOverviewPath } from '@/_contents/pagoPa/overviewPath';
import { pagoPaGuideListsPath } from '@/_contents/pagoPa/guideListsPath';

export const pagoPa: Product = {
  name: 'Piattaforma pagoPA',
  path: '/pago-pa',
  subpaths: { overview: pagoPaOverviewPath, guides: pagoPaGuideListsPath },
};
