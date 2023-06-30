import { Product } from '@/lib/types/product';
import { ioSignOverviewPath } from '@/_contents/ioSign/overviewPath';
import { ioSignGuidesPath } from '@/_contents/ioSign/guidesPath';

export const ioSign: Product = {
  name: 'Firma con IO',
  path: '/firma-con-io',
  subpaths: { overview: ioSignOverviewPath, guides: ioSignGuidesPath },
};
