import { appIo } from '@/_contents/appIo/appIo';
import { appIoTutorialListsPath } from '@/_contents/appIo/tutorialListsPath';
import { TutorialListsData } from '@/lib/types/tutorialListsData';
import { Tutorial } from '@/lib/types/tutorialData';
import { appIoBannerLinks } from '@/_contents/appIo/bannerLinks';

export const appIoTutorials: readonly Tutorial[] = [
  {
    title: 'Quali sono i possibili accordi di adesione all’app IO',
    path: `${appIoTutorialListsPath.path}/quale-accordo-di-adesione-scegliere`,
    name: 'Quale accordo di adesione scegliere',
    image: {
      url: '/images/news.png',
      alternativeText: 'Immagine: Come allegare documenti a un messaggio',
    },
    showInOverview: true,
  },
  {
    title: 'Come allegare documenti a un messaggio',
    path: `${appIoTutorialListsPath.path}/come-allegare-documenti-a-un-messaggio`,
    name: 'Come allegare documenti a un messaggio',
    image: {
      url: '/images/app-io-come-allegare-documenti.png',
      alternativeText: 'Immagine: Come allegare documenti a un messaggio',
    },

    showInOverview: true,
  },
  {
    title: 'Come sapere se un cittadino può ricevere messaggi da un servizio',
    path: `${appIoTutorialListsPath.path}/come-sapere-se-un-cittadino-ha-abilitata-la-ricezione-dei-messaggi-per-un-servizio`,
    name: 'Come sapere se un cittadino può ricevere messaggi da un servizio',
    image: {
      url: '/images/app-io-ricevere-messaggi.png',
      alternativeText:
        'Immagine: Come sapere se un cittadino può ricevere messaggi da un servizio',
    },
    showInOverview: true,
  },
  {
    title: 'Come spedire un avviso di pagamento in un messaggio',
    path: `${appIoTutorialListsPath.path}/come-spedire-un-avviso-di-pagamento-in-un-messaggio`,
    name: 'Come sapere se un cittadino può ricevere messaggi da un servizio',
    image: {
      url: '/images/app-io-come-inviare-avviso-pagamento.png',
      alternativeText:
        'Immagine: Come spedire un avviso di pagamento in un messaggio',
    },
    showInOverview: false,
  },
];

export const appIoTutorialLists: TutorialListsData = {
  ...appIoTutorialListsPath,
  product: appIo,
  abstract: {
    title: 'Tutorial',
    description:
      'Non sai come si manda un messaggio? Vuoi creare un servizio ma non sai da dove iniziare? Risolvi ogni dubbio con questi brevi tutorial.',
  },
  tutorials: appIoTutorials,
  bannerLinks: appIoBannerLinks,
};
