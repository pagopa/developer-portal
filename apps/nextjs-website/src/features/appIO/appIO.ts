import { Product } from '@/api/types/product';
import { appIoOverviewPath } from '@/features/appIO/overviewPath';

export const appIO: Product = {
  name: 'App IO',
  slug: 'app-io',
  paths: [appIoOverviewPath],
  type: 'product',
};
