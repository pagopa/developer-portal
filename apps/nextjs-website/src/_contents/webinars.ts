import { Webinar } from '@/lib/types/webinar';
import { appIOGuideListsPath } from './appIo/guideListsPath';
import { appIoQuickStartGuidePath } from './appIo/quickStartGuidePath';

export const webinars: readonly Webinar[] = [
  {
    title: 'Comunicazioni a valore legale: presente e futuro',
    description:
      'Raccogli tutti i servizi digitali del tuo ente in un’unica piattaforma e interagisci in modo semplice e sicuro con i cittadini. Raccogli tutti i servizi digitali del tuo ente in un’unica piattaforma.',
    slug: 'comunicazioni-a-valore-legale',
    speakers: [
      {
        name: 'Anna Bianchi',
        jobTitle: 'Product Owner SEND',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
        imagePath: '/images/speaker-00.png',
      },
      {
        name: 'Mario Rossi',
        jobTitle: 'Software Engineer',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
        imagePath: '/images/speaker-01.png',
      },
    ],
    startDateTime: new Date('2023-10-31T11:00:00'),
    endDateTime: new Date('2023-10-31T13:00:00'),
    startInfo: {
      title: 'Risorse correlate',
      cards: [
        {
          title: 'Quick Start',
          text: 'Aderire a IO tramite l’Area Riservata, creare un servizio, verificare l’esistenza di un utente, inviare un messaggio: ecco come si fa',
          href: `${appIoQuickStartGuidePath.path}`,
          iconName: 'FlagOutlined',
        },
        {
          title: 'Documentazione API',
          text: "Esplora le API Rest per l'invio dei messaggi e la creazione di servizi sull'app IO",
          href: '/app-io/api',
          iconName: 'FolderOutlined',
        },
        {
          title: 'Guida tecnica',
          text: 'Cosa può fare il tuo ente con l’app IO? Seleziona il settore di appartenenza e approfondisci i principali casi d’uso dedicati.',
          href: `${appIOGuideListsPath.path}/io-guida-tecnica/v3.0`,
          iconName: 'MenuBook',
        },
      ],
    },
    relatedLinks: [
      {
        path: `${appIOGuideListsPath.path}/supporto-agli-enti/v1.0`,
        name: 'Consulta FAQ e approfondimenti nella documentazione di supporto agli Enti',
      },
      {
        path: 'https://files.gitbook.com/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FZugEhXfhuchEaSiqU3p5%2Fuploads%2FKkqRR4GLnQtJ04He1afT%2FAccordo%20Base%20di%20Adesione%20App%20IO_Standard_Ver.2.4.16_1_2023.docx.pdf?alt=media',
        name: 'Scarica il contratto di adesione a IO',
      },
      {
        path: `${appIOGuideListsPath.path}/kit-comunicazione/v1.0`,
        name: 'Leggi kit di comunicazione',
      },
    ],
  },
];
