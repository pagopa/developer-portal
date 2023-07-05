import { Product } from '@/lib/types/product';
import { sendOverviewPath } from '@/_contents/send/overviewPath';
import { sendGuideListsPath } from '@/_contents/send/guideListsPath';
import { sendApiPath } from './apiPath';

export const send: Product = {
  name: 'Piattaforma Notifiche',
  path: '/send',
  subpaths: {
    overview: sendOverviewPath,
    api: sendApiPath,
    guides: sendGuideListsPath,
  },
  description:
    'Invia comunicazioni a valore legale con un processo di notificazione gestito interamente dalla piattaforma.',
  svgPath: '/icons/SEND.svg',
};
