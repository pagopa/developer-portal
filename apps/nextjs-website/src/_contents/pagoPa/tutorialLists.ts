import { pagoPa } from '@/_contents/pagoPa/pagoPa';
import { pagoPaTutorialListsPath } from '@/_contents/pagoPa/tutorialListsPath';
import { TutorialListsData } from '@/lib/types/tutorialListsData';
import { Tutorial } from '@/lib/types/tutorialData';
import { pagoPaBannerLinks } from '@/_contents/pagoPa/bannerLinks';

export const pagoPaTutorials: readonly Tutorial[] = [
  {
    title: 'Come richiedere pagamenti che contengono marca da bollo digitale',
    dateString: '2023-06-29T22:15:53.780Z',
    path: `${pagoPaTutorialListsPath.path}/come-richiedere-pagamenti-che-contengono-marca-da-bollo-digitale`,
    name: 'Come richiedere pagamenti che contengono marca da bollo digitale',
  },
  {
    title: 'Come avviare un esercizio come Ente Creditore su pagoPA',
    dateString: '2023-06-29T22:15:53.780Z',
    path: `${pagoPaTutorialListsPath.path}/come-avviare-un-esercizio-come-ente-creditore-su-pagopa`,
    name: 'Come avviare un esercizio come Ente Creditore su pagoPA',
  },
  {
    title: 'Come stampare un avviso di pagamento in formato PDF',
    dateString: '2023-06-29T22:15:53.780Z',
    path: `${pagoPaTutorialListsPath.path}/come-stampare-un-avviso-di-pagamento-in-formato-pdf`,
    name: 'Come stampare un avviso di pagamento in formato PDF',
  },
];

export const pagoPaTutorialLists: TutorialListsData = {
  ...pagoPaTutorialListsPath,
  product: pagoPa,
  abstract: {
    title: 'Tutorial',
    description:
      'Quali sono i passaggi per rendere disponibili i propri servizi di pagamento sulla piattaforma pagoPA? Come si stampa un avviso di pagamento? Risolvi ogni dubbio con questi brevi tutorial.',
  },
  tutorials: pagoPaTutorials,
  bannerLinks: pagoPaBannerLinks,
};
