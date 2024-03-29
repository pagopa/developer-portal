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
      alternativeText: 'Immagine: Inserisci una notifica via curl',
      url: '/images/send-tutorial-1.png',
    },
    showInOverview: true,
  },
  {
    title: 'Genera il tuo client',
    path: `${sendTutorialListsPath.path}/come-generare-il-tuo-api-client-per-le-api-di-send`,
    name: 'Genera il tuo client',
    image: {
      alternativeText: 'Immagine: Genera il tuo client',
      url: '/images/send-tutorial-0.png',
    },
    showInOverview: true,
  },
  {
    title: `Configurare PDND/Interoperabilità per i servizi SEND`,
    path: `${sendTutorialListsPath.path}/configurare-laccesso-ad-interoperabilita-per-i-servizi-send`,
    name: 'Genera il tuo client',
    image: {
      alternativeText: 'Immagine: Genera il tuo client',
      url: '/images/send-tutorial-2.png',
    },
    showInOverview: true,
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
