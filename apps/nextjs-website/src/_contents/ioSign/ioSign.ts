import { Product } from '@/lib/types/product';
import { ioSignOverviewPath } from '@/_contents/ioSign/overviewPath';
import { ioSignGuideListsPath } from '@/_contents/ioSign/guideListsPath';

export const ioSign: Product = {
  name: 'Firma con IO',
  path: '/io-sign',
  subpaths: { overview: ioSignOverviewPath, guides: ioSignGuideListsPath },
};
