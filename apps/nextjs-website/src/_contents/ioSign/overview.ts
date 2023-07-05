import { OverviewData } from '@/lib/types/overviewData';
import { ioSign } from '@/_contents/ioSign/ioSign';
import { ioSignOverviewPath } from '@/_contents/ioSign/overviewPath';
import { tutorials } from '@/_contents/ioSign/tutorials';

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
        stackIcon: {
          icon: 'MessageRounded',
        },
        subtitle:
          'Invia un messaggio con i documenti da firmare e indica una scadenza. Inoltra la richiesta di firma ai tuoi utenti nel modo che preferisci',
        title: "Richiedere una firma tramite l'app IO",
      },
      {
        stackIcon: {
          icon: 'PaymentsRounded',
        },
        subtitle:
          'Richiedi la firma di uno o più documenti direttamente sul tuo sito web, attraverso un pulsante dedicato che permette di aprire i documenti su IO e completare l’operazione',
        title: 'Richiedere una firma online, direttamente sul tuo sito web',
      },
      {
        stackIcon: {
          icon: 'CreateRounded',
        },
        subtitle:
          'Una firma totalmente da remoto e con massima validità legale. Erogata attraverso un canale già noto e affidabile, con una UX efficace è più semplice possibile',
        title: 'Ottenere firme digitali con massimo valore legale',
      },
    ],
  },
  startCards: [
    {
      title: 'Quick Start',
      text: '6 semplici passi per inviare e ricevere un documento firmato digitalmente',
      href: '/',
      iconName: 'FlagOutlined',
    },
    {
      title: 'Documentazione API',
      text: "Esplora le API Rest per l'invio delle richieste di firma e per la raccolta dei documenti firmati",
      href: ioSign.subpaths.api?.path ?? '#',
      iconName: 'FolderOutlined',
    },
  ],
  tutorials: tutorials,
};
