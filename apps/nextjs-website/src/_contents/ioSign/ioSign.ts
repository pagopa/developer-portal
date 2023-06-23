import { Product } from '@/lib/types/product';
import { ioSignOverviewPath } from '@/_contents/ioSign/overviewPath';

export const ioSign: Product = {
  name: 'Firma con IO',
  slug: 'firma-con-io',
  paths: [ioSignOverviewPath],
  type: 'product',
};
