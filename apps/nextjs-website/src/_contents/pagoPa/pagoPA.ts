import { Product } from '@/lib/types/product';
import { pagoPaOverviewPath } from '@/_contents/pagoPa/overviewPath';

export const pagoPA: Product = {
  name: 'Piattaforma pagoPA',
  path: '/pago-pa',
  subpaths: { overview: pagoPaOverviewPath },
};
