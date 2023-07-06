import { ioSign } from '@/_contents/ioSign/ioSign';
import { ioSignTutorialListsPath } from '@/_contents/ioSign/tutorialListsPath';
import { TutorialListsData } from '@/lib/types/tutorialListsData';
import { Tutorial } from '@/lib/types/tutorialData';
import { ioSignBannerLinks } from '@/_contents/ioSign/bannerLinks';

export const ioSignTutorials: readonly Tutorial[] = [
  {
    title: 'Come creare e preparare il documento da firmare digitalmente',
    dateString: '2023-06-29T22:15:53.780Z',
    path: `${ioSignTutorialListsPath.path}/1`,
    name: 'tutorial 1',
  },
  {
    title: 'Come creare il Dossier per la richiesta di firma',
    dateString: '2023-06-29T22:15:53.780Z',
    path: `${ioSignTutorialListsPath.path}/2`,
    name: 'tutorial 2',
  },
  {
    title: 'Come effettuare l’upload dei documenti',
    dateString: '2023-06-29T22:15:53.780Z',
    path: `${ioSignTutorialListsPath.path}/3`,
    name: 'tutorial 3',
  },
];

export const ioSignTutorialLists: TutorialListsData = {
  ...ioSignTutorialListsPath,
  product: ioSign,
  abstract: {
    title: 'Tutorial',
    description:
      'Non sai come si manda un messaggio? Vuoi creare un servizio ma non sai da dove iniziare?  Risolvi ogni dubbio con questi brevi video.',
  },
  tutorials: ioSignTutorials,
  bannerLinks: ioSignBannerLinks,
};
