import { Product } from '@/api/types/product';
import { ioSignOverviewPath } from '@/features/ioSign/overviewPath';

export const ioSign: Product = {
  name: 'Firma con IO',
  slug: 'firma-con-io',
  paths: [ioSignOverviewPath],
  type: 'product',
};
