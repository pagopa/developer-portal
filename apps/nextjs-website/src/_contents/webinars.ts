import { Webinar } from '@/lib/types/webinar';
import { appIOGuideListsPath } from './appIo/guideListsPath';
import { appIoQuickStartGuidePath } from './appIo/quickStartGuidePath';

// TODO: remove mock before release, ONLY FOR TESTING
const mockWebinar: readonly Webinar[] = [
  {
    title: 'Webinar nel passato',
    description: 'Webinar di test nel passato',
    playerSrc: 'https://vimeo.com/event/3859248/embed',
    html:
      `<h4 style="font-weight: 600; font-size: 24px;">Lorem ipsum</h4> \n` +
      `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse commodo elit sed porttitor mollis. Vivamus scelerisque odio quis lacus ullamcorper, eu sodales lectus pretium. Pellentesque ultricies condimentum varius. Nam at ultricies mauris, at fermentum turpis. Donec id velit risus. Nulla blandit nisi odio, eu elementum nulla fringilla sed. Nam cursus nunc dignissim pellentesque commodo. Duis vestibulum arcu vitae tellus tincidunt, a cursus eros efficitur. Phasellus pellentesque tristique nulla sit amet euismod. Donec eu tortor a ligula commodo molestie a sed ante. Nam mattis tellus quis orci rutrum vestibulum sit amet iaculis dolor. </p> \n` +
      `<br /> \n` +
      `<img style="height: auto;max-width: 100%" src='/images/webinar-io-sm.png' /> \n`,
    slug: 'past',
    speakers: [
      {
        name: 'Ivan Diana',
        jobTitle: 'Engineering Manager',
        description:
          'Engineering leader appassionato, metto al primo posto le persone e poi la tecnologia',
        imagePath: '/images/speaker-diana.png',
      },
    ],
    startDateTime: '2023-12-10T11:00:00',
    endDateTime: '2023-12-10T11:40:00',
    subscribeCtaLabel: '',
  },
  {
    title: 'Webinar cooming soon',
    description: 'Webinar di test cooming soon',
    playerSrc: 'https://vimeo.com/event/3859248/embed',
    html:
      `<h4 style="font-weight: 600; font-size: 24px;">Lorem ipsum</h4> \n` +
      `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse commodo elit sed porttitor mollis. Vivamus scelerisque odio quis lacus ullamcorper, eu sodales lectus pretium. Pellentesque ultricies condimentum varius. Nam at ultricies mauris, at fermentum turpis. Donec id velit risus. Nulla blandit nisi odio, eu elementum nulla fringilla sed. Nam cursus nunc dignissim pellentesque commodo. Duis vestibulum arcu vitae tellus tincidunt, a cursus eros efficitur. Phasellus pellentesque tristique nulla sit amet euismod. Donec eu tortor a ligula commodo molestie a sed ante. Nam mattis tellus quis orci rutrum vestibulum sit amet iaculis dolor. </p> \n` +
      `<br /> \n` +
      `<img style="height: auto;max-width: 100%" src='/images/webinar-io-sm.png' /> \n`,
    slug: 'cooming-soon',
    speakers: [
      {
        name: 'Ivan Diana',
        jobTitle: 'Engineering Manager',
        description:
          'Engineering leader appassionato, metto al primo posto le persone e poi la tecnologia',
        imagePath: '/images/speaker-diana.png',
      },
    ],
    startDateTime: '2023-12-12T11:00:00',
    endDateTime: '2023-12-12T11:40:00',
    subscribeCtaLabel: '',
  },
  {
    title: 'Webinar live',
    description: 'Webinar di test live',
    playerSrc: 'https://vimeo.com/event/3859248/embed',
    html:
      `<h4 style="font-weight: 600; font-size: 24px;">Lorem ipsum</h4> \n` +
      `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse commodo elit sed porttitor mollis. Vivamus scelerisque odio quis lacus ullamcorper, eu sodales lectus pretium. Pellentesque ultricies condimentum varius. Nam at ultricies mauris, at fermentum turpis. Donec id velit risus. Nulla blandit nisi odio, eu elementum nulla fringilla sed. Nam cursus nunc dignissim pellentesque commodo. Duis vestibulum arcu vitae tellus tincidunt, a cursus eros efficitur. Phasellus pellentesque tristique nulla sit amet euismod. Donec eu tortor a ligula commodo molestie a sed ante. Nam mattis tellus quis orci rutrum vestibulum sit amet iaculis dolor. </p> \n` +
      `<br /> \n` +
      `<img style="height: auto;max-width: 100%" src='/images/webinar-io-sm.png' /> \n`,
    slug: 'live',
    speakers: [
      {
        name: 'Ivan Diana',
        jobTitle: 'Engineering Manager',
        description:
          'Engineering leader appassionato, metto al primo posto le persone e poi la tecnologia',
        imagePath: '/images/speaker-diana.png',
      },
    ],
    startDateTime: '2023-12-11T12:00:00',
    endDateTime: '2023-12-14T6:00:00',
    subscribeCtaLabel: '',
  },
];

export const webinars: readonly Webinar[] = [
  {
    title: 'Esplorando App IO: Le nuove API dei Servizi',
    description:
      'Il mondo di IO è molto ampio, il primo passo è capire come integrarsi alle nuove API e con questo webinar vedremo le informazioni principali per farlo!',
    playerSrc: 'https://vimeo.com/event/3859248/embed',
    html:
      `<h4 style="font-weight: 600; font-size: 24px;">Tutto quello che serve per integrarsi con le nuove API</h4> \n` +
      `<p>Durante il webinar, approfondiremo la creazione, l'invio di un servizio e la gestione di scenari comuni, come "Ho creato un servizio e lo vedo in stato di bozza. Cosa devo fare?". Partecipate a questo webinar per ottenere una comprensione approfondita e per imparare a gestire in modo efficace il ciclo di vita dei vostri servizi su IO. </p> \n` +
      `<br /> \n` +
      `<img style="height: auto;max-width: 100%" src='/images/webinar-io-sm.png' /> \n` +
      `<br /> \n` +
      `<p>Gli interventi dei nostri esperti saranno intervallati da momenti di Q&A per condividere le migliori pratiche per un'esperienza fluida e di successo nella gestione dei vostri servizi. </p> \n`,
    slug: 'nuove-api-io',
    speakers: [
      {
        name: 'Ivan Diana',
        jobTitle: 'Engineering Manager',
        description:
          'Engineering leader appassionato, metto al primo posto le persone e poi la tecnologia',
        imagePath: '/images/speaker-diana.png',
      },
      {
        name: 'Lorenzo Franceschini',
        jobTitle: 'Software Engineer - Service Management App IO',
        description:
          'Sviluppatore con esperienza decennale, formatore per passione. Mi piace il confronto costruttivo e la possibilità di insegnare e apprendere dagli altri',
        imagePath: '/images/speaker-franceschini.png',
      },
      {
        name: 'Demetrio Ferraro',
        jobTitle: 'Operations Specialist - Service Management App IO ',
        description:
          'Customer specialist execution ho fatto della trasversalità e complementarità il mio punto forte',
        imagePath: '/images/speaker-ferraro.png',
      },
    ],
    startDateTime: '2023-12-14T11:00:00',
    endDateTime: '2023-12-14T11:40:00',
    subscribeCtaLabel: '',
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
          href: `${appIOGuideListsPath.path}/io-guida-tecnica/v4.0`,
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
  ...mockWebinar,
];
