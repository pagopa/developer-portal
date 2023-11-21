import { ioSign } from '@/_contents/ioSign/ioSign';
import { ioSignTutorialListsPath } from '@/_contents/ioSign/tutorialListsPath';
import { TutorialListsData } from '@/lib/types/tutorialListsData';
import { Tutorial } from '@/lib/types/tutorialData';
import { ioSignBannerLinks } from '@/_contents/ioSign/bannerLinks';

export const ioSignTutorials: readonly Tutorial[] = [
  {
    title: 'Come creare e preparare il documento da firmare digitalmente',
    path: `${ioSignTutorialListsPath.path}/come-creare-e-preparare-il-documento-da-firmare-digitalmente-con-firma-con-io`,
    name: 'Come creare e preparare il documento da firmare digitalmente',
    image: {
      alt: 'Immagine: Come creare e preparare il documento da firmare digitalmente',
      url: '/images/io-sign-firmare-documento.png',
    },
    showInOverview: true,
  },
  {
    title: 'Come creare il Dossier per la richiesta di firma',
    path: `${ioSignTutorialListsPath.path}/come-creare-il-dossier-per-la-richiesta-di-firma`,
    name: 'Come creare il Dossier per la richiesta di firma',
    image: {
      alt: 'Immagine: Come creare il Dossier per la richiesta di firma',
      url: '/images/io-sign-creare-dossier.png',
    },
    showInOverview: true,
  },
  {
    title: 'Come effettuare l’upload dei documenti',
    path: `${ioSignTutorialListsPath.path}/upload-dei-documenti`,
    name: 'Come effettuare l’upload dei documenti',
    image: {
      alt: 'Immagine: Come effettuare l’upload dei documenti',
      url: '/images/io-sign-effettuare-upload-documento.png',
    },
    showInOverview: true,
  },
];

export const ioSignTutorialLists: TutorialListsData = {
  ...ioSignTutorialListsPath,
  product: ioSign,
  abstract: {
    title: 'Tutorial',
    description:
      'Non sai come si manda un messaggio? Vuoi creare un servizio ma non sai da dove iniziare? Risolvi ogni dubbio con questi brevi tutorial.',
  },
  tutorials: ioSignTutorials,
  bannerLinks: ioSignBannerLinks,
};
