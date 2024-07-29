import { Product } from '@/lib/types/product';
import { pdndGuideListsPath } from '@/_contents/pdnd/guideListsPath';
import { pdndOverviewPath } from '@/_contents/pdnd/overviewPath';
import { pdndQuickStartGuidePath } from '@/_contents/pdnd/quickStartGuidePath';
import { pdndTutorialListsPath } from '@/_contents/pdnd/tutorialListsPath';

export const pdnd: Product = {
  name: 'PDND Interoperabilità',
  shortName: 'PDND',
  description:
    'Integra i tuoi servizi tramite PDND Interoperabiltà, la piattaforma che abilita lo scambio di informazioni tra gli enti. ',
  slug: 'pdnd-interoperabilita',
  path: '/pdnd-interoperabilita',
  logo: {
    alternativeText: 'PDND Interoperabilità',
    caption: undefined,
    size: 10,
    name: '',
    width: 60,
    height: 61,
    ext: '.svg',
    mime: 'image/svg+xml',
    url: '/icons/pdnd.svg',
  },
  subpaths: {
    overview: pdndOverviewPath,
    quickStart: pdndQuickStartGuidePath,
    tutorials: pdndTutorialListsPath,
    guides: pdndGuideListsPath,
  },
};
