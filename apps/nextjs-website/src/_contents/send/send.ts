import { Product } from '@/lib/types/product';
import { sendApiPath } from '@/_contents/send/apiPath';
import { sendGuideListsPath } from '@/_contents/send/guideListsPath';
import { sendOverviewPath } from '@/_contents/send/overviewPath';
import { sendTutorialListsPath } from '@/_contents/send/tutorialListsPath';

export const send: Product = {
  name: 'SEND - Servizio Notifiche Digitali',
  path: '/send',
  description:
    'Invia comunicazioni a valore legale con un processo di notificazione gestito interamente dalla piattaforma.',
  svgPath: '/icons/send.svg',
  subpaths: {
    overview: sendOverviewPath,
    api: sendApiPath,
    tutorials: sendTutorialListsPath,
    guides: sendGuideListsPath,
  },
};
