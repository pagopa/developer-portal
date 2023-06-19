import { appIOOverview } from '@/features/appIO/overview';
import { ioSignOverview } from '@/features/ioSign/overview';
import { Product } from '@/pages/api/types/product';

export const products: readonly Product[] = [
  {
    name: 'App IO',
    slug: 'app-io',
    pages: [appIOOverview],
  },
  {
    name: 'Firma con IO',
    slug: 'firma-con-io',
    pages: [ioSignOverview],
  },
];
