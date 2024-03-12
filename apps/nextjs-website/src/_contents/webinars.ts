import { Webinar } from '@/lib/types/webinar';
import { appIOGuideListsPath } from './appIo/guideListsPath';
import { appIoQuickStartGuidePath } from './appIo/quickStartGuidePath';

const testWebinar: Webinar = {
  title: 'PagoPA LAB - Test Webinar',
  description: 'Questo è un webinar di test',
  playerSrc: 'https://vimeo.com/event/4135276/embed',
  html:
    `<h4 style="font-weight: 600; font-size: 24px;">Test Webinar</h4>\n` +
    `<p>Questo è un webinar di test</p>\n` +
    `<br />\n` +
    `<br />\n` +
    `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce auctor enim vel sem fringilla, vitae malesuada nisi malesuada. Sed euismod augue id mauris aliquam, at dapibus lectus laoreet. Sed vel nulla vel risus gravida malesuada ac id tortor. Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, risus eget bibendum bibendum, quam nisi aliquam nisi, id congue lorem risus id nisi. Sed euismod, risus eget bibendum bibendum, quam nisi aliquam nisi, id congue lorem risus id nisi. Sed euismod, risus eget bibendum bibendum, quam nisi aliquam nisi, id congue lorem risus id nisi.</p>\n`,
  slug: 'test-2024-03-14',
  isVisibleInHome: false,
  isVisibleInWebinars: false,
  imagePath: '/images/webinar-cover-pago-pa-multe-14-marzo.jpg',
  speakers: [],
  startDateTime: '2024-03-14T08:30:00.000Z',
  endDateTime: '2024-03-14T09:30:00.000Z',
  subscribeCtaLabel: '',
  relatedLinks: [
    {
      path: `${appIOGuideListsPath.path}/manuale-servizi/catalogo-dei-servizi-e-modelli/i-modelli-dei-servizi-piu-frequenti/multe-per-violazione-codice-della-strada`,
      name: 'I modelli dei servizi più frequenti: Multe per violazione codice della strada',
    },
  ],
};

export const webinars: readonly Webinar[] = [
  testWebinar,
  {
    ...testWebinar,
    startDateTime: '2024-03-13T13:00:00.000Z',
    slug: 'test-2024-03-13',
    endDateTime: '2024-03-13T14:00:00.000Z',
  },
  {
    ...testWebinar,
    startDateTime: '2024-03-10T13:00:00.000Z',
    slug: 'always-live',
    endDateTime: '2040-03-13T14:00:00.000Z',
  },
  {
    title:
      'PagoPA LAB - Approfondiamo la gestione integrata del servizio multe da pagoPA e IO a SEND ',
    description:
      'Come gestire al meglio le sanzioni per violazione del Codice della strada attraverso un approccio digitale, integrato e multi-piattaforma a beneficio del Comune e del cittadino.',
    playerSrc: 'https://vimeo.com/event/4135276/embed',
    html:
      `<h4 style="font-weight: 600; font-size: 24px;"> Gestione integrata del servizio multe da pagoPA e IO a SEND</h4> \n` +
      `<p>Come semplificare ed efficientare la gestione delle multe con PagoPA? </br> In questo appuntamento saranno illustrati tutti i passaggi utili per la costruzione di un servizio pienamente digitale ed efficiente attraverso l’utilizzo sinergico di pagoPA, IO e SEND. Il webinar ha l’obiettivo infatti di fornire tutti i chiarimenti e gli strumenti utili per una corretta e virtuosa gestione digitale del servizio multe attraverso l’utilizzo integrato delle piattaforme di PagoPA.
       </p> \n` +
      `<br /> \n` +
      `<img style="height: auto;max-width: 100%" src='/images/webinar-pago-pa-multe.jpg' /> \n` +
      `<br /> \n` +
      `<p>La riscossione delle sanzioni previste dal Codice della strada è uno dei servizi più diffusi che i Comuni si trovano a dover gestire. L'utilizzo integrato di pagoPA, IO e SEND può rappresentare per le Amministrazioni un fattore chiave per efficientare tutti i processi legati al loro intero ciclo di vita, dall'emissione del preavviso fino all'invio dell'eventuale contravvenzione. Durante l’incontro verranno analizzate tutte le fasi atte all'emissione e riscossione di una multa, rappresentando anche best practice e vantaggi derivanti da un utilizzo consapevole e sinergico delle piattaforma PagoPA. Lo scopo ultimo è di fornire ai Comuni gli strumenti utili per beneficiare appieno di tutti i vantaggi legati alla gestione digitale del servizio.</p>\n`,
    slug: 'PagoPA-multe',
    isVisibleInHome: true,
    isVisibleInWebinars: true,
    imagePath: '/images/webinar-cover-pago-pa-multe.jpg',
    speakers: [
      {
        name: 'Gloriana Cimmino',
        jobTitle: 'Direttore Dipartimento Mercato PA e Imprese',
        description: '',
        imagePath: '/images/speaker-cimmino.png',
      },
      {
        name: 'Federica Amoroso',
        jobTitle: 'Senior Account Manager',
        description: '',
        imagePath: '/images/speaker-amoroso.png',
      },
      {
        name: 'Jacopo Pompilii',
        jobTitle: 'UX Design Lead',
        description: '',
        imagePath: '/images/speaker-pompilii.png',
      },
    ],
    startDateTime: '2024-03-20T09:00:00.000Z',
    endDateTime: '2024-03-20T09:45:00.000Z',
    subscribeCtaLabel: '',
    relatedLinks: [
      {
        path: `${appIOGuideListsPath.path}/manuale-servizi/catalogo-dei-servizi-e-modelli/i-modelli-dei-servizi-piu-frequenti/multe-per-violazione-codice-della-strada`,
        name: 'I modelli dei servizi più frequenti: Multe per violazione codice della strada',
      },
    ],
  },
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
    isVisibleInHome: false,
    isVisibleInWebinars: true,
    imagePath: '/images/webinar-cover-nuove-api-io.png',
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
    startDateTime: '2023-12-14T10:00:00.000Z',
    endDateTime: '2023-12-14T10:40:00.000Z',
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
          href: `${appIOGuideListsPath.path}/io-guida-tecnica`,
          iconName: 'MenuBook',
        },
      ],
    },
    relatedLinks: [
      {
        path: `${appIOGuideListsPath.path}/supporto-agli-enti`,
        name: 'Consulta FAQ e approfondimenti nella documentazione di supporto agli Enti',
      },
      {
        path: 'https://files.gitbook.com/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FZugEhXfhuchEaSiqU3p5%2Fuploads%2FKkqRR4GLnQtJ04He1afT%2FAccordo%20Base%20di%20Adesione%20App%20IO_Standard_Ver.2.4.16_1_2023.docx.pdf?alt=media',
        name: 'Scarica il contratto di adesione a IO',
      },
      {
        path: `${appIOGuideListsPath.path}/kit-comunicazione`,
        name: 'Leggi kit di comunicazione',
      },
    ],
  },
];
