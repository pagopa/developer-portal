import { Product } from '@/lib/types/product';
import { sendOverviewPath } from '@/_contents/send/overviewPath';
import { sendGuideListsPath } from '@/_contents/send/guideListsPath';
import { sendApiPath } from '@/_contents/send/apiPath';
import { sendTutorialPath } from '@/_contents/send/tutorialPath';

export const send: Product = {
  name: 'SEND',
  path: '/send',
  subpaths: {
    overview: sendOverviewPath,
    api: sendApiPath,
    tutorial: sendTutorialPath,
    guides: sendGuideListsPath,
  },
  description:
    'Invia comunicazioni a valore legale con un processo di notificazione gestito interamente dalla piattaforma.',
  svgPath: '/icons/SEND.svg',
};
