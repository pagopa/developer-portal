import { Product } from '@/lib/types/product';
import { sendOverviewPath } from '@/_contents/send/overviewPath';
import { sendGuidesPath } from '@/_contents/send/guidesPath';

export const send: Product = {
  name: 'SEND',
  path: '/piattaforma-notifiche',
  subpaths: { overview: sendOverviewPath, guides: sendGuidesPath },
};
