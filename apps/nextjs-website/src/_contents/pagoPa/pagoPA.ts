import { Product } from '@/lib/types/product';
import { pagoPaOverviewPath } from '@/_contents/pagoPa/overviewPath';
import { pagoPaGuidesPath } from './guidesPath';

export const pagoPA: Product = {
  name: 'Piattaforma pagoPA',
  path: '/pago-pa',
  subpaths: { overview: pagoPaOverviewPath, guides: pagoPaGuidesPath },
};
