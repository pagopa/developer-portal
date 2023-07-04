import { OverviewData } from '@/lib/types/overviewData';
import { appIO } from '@/_contents/appIo/appIO';
import { appIoOverviewPath } from '@/_contents/appIo/overviewPath';
import { guides } from '@/_contents/appIo/guides';
import { tutorials } from '@/_contents/appIo/tutorials';

export const appIoOverview: OverviewData = {
  ...appIoOverviewPath,
  product: appIO,
  hero: {
    altText: 'Hero: Raccogli i servizi del tuo ente in unico spazio',
    backgroundImage: '/images/hero.jpg',
    title: 'Raccogli i servizi del tuo ente in unico spazio',
    subtitle:
      "Con l’app IO accresci la visibilità dei servizi offerti dal tuo ente, offri alla cittadinanza un'esperienza digitale di qualità e risparmi sulle spese di implementazione tecnologica.",
  },
  feature: {
    title: 'Perché l’app IO',
    subtitle:
      'Che tu sia un ente pubblico, privato, centrale o locale, tramite IO potrai:',
    items: [
      {
        stackIcon: {
          icon: 'MessageRounded',
        },
        subtitle: 'Contatta le cittadine e i cittadini in modo rapido e sicuro',
        title: 'Inviare messaggi',
      },
      {
        stackIcon: {
          icon: 'PaymentsRounded',
        },
        subtitle: 'Invia avvisi di pagamento e riduci i tempi di incasso',
        title: 'Ottenere pagamenti',
      },
      {
        stackIcon: {
          icon: 'CreateRounded',
        },
        subtitle:
          'Richiedi la firma digitale di documenti e contratti grazie a Firma con IO ',
        title: 'Far firmare documenti',
      },
    ],
  },
  tutorials: tutorials,
  guides: guides,
  relatedLinks: [
    {
      path: '/',
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
      text: 'Aderire a IO tramite l’Area Riservata, creare un servizio, verificare l’esistenza di un utente, inviare un messaggio: ecco come si fa.',
      href: '/',
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
