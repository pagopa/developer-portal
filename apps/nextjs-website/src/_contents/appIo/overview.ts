import { OverviewData } from '@/lib/types/overviewData';
import { appIO } from '@/_contents/appIo/appIO';
import { appIoOverviewPath } from '@/_contents/appIo/overviewPath';
import { tutorials } from '@/_contents/appIo/tutorials';

export const appIoOverview: OverviewData = {
  ...appIoOverviewPath,
  product: appIO,
  hero: {
    altText: 'Hero: Raccogli i servizi del tuo ente in un unico spazio',
    backgroundImage: '/images/hero.jpg',
    title: 'Raccogli i servizi del tuo ente in un unico spazio',
    subtitle:
      "Con l’app IO accresci la visibilità dei servizi offerti dal tuo ente, offri alla cittadinanza un'esperienza digitale di qualità e risparmi sulle spese di implementazione tecnologica.",
  },
  feature: {
    title: 'Perché l’app IO',
    subtitle:
      'Che tu sia un ente pubblico, privato, centrale o locale, tramite IO potrai:',
    items: [
      {
        iconName: 'MessageRounded',
        subtitle: 'Contatta le cittadine e i cittadini in modo rapido e sicuro',
        title: 'Inviare messaggi',
      },
      {
        iconName: 'PaymentsRounded',
        subtitle: 'Invia avvisi di pagamento e riduci i tempi di incasso',
        title: 'Ottenere pagamenti',
      },
      {
        iconName: 'CreateRounded',
        subtitle:
          'Richiedi la firma digitale di documenti e contratti grazie a Firma con IO ',
        title: 'Far firmare documenti',
      },
    ],
  },
  tutorial: {
    subtitle:
      'Non sai come si manda un messaggio? Vuoi creare un servizio ma non sai da dove iniziare? Risolvi ogni dubbio con questi brevi tutorial.',
    list: tutorials,
  },
  postIntegration: {
    cta: {
      label: 'Vai al manuale dei servizi',
      href: '/',
    },
    subtitle:
      'Scopri cosa può fare un servizio su IO e come pubblicarlo in app. Leggi il manuale dei servizi per creare un servizio da zero o personalizza uno dei tanti modelli disponibili.',
    listTitle: 'MODELLI DEI SERVIZI',
    list: [
      {
        title: 'Tassa sui rifiuti (TARI)',
        description:
          'Scheda e modelli di messaggi del servizio che invia comunicazioni in merito alla Tassa sui rifiuti (TARI).',
        path: '/app-io/guides/1',
        name: 'guides 1',
      },
      {
        title: "Carta d'Identità Elettronica",
        description:
          "Scheda e modelli di messaggi del servizio che riguarda la richiesta e l'emissione della Carta d'Identità Elettronica.",
        path: '/app-io/guides/2',
        name: 'guides 2',
      },
      {
        title: 'Rimozione veicoli',
        description:
          'Scheda e modelli di messaggi del servizio che riguarda la rimozione, il deposito e il ritorno alla circolazione dei veicoli.',
        path: '/app-io/guides/3',
        name: 'guides 3',
      },
      {
        title: 'Multe per violazioni codice della strada',
        description:
          'Scheda e modelli di messaggi del servizio che riguarda le violazioni al Codice della Strada.',
        path: '/app-io/guides/4',
        name: 'guides 4',
      },
    ],
  },
  relatedLinks: [
    {
      path: 'https://files.gitbook.com/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FZugEhXfhuchEaSiqU3p5%2Fuploads%2FKkqRR4GLnQtJ04He1afT%2FAccordo%20Base%20di%20Adesione%20App%20IO_Standard_Ver.2.4.16_1_2023.docx.pdf?alt=media',
      name: 'Scarica il contratto di adesione a IO',
    },
    {
      path: '/',
      name: 'Leggi kit di comunicazione',
    },
  ],
  startCards: [
    {
      title: 'Quick Start',
      coomingSoon: true,
      text: 'Aderire a IO tramite l’Area Riservata, creare un servizio, verificare l’esistenza di un utente, inviare un messaggio: ecco come si fa.',
      iconName: 'FlagOutlined',
    },
    {
      title: 'Documentazione Api',
      text: "Esplora le API Rest per l'invio dei messaggi e la creazione di servizi sull'app IO.",
      href: '/',
      iconName: 'FolderOutlined',
    },
  ],
  bannerLinks: [
    {
      theme: 'dark',
      title: 'Hai bisogno di aiuto?',
      decoration: 'HeadsetMic',
      body: "Scrivi un'email in cui descrivi il tuo problema o dubbio all'indirizzo <strong>onboarding@io.italia.it</strong>",
    },
    {
      theme: 'light',
      title: 'Dicci cosa ne pensi',
      decoration: 'Feedback',
      body: "Per segnalare problemi o dare feedback, lascia un commento nello <strong>spazio Github</strong> dell'app IO",
    },
  ],
};
