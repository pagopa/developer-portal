import { Product } from '@/lib/types/product';
import { sendOverviewPath } from '@/_contents/send/overviewPath';
import { sendGuideListsPath } from '@/_contents/send/guideListsPath';

export const send: Product = {
  name: 'Piattaforma Notifiche',
  path: '/send',
  description:
    'Invia comunicazioni a valore legale con un processo di notificazione gestito interamente dalla piattaforma.',
  svgPath: '/icons/SEND.svg',
  subpaths: { overview: sendOverviewPath, guides: sendGuideListsPath },
};
