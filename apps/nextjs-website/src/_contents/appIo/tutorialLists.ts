import { appIo } from '@/_contents/appIo/appIo';
import { appIoTutorialListsPath } from '@/_contents/appIo/tutorialListsPath';
import { TutorialListsData } from '@/lib/types/tutorialListsData';
import { Tutorial } from '@/lib/types/tutorialData';

export const appIoTutorials: readonly Tutorial[] = [
  {
    title: 'Quali sono i possibili accordi di adesione all’app IO',
    dateString: '2023-06-29T22:15:53.780Z',
    path: '/app-io/tutorials/quale-accordo-di-adesione-scegliere',
    name: 'Quale accordo di adesione scegliere',
  },
  {
    title: 'Come inviare un messaggio con un avviso di pagamento',
    dateString: '2023-06-29T22:15:53.780Z',
    path: '/app-io/tutorials/come-spedire-un-avviso-di-pagamento-in-un-messaggio',
    name: 'Come spedire un avviso di pagamento in un messaggio',
  },
  {
    title: 'Come allegare documenti a un messaggio',
    dateString: '2023-06-29T22:15:53.780Z',
    path: '/app-io/tutorials/come-allegare-documenti-a-un-messaggio',
    name: 'Come allegare documenti a un messaggio',
  },
];

export const appIoTutorialLists: TutorialListsData = {
  ...appIoTutorialListsPath,
  product: appIo,
  abstract: {
    title: 'Tutorial',
    description:
      'Non sai come si manda un messaggio? Vuoi creare un servizio ma non sai da dove iniziare? Risolvi ogni dubbio con questi brevi video.',
  },
  tutorials: appIoTutorials,
};
