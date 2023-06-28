import { Product } from '@/lib/types/product';
import { appIoOverviewPath } from '@/_contents/appIo/overviewPath';
import { appIoApisPath } from '@/_contents/appIo/apisPath';

export const appIO: Product = {
  name: 'App IO',
  path: 'app-io',
  subpaths: { overview: appIoOverviewPath, apis: appIoApisPath },
};
