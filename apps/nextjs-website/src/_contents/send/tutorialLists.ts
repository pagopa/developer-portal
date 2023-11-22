import { send } from '@/_contents/send/send';
import { sendTutorialListsPath } from '@/_contents/send/tutorialListsPath';
import { TutorialListsData } from '@/lib/types/tutorialListsData';
import { Tutorial } from '@/lib/types/tutorialData';
import { sendBannerLinks } from '@/_contents/send/bannerLinks';

export const sendTutorials: readonly Tutorial[] = [
  {
    title: 'Inserisci una notifica via curl',
    path: `${sendTutorialListsPath.path}/come-inserire-una-notifica-via-curl`,
    name: 'Inserisci una notifica via curl',
    image: {
      alt: 'Immagine: Inserisci una notifica via curl',
      url: '/images/send-tutorial-1.png',
    },
    showInOverview: true,
  },
  {
    title: 'Inserisci una notifica via postman',
    path: `${sendTutorialListsPath.path}/come-inserire-una-notifica-con-postman`,
    name: 'Inserisci una notifica via postman',
    image: {
      alt: 'Immagine: Inserisci una notifica via postman',
      url: '/images/send-tutorial-1.png',
    },
    showInOverview: true,
  },
  {
    title: 'Genera il tuo client',
    path: `${sendTutorialListsPath.path}/come-generare-il-tuo-api-client-per-le-api-di-send`,
    name: 'Genera il tuo client',
    image: {
      alt: 'Immagine: Genera il tuo client',
      url: '/images/send-tutorial-0.png',
    },
    showInOverview: true,
  },
  {
    title: 'Come spedire un avviso di pagamento in un messaggio',
    path: `${appIoTutorialListsPath.path}/come-spedire-un-avviso-di-pagamento-in-un-messaggio`,
    name: 'Come sapere se un cittadino può ricevere messaggi da un servizio',
    image: {
      url: '/images/app-io-come-inviare-avviso-pagamento.png',
      alt: 'Immagine: Come sapere se un cittadino può ricevere messaggi da un servizio',
    },
    showInOverview: false,
  },
];

export const sendTutorialLists: TutorialListsData = {
  ...sendTutorialListsPath,
  product: send,
  abstract: {
    title: 'Tutorial',
    description:
      'Non sai come si manda un messaggio? Vuoi creare un servizio ma non sai da dove iniziare? Risolvi ogni dubbio con questi brevi tutorial.',
  },
  tutorials: sendTutorials,
  bannerLinks: sendBannerLinks,
};
