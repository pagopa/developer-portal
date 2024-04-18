import { pdnd } from '@/_contents/pdnd/pdnd';
import { pdndTutorialListsPath } from '@/_contents/pdnd/tutorialListsPath';
import { TutorialListsData } from '@/lib/types/tutorialListsData';
import { Tutorial } from '@/lib/types/tutorialData';
import { pdndBannerLinks } from '@/_contents/pdnd/bannerLinks';

export const pdndTutorials: readonly Tutorial[] = [
  {
    title: 'Come creare e rendere disponibile un e-service',
    path: `${pdndTutorialListsPath.path}/come-creare-e-rendere-disponibile-un-e-service`,
    name: 'Come creare e rendere disponibile un e-service',
    image: {
      url: '/images/pdnd-tutorial-0.png',
      alternativeText:
        'Immagine: Come creare e rendere disponibile un e-service',
    },
    showInOverview: true,
  },
  {
    title: "Cos'è e come si crea una finalità in PDND",
    path: `${pdndTutorialListsPath.path}/cose-e-come-si-crea-una-finalita-in-pdnd`,
    name: "Cos'è e come si crea una finalità in PDND",
    image: {
      url: '/images/pdnd-tutorial-1.png',
      alternativeText: "Immagine: Cos'è e come si crea una finalità in PDND",
    },
    showInOverview: true,
  },
  {
    title: 'Come associare un client a una finalità',
    path: `${pdndTutorialListsPath.path}/come-associare-un-client-a-una-finalita`,
    name: 'Come associare un client a una finalità',
    image: {
      url: '/images/pdnd-tutorial-2.png',
      alternativeText: 'Immagine: Come associare un client a una finalità',
    },
    showInOverview: true,
  },
];

export const pdndTutorialLists: TutorialListsData = {
  ...pdndTutorialListsPath,
  product: pdnd,
  abstract: {
    title: 'Tutorial',
    description:
      'Vuoi scoprire cos’è una Finalità su PDND Interoperabilità? Vuoi capire come mettere un servizio a disposizione di altri enti? Questi tutorial possono aiutarti.',
  },
  tutorials: pdndTutorials,
  bannerLinks: pdndBannerLinks,
};
