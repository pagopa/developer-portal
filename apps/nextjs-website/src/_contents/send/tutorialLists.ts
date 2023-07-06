import { send } from '@/_contents/send/send';
import { sendTutorialListsPath } from '@/_contents/send/tutorialListsPath';
import { TutorialListsData } from '@/lib/types/tutorialListsData';
import { Tutorial } from '@/lib/types/tutorialData';
import { sendBannerLinks } from '@/_contents/send/bannerLinks';

export const sendTutorials: readonly Tutorial[] = [
  {
    title: 'Inserisci una Notifica via curl',
    dateString: '2023-06-29T22:15:53.780Z',
    path: '/send/tutorial/1',
    name: 'tutorial 1',
  },
  {
    title: 'Inserisci una Notifica via postman',
    dateString: '2023-06-29T22:15:53.780Z',
    path: '/send/tutorial/2',
    name: 'tutorial 2',
  },
  {
    title: 'Genera il tuo client per le nostre API',
    dateString: '2023-06-29T22:15:53.780Z',
    path: '/send/tutorial/3',
    name: 'tutorial 3',
  },
];

export const sendTutorialLists: TutorialListsData = {
  ...sendTutorialListsPath,
  product: send,
  abstract: {
    title: 'Tutorial',
    description:
      'Non sai come si manda un messaggio? Vuoi creare un servizio ma non sai da dove iniziare? Risolvi ogni dubbio con questi brevi video.',
  },
  tutorials: sendTutorials,
  bannerLinks: sendBannerLinks,
};
