import { Product } from '@/lib/types/product';
import { sendApiPath } from '@/_contents/send/apiPath';
import { sendGuideListsPath } from '@/_contents/send/guideListsPath';
import { sendOverviewPath } from '@/_contents/send/overviewPath';
import { sendTutorialListsPath } from '@/_contents/send/tutorialListsPath';
import { sendQuickStartGuidePath } from '@/_contents/send/quickStartGuidePath';
import { sendBannerLinks } from './bannerLinks';

export const send: Product = {
  name: 'SEND - Servizio Notifiche Digitali',
  shortName: 'SEND',
  description:
    'Invia comunicazioni a valore legale con un processo di notificazione gestito interamente dalla piattaforma.',
  slug: 'send',
  path: '/send',
  logo: {
    alternativeText: 'SEND - Servizio Notifiche Digitali',
    caption: undefined,
    size: 10,
    name: '',
    width: 60,
    height: 61,
    ext: '.svg',
    mime: 'image/svg+xml',
    url: '/icons/send.svg',
  },
  subpaths: {
    overview: sendOverviewPath,
    quickStart: sendQuickStartGuidePath,
    api: sendApiPath,
    tutorials: sendTutorialListsPath,
    guides: sendGuideListsPath,
  },
  bannerLinks: sendBannerLinks,
};
