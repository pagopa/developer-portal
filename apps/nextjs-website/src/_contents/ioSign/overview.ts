import { OverviewData } from '@/lib/types/overviewData';
import { ioSign } from '@/_contents/ioSign/ioSign';
import { ioSignOverviewPath } from '@/_contents/ioSign/overviewPath';
import { ioSignTutorials } from '@/_contents/ioSign/tutorialLists';

export const ioSignOverview: OverviewData = {
  ...ioSignOverviewPath,
  product: ioSign,
  hero: {
    altText: 'Hero: Raccogli i servizi del tuo ente in unico spazio',
    backgroundImage: '/images/hero.jpg',
    title: 'Raccogli i servizi del tuo ente in unico spazio',
    subtitle:
      "Con l’app IO accresci la visibilità dei servizi offerti dal tuo ente, offri alla cittadinanza un'esperienza digitale di qualità e risparmi sulle spese di implementazione tecnologica.",
  },
  feature: {
    title: 'Perché Firma con IO',
    subtitle:
      'Che tu sia un ente pubblico, privato, centrale o locale, tramite Firma con IO potrai:',
    items: [
      {
        iconName: 'MessageRounded',
        subtitle:
          'Invia un messaggio con i documenti da firmare e indica una scadenza. Inoltra la richiesta di firma ai tuoi utenti nel modo che preferisci',
        title: "Richiedere una firma tramite l'app IO",
      },
      {
        iconName: 'PaymentsRounded',
        subtitle:
          'Richiedi la firma di uno o più documenti direttamente sul tuo sito web, attraverso un pulsante dedicato che permette di aprire i documenti su IO e completare l’operazione',
        title: 'Richiedere una firma online, direttamente sul tuo sito web',
      },
      {
        iconName: 'CreateRounded',
        subtitle:
          'Una firma totalmente da remoto e con massima validità legale. Erogata attraverso un canale già noto e affidabile, con una UX efficace è più semplice possibile',
        title: 'Ottenere firme digitali con massimo valore legale',
      },
    ],
  },
  startInfo: {
    cards: [
      {
        title: 'Quick Start',
        coomingSoon: true,
        text: '6 semplici passi per inviare e ricevere un documento firmato digitalmente',
        iconName: 'FlagOutlined',
      },
      {
        title: 'Documentazione API',
        text: "Esplora le API Rest per l'invio delle richieste di firma e per la raccolta dei documenti firmati",
        href: ioSign.subpaths.api?.path ?? '#',
        iconName: 'FolderOutlined',
      },
    ],
  },
  tutorials: {
    subtitle:
      'Cosa serve per preparare il documento da firmare? Come si crea una richiesta di firma? Risolvi ogni dubbio con questi brevi tutorial.',
    list: ioSignTutorials,
  },
  bannerLinks: [
    {
      theme: 'dark',
      title: 'Serve aiuto durante l’integrazione?',
      decoration: 'LiveHelp',
      body: 'Scrivi un’e-mail in cui descrivi il tuo problema o dubbio all’indirizzo <strong>firmaconio-tech@pagopa.it</strong>',
    },
    {
      theme: 'light',
      title: 'Assistenza continua',
      decoration: 'HeadsetMic',
      body: 'Per problemi o dubbi dopo l’integrazione, scrivici all’indirizzo <strong>enti-firmaconio@assistenza.pagopa.it</strong>',
    },
  ],
};
