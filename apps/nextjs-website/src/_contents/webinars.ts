import { Webinar } from '@/lib/types/webinar';
import { appIOGuideListsPath } from './appIo/guideListsPath';
import { appIoQuickStartGuidePath } from './appIo/quickStartGuidePath';

function imageFromPath(
  imagePath: string
): Required<Webinar['speakers'][0]['avatar']> {
  // eslint-disable-next-line functional/immutable-data
  const ext = imagePath.split('.').pop();
  return {
    name: imagePath,
    alternativeText: null,
    width: 400,
    height: 400,
    ext: `.${ext}`,
    mime: `image/${ext}`,
    url: imagePath,
  };
}

const testWebinar: Webinar = {
  title: 'Test Webinar',
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
  isVisibleInList: false,
  imagePath: '/images/webinar-cover-pago-pa-multe-14-marzo.jpg',
  speakers: [],
  startDateTime: '2024-03-14T08:30:00.000Z',
  endDateTime: '2024-03-14T09:30:00.000Z',
  subscribeCtaLabel: '',
};

export const webinars: readonly Webinar[] = [
  testWebinar,
  {
    ...testWebinar,
    startDateTime: '2024-03-13T13:00:00.000Z',
    slug: 'test-2024-03-13',
    endDateTime: '2024-03-13T14:00:00.000Z',
    playerSrc: 'https://vimeo.com/event/4153381/embed',
  },
  {
    ...testWebinar,
    startDateTime: '2024-03-10T13:00:00.000Z',
    slug: 'always-live',
    endDateTime: '2077-05-02T19:00:00.000Z',
    playerSrc: 'https://vimeo.com/event/4153381/embed',
  },
  {
    title: 'Esplorando App IO: I messaggi a contenuto remoto',
    description:
      'Tutto sulla nuova funzionalità di remotizzazione dei contenuti',
    playerSrc: 'https://vimeo.com/event/3859248/embed',
    html:
      `<h4 style="font-weight: 600; font-size: 24px;"> Un nuovo modello di comunicazione su App IO: I messaggi a contenuto remoto
      </h4> \n` +
      `<p>Esploriamo il nuovo modello di comunicazione su app IO, che consente nuovi scenari d’uso e nuove esperienze utente grazie alle tecniche di remotizzazione.
       </p> \n` +
      `<br /> \n` +
      `<img style="height: auto;width: 100%;max-width: 820px" src='/images/webinar-io-remote-content.png' /> \n` +
      `<br /> \n` +
      `<p>Partendo dall’attuale modello di delivery dei messaggi su IO, analizziamo il nuovo paradigma che prevede la remotizzazione dei contenuti grazie al colloquio in tempo reale tra le infrastrutture di IO e quelle dell’Ente mittente.</br>
      Approfondiremo gli aspetti architetturali e di processo, focalizzandoci su come IO richiede informazioni all’Ente e su come questo metta a disposizione di IO le proprie risorse. Vedremo nel dettaglio quali componenti del messaggio possono essere remotizzate e in che modo.</br>
      Analizzeremo un caso d’uso reale, evidenziando i vantaggi per le due tipologie di utenti di IO, gli Enti e ovviamente i Cittadini, come la possibilità di veicolare informazioni sensibili nel pieno rispetto del GDPR e attualizzare il contenuto dei messaggi già inviati.</p>\n`,
    slug: 'DevTalk-remote-content',
    isVisibleInHome: true,
    isVisibleInList: true,
    imagePath: '/images/webinar-cover-io-remote-content.jpg',
    speakers: [
      {
        name: 'Angelo Fiorillo',
        jobTitle: 'Product Owner - IO Comunicazione',
        avatar: imageFromPath('/images/speaker-fiorillo.png'),
      },
      {
        name: 'Lorenzo Franceschini',
        jobTitle: 'Service Manager - Service Management App IO',
        avatar: imageFromPath('/images/speaker-franceschini.png'),
      },
      {
        name: 'Demetrio Ferraro',
        jobTitle: 'Service Manager - Service Management App IO ',
        avatar: imageFromPath('/images/speaker-ferraro.png'),
      },
    ],
    startDateTime: '2024-04-02T09:00:00.000Z',
    endDateTime: '2024-04-02T09:45:00.000Z',
    subscribeCtaLabel: '',
    relatedLinks: {
      title: 'Link utili',
      links: [
        {
          text: 'Inviare un messaggio a contenuto remoto',
          href: `${appIOGuideListsPath.path}/io-guida-tecnica/funzionalita/inviare-un-messaggio/inviare-un-messaggio-a-contenuto-remoto`,
        },
      ],
    },
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
      `<img style="height: auto;width: 100%;max-width: 820px" src='/images/webinar-pago-pa-multe.jpg' /> \n` +
      `<br /> \n` +
      `<p>La riscossione delle sanzioni previste dal Codice della strada è uno dei servizi più diffusi che i Comuni si trovano a dover gestire. L'utilizzo integrato di pagoPA, IO e SEND può rappresentare per le Amministrazioni un fattore chiave per efficientare tutti i processi legati al loro intero ciclo di vita, dall'emissione del preavviso fino all'invio dell'eventuale contravvenzione. Durante l’incontro verranno analizzate tutte le fasi atte all'emissione e riscossione di una multa, rappresentando anche best practice e vantaggi derivanti da un utilizzo consapevole e sinergico delle piattaforma PagoPA. Lo scopo ultimo è di fornire ai Comuni gli strumenti utili per beneficiare appieno di tutti i vantaggi legati alla gestione digitale del servizio.</p>\n`,
    slug: 'PagoPA-multe',
    isVisibleInHome: true,
    isVisibleInList: true,
    imagePath: '/images/webinar-cover-pago-pa-multe.jpg',
    speakers: [
      {
        name: 'Gloriana Cimmino',
        jobTitle: 'Direttore Dipartimento Mercato PA e Imprese',
        avatar: imageFromPath('/images/speaker-cimmino.png'),
      },
      {
        name: 'Federica Amoroso',
        jobTitle: 'Senior Account Manager',
        avatar: imageFromPath('/images/speaker-amoroso.png'),
      },
      {
        name: 'Jacopo Pompilii',
        jobTitle: 'UX Design Lead',
        avatar: imageFromPath('/images/speaker-pompilii.png'),
      },
      {
        name: 'Gianpiero Zaffi Borgetti',
        jobTitle:
          'Responsabile area ICT e Servizi ai Comuni, IFEL Fondazione ANCI',
        avatar: imageFromPath('/images/speaker-zaffi-borgetti.png'),
      },
    ],
    startDateTime: '2024-03-20T09:00:00.000Z',
    endDateTime: '2024-03-20T10:00:00.000Z',
    subscribeCtaLabel: '',
    relatedLinks: {
      title: 'Link utili',
      links: [
        {
          text: 'I modelli dei servizi più frequenti: Multe per violazione codice della strada',
          href: `${appIOGuideListsPath.path}/manuale-servizi/catalogo-dei-servizi-e-modelli/i-modelli-dei-servizi-piu-frequenti/multe-per-violazione-codice-della-strada`,
        },
      ],
    },
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
      `<img style="height: auto;width: 100%;max-width: 820px" src='/images/webinar-io-sm.jpg' /> \n` +
      `<br /> \n` +
      `<p>Gli interventi dei nostri esperti saranno intervallati da momenti di Q&A per condividere le migliori pratiche per un'esperienza fluida e di successo nella gestione dei vostri servizi. </p> \n`,
    slug: 'nuove-api-io',
    isVisibleInHome: true,
    isVisibleInList: true,
    imagePath: '/images/webinar-cover-nuove-api-io.jpg',
    speakers: [
      {
        name: 'Ivan Diana',
        jobTitle: 'Engineering Manager',
        description: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Engineering leader appassionato, metto al primo posto le persone e poi la tecnologia',
              },
            ],
          },
        ],
        avatar: imageFromPath('/images/speaker-diana.png'),
      },
      {
        name: 'Lorenzo Franceschini',
        jobTitle: 'Software Engineer - Service Management App IO',
        description: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Sviluppatore con esperienza decennale, formatore per passione. Mi piace il confronto costruttivo e la possibilità di insegnare e apprendere dagli altri',
              },
            ],
          },
        ],
        avatar: imageFromPath('/images/speaker-franceschini.png'),
      },
      {
        name: 'Demetrio Ferraro',
        jobTitle: 'Operations Specialist - Service Management App IO ',
        description: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Customer specialist execution ho fatto della trasversalità e complementarità il mio punto forte',
              },
            ],
          },
        ],
        avatar: imageFromPath('/images/speaker-ferraro.png'),
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
    relatedLinks: {
      title: 'Link utili',
      links: [
        {
          text: 'Consulta FAQ e approfondimenti nella documentazione di supporto agli Enti',
          href: `${appIOGuideListsPath.path}/supporto-agli-enti`,
        },
        {
          text: 'Scarica il contratto di adesione a IO',
          href: 'https://files.gitbook.com/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FZugEhXfhuchEaSiqU3p5%2Fuploads%2FKkqRR4GLnQtJ04He1afT%2FAccordo%20Base%20di%20Adesione%20App%20IO_Standard_Ver.2.4.16_1_2023.docx.pdf?alt=media',
        },
        {
          text: 'Leggi kit di comunicazione',
          href: `${appIOGuideListsPath.path}/kit-comunicazione`,
        },
      ],
    },
  },
];
