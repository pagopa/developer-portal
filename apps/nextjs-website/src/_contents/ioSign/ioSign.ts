import { Product } from '@/lib/types/product';
import { ioSignOverviewPath } from '@/_contents/ioSign/overviewPath';
import { ioSignGuideListsPath } from '@/_contents/ioSign/guideListsPath';
import { ioSignApiPath } from '@/_contents/ioSign/apiPath';

export const ioSign: Product = {
  name: 'Firma con IO',
  path: '/io-sign',
  subpaths: {
    overview: ioSignOverviewPath,
    api: ioSignApiPath,
    guides: ioSignGuideListsPath,
  },
};
