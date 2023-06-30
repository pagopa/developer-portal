import { Product } from '@/lib/types/product';
import { pagoPaOverviewPath } from '@/_contents/pagoPa/overviewPath';
import { pagoPaGuidesPath } from '@/_contents/pagoPa/guidesPath';

export const pagoPa: Product = {
  name: 'Piattaforma pagoPA',
  path: '/pago-pa',
  subpaths: { overview: pagoPaOverviewPath, guides: pagoPaGuidesPath },
};
