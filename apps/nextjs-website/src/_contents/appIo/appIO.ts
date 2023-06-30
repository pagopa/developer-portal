import { Product } from '@/lib/types/product';
import { appIoOverviewPath } from '@/_contents/appIo/overviewPath';
import { appIoApiPath } from '@/_contents/appIo/apiPath';

export const appIO: Product = {
  name: 'App IO',
  path: '/app-io',
  subpaths: { overview: appIoOverviewPath, api: appIoApiPath },
};
