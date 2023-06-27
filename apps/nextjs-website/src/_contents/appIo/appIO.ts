import { Product } from '@/lib/types/product';
import { appIoOverviewPath } from '@/_contents/appIo/overviewPath';
import { appIoTutorialPath } from '@/_contents/appIo/tutorialPath';

export const appIO: Product = {
  name: 'App IO',
  slug: 'app-io',
  paths: { overview: appIoOverviewPath, tutorial: appIoTutorialPath },
};
